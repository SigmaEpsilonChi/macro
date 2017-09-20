// import '../style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Chapter from './exp/chapter';
import symbolColors from './style/symbolColors';

const getVarHTML = v => {
  return "<div class=\"variable\" style=\"color:"+symbolColors[v]+";\">"+v+"</div>";
}

const spec = {
  subtitle: "Chapter 2: History Lessons",

  introduction: "This is the introduction. Hello!",

  stage: 1,

  sections: [
    {
      heading: "Yo",
      body: "Words",
      details: "More Words",
      sim: {
        winTime: 15,
        maxTime: 20,
        symbols: ["i", "π"],
      },
      suppressScroll: true,
    },
    {
      heading: "Yo Again",
      body: "Words again",
      details: "Even more words again",
      sim: {
        winTime: 15,
        maxTime: 20,
        symbols: ["i", "π", "r"],
      },
    }
  ],

  conclusion: "This is the conclusion. Goodbye!",
}
const template = (
	<Chapter spec={spec}/>
);
ReactDOM.render(template, document.getElementById('root'));