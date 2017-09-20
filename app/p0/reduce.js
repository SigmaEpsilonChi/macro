import * as d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from './plot/plot-initial';
import pmf from 'distributions-poisson-pmf';

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

const reduceTick = (state, action, config) => {
    if (state.paused) return state;
    state = tickData(state, action, config);
    // state = tickBombs(state, action, config);
    state = repair(state);
    tickVictory(state, config);
    return state;
};

const tickData = (state, action, config) => {
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
    

    const q = tickRiBombs(state, action, config);
    console.log("q="+(Math.round(q*100)/100));

    // The real interest rate
    r = i - πₑ;

    r = d3.interpolate(r, r̄ +0.028)(q);

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

    history = history.filter(d => (time - d.time) <= config.winTime);

    newState.history = [
        ...history, {...state }
    ];

    return newState;
};

const tickBomb = (state, dt, bomb) => {
    let s = Math.pow((state.time-bomb.t)/bomb.r, 2);
    // let e = bomb.m*/(1+s);
    // state.π += e*dt;
    // state.u += dt*bomb.um/(1+s);
    state.πₑ += dt*bomb.pm/(1+s);
    // state.y += e*dt;
    // return π+e*dt;
}

const tickBombs = (state, action, config) => {
    if (config.bombs) {
        config.bombs.forEach(function(b){
            tickBomb(state, action.dt/1000, b);
        });
    }
    return state;
}

const tickRiBomb = (state, bomb) => {
    let s = (state.time-bomb.t);
    if (s < 0) return 0;
    let s0 = Math.floor(s);
    let s1 = Math.ceil(s);
    let p0 = pmf(s0, {lambda: bomb.r})*bomb.m;
    let p1 = pmf(s1, {lambda: bomb.r})*bomb.m;
    let p = d3.interpolate(p0, p1)(s-s0);
    p *= Math.min(s/bomb.f, 1);
    // console.log("P="+Math.round(p*100)/100);
    return p;
    // let s = Math.pow((state.time-bomb.t)/bomb.r, 2);
    // let e = bomb.m*/(1+s);
    // state.π += e*dt;
    // state.u += dt*bomb.um/(1+s);
    // state.πₑ += dt*bomb.pm/(1+s);
    // state.y += e*dt;
    // return π+e*dt;
    // return bomb.pm/(1+s);
}

const tickRiBombs = (state, action, config) => {
    let r = 0;
    if (config.bombs) {
        config.bombs.forEach(function(b){
            r += tickRiBomb(state, b);
        });
    }
    return r;
}


