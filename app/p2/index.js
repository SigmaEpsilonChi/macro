// import '../style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

// Good shim values for y:
// 2009, 6: 0.08

const configs = [
  {
    symbols: [],
    statusOverride: "Ready to start a financial crisis?",
    buttonOverride: "Click Here!",
  },
  {
    winTime: 16,
    maxTime: 20,
    // symbols: ["i", "π", "πₑ", "u"],//, "ū", "r", "r̄", "y"],// "ȳ"],
    symbols: ["i", "π", "u", "r"],//, "ū", "r", "r̄", "y"],// "ȳ"],
    initialData: {
      u: 0.05,
      i: 0.04,
      π: 0.03,
    },
    bombs: [
      {t: 3, m: 3, pm: 0.09, um: 0.025, r: 1, f: 0.5},
    ],
    macro: {
      year0: 2004,
      year1: 2009,
      month1: 6
    },
  },
  {
    winTime: 16,
    maxTime: 20,
    symbols: ["i", "π", "u", "r"],//, "ū", "r", "r̄", "y"],// "ȳ"],
    initialData: {
      u: 0.05,
      i: 0.04,
      π: 0.03,
    },
    bombs: [
      {t: 3, m: 4, pm: 0.09, um: 0.025, r: 2.5, f: 0.5},
    ],
  },
  {
    winTime: 35,
    maxTime: 40,
    symbols: ["i", "π", "r"],
    shims: {
      y: 0.01,
    },
    macro: {
      year0: 2004,
      year1: 2008,
      month1: 6
    },
  },
  {
    winTime: 35,
    maxTime: 40,
    symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    conclusion: true,
  }
];

const template = (
	<App configurations={configs}/>
);
ReactDOM.render(template	, document.getElementById('root'));