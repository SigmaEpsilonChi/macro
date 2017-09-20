import * as d3 from 'd3';
import _ from 'lodash';
import { createStore } from 'redux';
import plotInitialState from './plot-initial';
import pmf from 'distributions-poisson-pmf';

const rand = d3.randomNormal();

// This may have morphed into a totally ugly abuse of Redux. Oh well.

const limits = {
    π: [-1, 1],
    πₑ: [-1, 1],
    u: [-1, 1],
    r: [-1, 1],
    y: [-1, 1],
}

const repair = (state) => {
    for (var key in state) {
        if (!state.hasOwnProperty(key)) continue;

        if (state[key] != state[key]) {
            console.log("Value %s is NaN. Resetting to %s", key, defaultData[key]);
            state[key] = defaultData[key];
        }
        if (limits[key]) {
            state[key] = Math.max(state[key], limits[key][0]);
            state[key] = Math.min(state[key], limits[key][1]);
        }
    }
    return state;
}

const reduceTick = (state, action, config) => {
    // if (state.paused) return state;
    let deltaState = {...state, paused: false};
    state = tickData(state, action, config);
    // state = tickBombs(state, action, config);

    const deltas = tickData(deltaState, action, config);
    _.forOwn(deltas, (v, k) => {
        deltas[k] = _.isNumber(deltas[k]) ?
            (deltas[k]-deltaState[k])/(action.dt/1000) :
            deltas[k]
    });
    state.deltas = deltas;

    state = repair(state);
    tickVictory(state, config);
    return state;
};

const tickData = (state, action, config) => {
    let {r, π, πₑ, y, /*ẏ ,*/ u, /*u̇ ,*/ time, history} = state;
    const {σπₑ, σπ, σy, σu, σw, ȳ, ū, r̄, i} = state;

    // DeltaTime is our timestep
    const dt = state.paused ? 0 : action.dt/1000;
    // const dt = action.dt/1000;

    // Minor noise
    const ϵ = config.noisy ? rand() * .003 : 0;

    // Moderate perturbations
    const η = config.noisy ? (Math.random() < .25 ? rand() * .015 : 0) : 0;

    // Big shocks
    const bigOne = config.noisy ? (Math.random() < .04 ? rand() * .04 : 0) : 0;

    // The real interest rate
    r = i - πₑ;

    // r = d3.interpolate(r, r̄ +0.028)(q);

    // Pretty sure y is GDP
    const ẏ = -(r - r̄ ) / σy + η + bigOne;
    y += ẏ * dt; // with demand shock
    // console.log("y=%s, ȳ +ū =%s", Math.round(y*100)/100, Math.round((ȳ + ū )*100)/100)
    // y = Math.min(y, ȳ + ū * σu);
    // y = Math.min(y, ȳ + Math.log(1+ū * σu))

    // Nominal Inflation
    π = πₑ + (y - ȳ ) / σπ;
    π -= dt * ( u - ū ) / σw;

    // Expected inflation moves toward inflation
    const π̇_e = (π - πₑ) / σπₑ + ϵ;
    πₑ += dt * π̇_e;

    // The unemployment rate. Change in u is inversely proportional to change in GDP
    const u̇ = -ẏ / σu;
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

    if (dt > 0 && config.winTime) {
        history = history.filter(d => (time - d.time) <= config.winTime);
        newState.history = [...history, _.omit(state, 'history')];
    }

    return newState;
    // return state.paused ? state : newState;
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

const checkCondition = (v, s, d) => {
    let d0 = Math.sign(s[v.symbol]-v.value);
    let d1 = Math.sign(v.value-d[v.symbol]);
    // console.log("Checking condition %s: d0=%s, d1=%s", v, d0, d1);
    return d0 == d1;
}

const checkFail = (c, s, d) => {
    if (!c) return false;
    return _.find(c.vals, v => checkCondition(v, s, d));
}

const checkGoal = (c, s, d) => {
    if (!c) return false;
    let timerFail = _.find(c.vals, v => {
        if (!v.timer) return false;
        if (!checkCondition(v, s, d)) return false;
        return v.timer.after ? v.timer.t < s.time : v.timer.t > s.time;
    });
    if (timerFail) return timerFail;
    return _.every(c.vals, v => checkCondition(v, s, d));
}

const tickVictory = (state, config) => {
    // If the player has already won or lost, keep it that way until reset
    if (state.victory != 0) return;

    if (config.winTime < state.time) {
        state.victory = 1;
        state.status = config.prompts.goal;
        return;
    }


    // let fail = checkCondition(config.fail, state, config.initialData);
    let fail = checkFail(config.fail, state, config.initialData);
    if (fail) {
        state.victory = -1;
        state.status = fail.prompt ? fail.prompt :
            config.fail.prompt ? config.fail.prompt :
                config.prompts.fail;
        return;
    }

    // let goal = checkCondition(config.goal, state, config.initialData);
    let goal = checkGoal(config.goal, state, config.initialData);
    if (_.isObject(goal)) {
        state.victory = -1;
        state.status = goal.timer.prompt;
        return;
    }
    else if (goal) {
        state.victory = 1;
        state.status = goal.prompt ? goal.prompt : config.prompts.goal;
        return;
    }

    if (state.time == 0) state.status = config.prompts.start;
    else if (state.paused) state.status = config.prompts.pause;
    else state.status = config.prompts.run;

    return;
}

const defaultData = {
    //variables
    y: .05,
    i: .03,
    πₑ: .02,
    r: .02,
    π: .02,
    u: .05,

    //params
    ȳ: .05,
    r̄: .02,
    ū: .05,

    //\sigmas
    σπₑ: 1.3,
    σπ: 2.15,
    σy: 1.2,
    σu: 2,
    σw: 1,

    time: 0,
    rawTime: 0,
    victory: 0,
    paused: true,
    status: "",

    history: [],
};


const deltas = _.pickBy(defaultData, (v, k) => _.isNumber(v));
_.forOwn(deltas, (v, k) => 0);
defaultData.deltas = deltas;

//defaultData.history = _.map(_.range(0, 0.003, .003), time => ({...defaultData, time}));
defaultData.history = [{...defaultData}];

const defaultConfig = {
    maxTime: 1,
    symbols: ["i", "π", "r"],
    // symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    advanceCallback: null,
    initialData: defaultData,
    complete: false,
    bombs: [],
    prompts: {
        start: "Drag the chart to begin",
        pause: "Drag to keep moving!",
        run: "",
        goal: "u win yay",
        fail: "u lose haha",
    },
};

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
            // config.complete = true;
            // config.hide = true;
            // if (config.advanceCallback) config.advanceCallback();
            return config.initialData;
        case 'TICK':
            return reduceTick(data, action, config);
        case 'RESET':
            console.log("Reset");
            config.hide = false;
            return config.initialData
        case 'SET_VARIABLE':
            return {
                ...data,
                [action.variable]: action.value
            };
        case 'SET_I':
            return {
                ...data,
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
            const h = data.history;
            const trimTime = config.winTime ? config.winTime : config.maxTime*2/3;
            const xDomain = [
                Math.max(0, data.time-trimTime),
                Math.max(data.time+config.maxTime-trimTime, config.maxTime),
                // h[0].time,
                // h[0].time+config.maxTime
            ];
            return {...plot, xDomain};
        default:
            return plot;
    }
};

