import React from 'react';
import ReactDOM from 'react-dom';
import PlotApp from './app';

const advanceCallback = (config) => {
  console.log("This is the default Advance callback.");
  return configs.length == 0 ? config : configs.shift();
}

const configs = [
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π"],
    advanceCallback,
    conclusion: false,
  },
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π", "r"],
    advanceCallback,
    conclusion: false,
  },
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    advanceCallback,
    conclusion: true,
  }
];

const initialConfig = {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    advanceCallback,
}

const template = (
	<PlotApp config={configs.shift()}/>
);
ReactDOM.render(template, document.getElementById('root'));