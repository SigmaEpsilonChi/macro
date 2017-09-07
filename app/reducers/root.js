import * as d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from '../components/plot/plot-initial';
import macroData from './data'

const rand = d3.randomNormal();

const challenges = [
    [],
    ["i", "π"],
    ["i", "π", "r"],
    ["i", "u", "π", "r"],
    ["i", "π", "πₑ", "r", "u"],
    ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    // ["i", "π", "πₑ", "r", "u"],
    // ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
];
//    ["i", "π", "πₑ", "u", "ū", "r", "r̄"]

const repair = (state) => {
    for (var key in state) {
        if (!state.hasOwnProperty(key)) continue;

        if (state[key] != state[key]) {
            console.log("Value %s is NaN. Resetting to %s", key, defaultData[key]);
            state[key] = defaultData[key];
        }
    }
    return state;
}

const reduceTick = (state, action) => {
    if (state.paused) return state;
    state = repair(tickData(state, action));
    tickVictory(state);
    return state;
};

const tickData = (state, action) => {
    let { r, π, πₑ, y, ẏ , u, u̇ , time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    // DeltaTime is our timestep
    const dt = action.dt / 1000;

    // Epsilon is some small random number
    const ϵ = rand() * .003;

    // Uh... I guess this introduces occasional moderate perturbations?
    const η = Math.random() < .25 ? rand() * .015 : 0;

    // And this must produce rare large perturbations
    const bigOne = Math.random() < .04 ? rand() * .04 : 0;
    
    // The real interest rate
    r = i - πₑ;

    // ????????
    ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))

    // Nominal Inflation
    //if (state.challenge.includes("πₑ")) π = πₑ + (y - ȳ ) / σπ;
    //else π = π + (y - ȳ ) / (σπ*100);
    π = πₑ + (y - ȳ ) / σπ;

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate
    u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);

    const newState = {
        ...state,
        πₑ,
        y,
        ȳ,
        u,
        π,
        r,
        time: time + dt,
    };

    history = history.filter(d => (time - d.time) <= state.winTime);

    newState.history = [
        ...history, {...state }
    ];

    return newState;
};

const tickVictory = (state) => {
    // If the player has already won or lost, keep it that way (the race is over)
    if (state.victory != 0) return;

    // Conditions for loss
    if (state.challenge.includes("π")) {
        if (state.π >= 0.08) {
            state.victory = -1;
            state.status = "Inflation is too high. You have been asked to resign.";
            return;
        }
        else if (state.π > 0.05) {
            state.status = "Too much inflation! Raise your rates!";
            return;
        }

        if (state.π <= 0) {
            state.victory = -1;
            state.status = "Negative Inflation (Deflation) is bad. You have been asked to resign.";
            return;
        }
        else if (state.π < 0.015) {
            state.status = "Watch out for deflation! Lower your rates!";
            return;
        }
    }
    if (state.challenge.includes("u")) {
        if (state.u >= 0.08) {
            state.victory = -1;
            state.status = "Unemployment is too high. You have been asked to resign.";
            return;
        }
        else if (state.u > 0.05) {
            state.status = "We need more jobs! Lower your rates!";
            return;
        }
    }

    if (state.time > state.winTime) {
        state.victory = 1;
        state.status = "Congratulations, you made it through the year!";
        return;
    }

    if (!state.paused) state.status = "So far, so good...";
    // If the player has made it all the way to the end, they win
    return;
}

const defaultData = {
    //variables
    y: 0.05,
    i: .03,
    πₑ: .02,
    r: .02,
    π: .02,
    u: .045,

    //params
    ȳ: 0.05,
    r̄: .02,
    ū: .045,

    //\sigmas
    σπₑ: 1.3,
    σπ: 2.15,
    σy: 1.2,
    σu: 2,

    time: 0,
    winTime: 15,
    maxTime: 20,

    maxStage: challenges.length-1,
    stage: 0,
    victory: 0,
    paused: true,
    status: "Drag the chart to begin",
    challenge: challenges[0],

    history: []
};

defaultData.history = _.map(_.range(0, 0.003, .003), time => ({...defaultData, time }));

const resetData = () => {
    return {
        ...defaultData,
        history: []
    }
}

const reduceData = (data, action) => {
    switch (action.type) {
        case 'TICK':
            return reduceTick(data, action);
        case 'CONCLUDE':
            console.log("Concluding", data.stage+1);
            return {
                ...defaultData,
                stage: data.maxStage,
                challenge: challenges[data.maxStage]
            };
        case 'ADVANCE':
            console.log("Advancing state of model to %s", data.stage+1);
            ga('send', {
                hitType: 'event',
                eventCategory: 'Advance',
                eventAction: 'stage: '+(data.stage+1),
                eventLabel: 'advance',
                eventValue: (data.stage+1),
            });
            return {
                ...defaultData,
                stage: Math.min(data.stage+1, data.maxStage),
                challenge: challenges[Math.min(data.stage+1, data.maxStage)]
            };
        case 'RESET':
            console.log("Reset");
            return {
                ...defaultData,
                stage: data.stage,
                challenge: challenges[data.stage]
            };
        case 'SET_VARIABLE':
            return {
                ...data,
                [action.variable]: action.value
            };
        case 'SET_I':
            return {
                ...data,
                paused: false,
                i: action.i
            };
        case 'PAUSE_PLAY':
            return {
                ...data,
                paused: !data.paused
            };
        case 'PAUSE':
            return {
                ...data,
                paused: true
            };
        case 'PAUSE':
            return {
                ...data,
                paused: false
            };
        default:
            return data;
    }
};

const reducePlot = (plot, data, action) => {
    switch (action.type) {
        case 'CHANGE_PLOT':
            return _.assign({}, plot, action.changes);
        case 'RESET':
            return plot;
        case 'TICK':
            const h = data.history,
                xDomain = [
                    h[0].time,
                    h[0].time+data.maxTime
                ];
            return {...plot, xDomain };
        default:
            return plot;
    }
};

const reduceMacro = (macro, action) => {
    switch (action.type) {
        case 'CHANGE_MACRO':
            return {...macro, ...action.changes };
        default:
            return macro;
    }
};

const rootReduce = (state = {
    data: defaultData,
    plot: plotInitialState
}, action) => {
    const data = reduceData(state.data, action);
    const plot = reducePlot(state.plot, data, action);
    return { data, plot, macroData };
};

const store = createStore(rootReduce);

export default store;