// Converts convenience formats for goal/fail/warn into the following format:
// goal: {
//   vals: [
//     {symbol: 'π', value: '0'},
//     {symbol: 'u', value: '0.1'},
//   ],
//   prompt: "This is the prompt when the goal is reached",
// }
const preprocessConfigCondition = (c, k) => {
    if (c[k]) {
        // goal: [
        //   {symbol: 'π', value: '0'},
        //   {symbol: 'u', value: '0.1'},
        // ]
        if (_.isArray(c[k])) {
            c[k] = {vals: c[k]};
        }
        else if (c[k].vals) {
        // goal: {
        //   vals: {symbol: 'π', value: '0'},
        //   prompt: "This is the prompt when the goal is reached",
        // }
            if (_.isObject(c[k].vals)) c[k].vals = [c[k].vals];
        // Format already appears correct.
            // else return;
        }
        // goal: {
        //   symbol: 'π',
        //   value: '0',
        // }
        else if (c[k].symbol) {
            c[k] = {vals: [{...c[k]}]};
        }
        // goal: {
        //   π: 0,
        //   u: 0.1,
        // }
        else {
            c[k] = {vals: _.zip(_.keys(c[k]), _.values(c[k]))};
        }

        _.each(c[k].vals, v => {
            if (!v.sign) v.sign = Math.sign(v.value-c.initialData[v.symbol]);
        });
    }
    // No such condition on this config
}

const preprocessConfig = c => {
    preprocessConfigCondition(c, 'goal');
    preprocessConfigCondition(c, 'fail');
    preprocessConfigCondition(c, 'warn');
    c.initialData.history = [{...c.initialData}];
}

const reduceConfig = (config, action) => {
    switch (action.type) {
        case 'CONFIGURE':
            console.log("Configure");

            var subConfig = action.config.configs ? action.config.configs.shift() : {};
            let c = {};
            _.merge(c, defaultConfig, action.config, subConfig);
            // Mutatin' state up in here.
            preprocessConfig(c);
            console.log(c);
            return c;

        case 'ADVANCE':
            var subConfig = !config.configs ? null :
                config.configs.length == 0 ? null :
                    config.configs.shift();

            if (!subConfig) config.completeCallback();
            else if (!subConfig.goal) {
                _.unset(config, 'goal');
                _.unset(config, 'fail');
                config.completeCallback();
            }
            config = {...config, ...subConfig};
            // Mutatin' state up in here.
            preprocessConfig(config);
            return config;

        default:
            return config;
    }
};

const reduceMacro = (macro, action, config) => {
    switch (action.type) {
        case 'SET_MACRO':
            config.macro = action.macroData;
            return macro;

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

const newStore = function(){return createStore(rootReduce);}

export default newStore;
