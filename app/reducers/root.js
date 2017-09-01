import * as d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from '../components/plot/plot-initial';
import macroData from './data'

const rand = d3.randomNormal();

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
    state = repair(reduceTick4(state, action));
    reduceVictory(state);
    return state;
    /*
    switch (state.stage) {
        case 0: return repair(reduceTick0(state, action));
        case 1: return repair(reduceTick1(state, action));
        case 2: return repair(reduceTick2(state, action));
        case 3: return repair(reduceTick3(state, action));
        case 4: return repair(reduceTick4(state, action));
    }
    return repair(reduceTick0(state, action));
    */
};

const reduceVictory = (state) => {
    // If the player has already won or lost, keep it that way (the race is over)
    if (state.victory != 0) return;

    // Conditions for loss
    if (state.stage >= 0) {
        if (state.π >= 0.08) {
            state.victory = -1;
            state.status = "Inflation is too high. You have been asked to resign.";
            return;
        }
        if (state.π <= 0) {
            state.victory = -1;
            state.status = "Negative Inflation (Deflation) is frowned upon. You have been asked to resign.";
            return;
        }
    }
    if (state.stage >= 2) {
        if (state.u >= 0.08) {
            state.victory = -1;
            state.status = "Unemployment is too high. You have been asked to resign.";
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

const reduceTick0 = (state, action) => {
    let { πₑ, y, u, time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    const dt = action.dt / 1000;

    // Nothing happens in this version. The player just moves i up and down

    const newState = {
        ...state,
        time: time + dt,
    };

    history = history.filter(d => (time - d.time) <= state.winTime);

    newState.history = [
        ...history, {...state }
    ];

    return newState;
};
/*
const reduceTick0 = (state, action) => {
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
    
    // The real interest rate, using vanilla inflation
    r = i - π;

    // ????????
    ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))

    // Nominal Inflation
    π = π + (y - ȳ ) / (σπ*100);

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

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

    history = history.filter(d => (time - d.time) <= 5);

    newState.history = [
        ...history, {...state }
    ];

    return newState;
};
*/
const reduceTick1 = (state, action) => {
    let { r, π, πₑ, y, ẏ , u, u̇ , time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    // DeltaTime is our timestep
    const dt = action.dt / 1000;

    // Epsilon is some small random number
    const ϵ = 0;//rand() * .003;

    // Uh... I guess this introduces occasional moderate perturbations?
    const η = 0;//Math.random() < .25 ? rand() * .015 : 0;

    // And this must produce rare large perturbations
    const bigOne = 0;//Math.random() < .04 ? rand() * .04 : 0;
    
    // The real interest rate, using vanilla inflation
    r = i - π;

    // ????????
    ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    //y = Math.min(y, ȳ + ū * σu *0);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))

    // Nominal Inflation
    π = π + (y - ȳ ) / (σπ*50);

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

const reduceTick2 = (state, action) => {
    let { r, π, πₑ, y, ẏ , u, u̇ , time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    // DeltaTime is our timestep
    const dt = action.dt / 1000;

    // Epsilon is some small random number
    const ϵ = 0;//rand() * .003;

    // Uh... I guess this introduces occasional moderate perturbations?
    const η = 0;//Math.random() < .25 ? rand() * .015 : 0;

    // And this must produce rare large perturbations
    const bigOne = 0;//Math.random() < .04 ? rand() * .04 : 0;
    
    // The real interest rate
    r = i - πₑ;

    // ????????
    ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))

    // Nominal Inflation
    π = πₑ + (y - ȳ ) / σπ;

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate
    u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);


    // u = ū -(y - ȳ)/σu;
    // u = ū - (Math.exp(y-ȳ)-1)/σu;
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

const reduceTick3 = (state, action) => {
    let { r, π, πₑ, y, ẏ , u, u̇ , time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    // DeltaTime is our timestep
    const dt = action.dt / 1000;

    // Epsilon is some small random number
    const ϵ = 0;//rand() * .003;

    // Uh... I guess this introduces occasional moderate perturbations?
    const η = 0;//Math.random() < .25 ? rand() * .015 : 0;

    // And this must produce rare large perturbations
    const bigOne = 0;//Math.random() < .04 ? rand() * .04 : 0;
    
    // The real interest rate
    r = i - πₑ;

    // ????????
    ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    // y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū*σu))

    // Nominal Inflation
    π = πₑ + (y - ȳ ) / σπ;

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate
    u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);


    // u = ū -(y - ȳ)/σu;
    // u = ū - (Math.exp(y-ȳ)-1)/σu;
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

const reduceTick4 = (state, action) => {
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
    π = πₑ + (y - ȳ ) / σπ;

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate
    u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);


    // u = ū -(y - ȳ)/σu;
    // u = ū - (Math.exp(y-ȳ)-1)/σu;
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
    winTime: 20,
    maxTime: 25,

    maxStage: 5,
    stage: 0,
    victory: 0,
    paused: true,
    status: "Drag the chart to begin",

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
                stage: data.maxStage
            };
        case 'ADVANCE':
            console.log("Advancing state of model to %s", data.stage+1);
            return {
                ...defaultData,
                stage: Math.min(data.stage+1, data.maxStage)
            };
        case 'RESET':
            console.log("Reset");
            return {
                ...defaultData,
                stage: data.stage
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
                    //0,
                    //maxTime
                    h[0].time,
                    h[0].time+data.maxTime
                    //h[h.length - 1].time + 20
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
