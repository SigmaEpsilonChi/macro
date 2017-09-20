// import '../style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Chapter from './exp/chapter';
import symbolColors from './style/symbolColors';

const getVarHTML = v => {
  return "<div class=\"variable\" style=\"color:"+symbolColors[v]+";\">"+v+"</div>";
}

const spec = {
  subtitle: "By Lewis Lehe & Chris Walker",

  introduction:
  "What does the Federal Reserve actually do?<br>"+
  "<br>"+
  "Before this project I honestly had no idea.<br>",

  stage: 0,

  sections: [],

  conclusion: "This is the conclusion. Goodbye!",
}

const template = (
	<Chapter spec={spec}/>
);
ReactDOM.render(template, document.getElementById('root'));