// import '../style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const configs = [
  {
    winTime: 15,
    maxTime: 20,
    symbols: [],
    statusOverride: "Ready to run the economy?",
    buttonOverride: "Click Here!",
  },
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π"],
  },
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π", "r"],
  },
  {
    winTime: 15,
    maxTime: 20,
    symbols: ["i", "π", "πₑ", "u", "ū", "r", "r̄"],
    conclusion: true,
  }
];

const template = (
	<App configurations={configs}/>
);
ReactDOM.render(template	, document.getElementById('root'));