const tickVictory = (state, config) => {
    // If the player has already won or lost, keep it that way (the race is over)
    if (state.victory != 0) return;


    // If the player has made it all the way to the end, they win
    if (state.time > config.winTime) {
        state.victory = 1;
        state.status = "Congratulations, you made it through the year!";
        return;
    }

    // Conditions for loss
    if (config.symbols.includes("π") && config.symbols.includes("u")) {
        if (state.u > 0.05 && state.π > 0.05) {
            if (config.symbols.includes("π") && state.π > 0.05) {
                state.status = "Unemployment and Inflation are both too high! STAGFLATION!";
            }
            return;
        }
    }

    if (config.symbols.includes("π")) {
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
    if (config.symbols.includes("u")) {
        if (state.u >= 0.08) {
            state.victory = -1;
            state.status = "Unemployment is too high. You have been asked to resign.";
            return;
        }
        else if (state.u > 0.05) {
            state.status = "We need more jobs! Lower your rates!";
        }
    }

    if (!state.paused) state.status = "So far, so good...";

    return;
}

const defaultData = {
    //variables
    y: 0.05,
    i: .03,
    πₑ: .02,
    r: .02,
    π: .02,
    u: .05,

    //params
    ȳ: 0.05,
    r̄: .02,
    ū: .05,

    //\sigmas
    σπₑ: 1.3,
    σπ: 2.15,
    σy: 1.2,
    σu: 2,

    time: 0,
    victory: 0,
    paused: true,
    status: "Drag the chart to begin",

    history: []
};

defaultData.history = _.map(_.range(0, 0.003, .003), time => ({...defaultData, time}));
// defaultData.history = [{...defaultData}];

const defaultConfig = {
    times: {
        win: 15,
        max: 20,
    },
    symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    advanceCallback: null,
    initialData: defaultData,
    bombs: [],
};

const passData = (state, datum, dt, config) => {
    let { r, π, πₑ, y, ẏ , u, u̇ , time, history } = state;
    const { σπₑ, σπ, σy, σu, ȳ, ū, r̄, i } = state;

    // DeltaTime is our timestep
    // const dt = action.dt / 1000;

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
    // π = πₑ + (y - ȳ ) / σπ;

    // Expected inflation will be perturbed by the current difference between inflation and expected inflation.
    // This process reflects the fact that people learn to expect inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate
    u̇ = -ẏ / σu;
    u += u̇ * dt;
    u = Math.max(u, 0);

    // let history = state.history;
    // let time = state.time;

    const newState = {
        ...state,
        y: datum.gdp/100,
        // pd: pd,
        // ȳ,
        i: datum.ffr/100,
        π: datum.inf/100,
        πₑ,
        // πₑ: d3.interpolate(state.πₑ, datum.inf/100)(0.15),
        u: datum.sur/100,
        time: time+dt,
        ...config.shims,
    };

    history = history.filter(d => (time - d.time) <= config.winTime);

    newState.history = [
        ...history, {...state}
    ];

    return newState;
};

// Nobody is allowed to read this awful function, k?
const remapMacroData = (a, t0, t1, config) => {
    // a.unshift(defaultData);
    //let len = a.length;
    //let ti = d3.interpolate(t0, t1);
    let tr = defaultData;
    // let history = [{...defaultData}];
    let dt = (t1-t0)/a.length;
    while (a.length > 0) {
        tr = (passData(tr, a.shift(), dt, config));
    }
    return tr;
}

const reduceData = (data, action, config) => {
    switch (action.type) {
        case 'SET_MACRO':
            console.log("Setting macro data");
            // config.macro = action.macroData;
            config.initialData = remapMacroData(action.macroData, 0, 20, config);
            return config.initialData;
        case 'CONFIGURE':
            console.log("Resetting upon configure");
            return config.initialData;
        case 'ADVANCE':
            console.log("Resetting upon advance");
            return config.initialData;
        case 'TICK':
            return reduceTick(data, action, config);
        case 'RESET':
            console.log("Reset");
            return config.initialData
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
        case 'PLAY':
            return {
                ...data,
                paused: false
            };
        default:
            return data;
    }
};

const reducePlot = (plot, data, action, config) => {
    switch (action.type) {
        case 'CHANGE_PLOT':
            return _.assign({}, plot, action.changes);
        case 'RESET':
            return plot;
        case 'TICK':
            const h = data.history,
                xDomain = [
                    h[0].time,
                    h[0].time+config.maxTime
                ];
            return {...plot, xDomain};
        default:
            return plot;
    }
};

const reduceConfig = (config, action) => {
    switch (action.type) {
        case 'CONFIGURE':
            console.log("Configure");
            // return action.config ? _.defaults(action.config, defaultConfig) : defaultConfig;
            let initialData = action.config.initialData ?
                {...defaultConfig.initialData, ...action.config.initialData} :
                {...defaultConfig.initialData};
/*
            if (action.config.bombs) {
                action.config.forEach(function(b){
                    b.distribution
                });
            }
*/
            return action.config ?
                {...defaultConfig, ...action.config, initialData} :
                defaultConfig;
        case 'ADVANCE':
            if (!config.advanceCallback) return config;
            else return {...defaultConfig, ...config.advanceCallback(config)};
        default:
            return config;
    }
};

const reduceMacro = (macro, action, config) => {
    switch (action.type) {
        case 'SET_MACRO':
            config.macro = action.macroData;
            return macro;
            // return {...macro, ...action.changes};
        default:
            return macro;
    }
};

const rootReduce = (state = {data: defaultData, plot: plotInitialState, config: defaultConfig}, action) => {
    const config = reduceConfig(state.config, action);
    // const macro = reduceMacro(state.macro, action, config);
    const data = reduceData(state.data, action, config);
    const plot = reducePlot(state.plot, data, action, config);
    // console.log(plot.xDomain);
    return {data, plot, config};
};

const store = createStore(rootReduce);

export default store;
