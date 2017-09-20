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

  introduction:
  "For years before the 2008 financial crisis, Real Interest Rates were low and banking regulations were relaxed.<br>"+
  "<br>"+
  "Banks made lots of bad loans to people who couldn't afford them. We call this the <b>Housing Bubble</b>.<br>"+
  "<br>"+
  "Then the Fed raised the Nominal Interest Rate and disaster struck:<br>"+
  "<br>"+
  "<li>Higher Nominal Interest Rates meant Real Interest Rates went up.</li>"+
  "<li>Higher interest made loans harder to pay back. Many people defaulted.</li>"+
  "<li>Banks lost money or even collapsed, so they couldn't afford to make new loans.</li>"+
  "<li>When banks stopped lending, people stopped spending. Inflation went down and Unemployment went up.</li>"+
  "<li>Low Inflation meant <i>even higher</i> Real Interest Rates. More people defaulted, and a vicious cycle was born.</li>"+
  "<br>"+
  "A lot of other stuff happened, but we're sticking to the parts that fit in this simple model. Let's take a look at how the Fed handles such a crisis.<br>",

  stage: 1,

  sections: [
    {
      heading: "A Minor Crisis",
      body:
      "The big red spot is when everybody starts defaulting.<br>"+
      "You need low Real Interest Rates to weather a crisis.<br>",
      details: "More Words",
      sim: {
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
      },
      suppressScroll: true,
    },
    {
      heading: "A Major Crisis",
      body: "Words again",
      details: "Even more words again",
      sim: {
        winTime: 16,
        maxTime: 20,
        // symbols: ["i", "π", "πₑ", "u"],//, "ū", "r", "r̄", "y"],// "ȳ"],
        symbols: ["i", "π", "u", "r", "πₑ"],//, "ū", "r", "r̄", "y"],// "ȳ"],
        initialData: {
          u: 0.05,
          i: 0.04,
          π: 0.03,
        },
        bombs: [
          {t: 4, m: 4, pm: 0.09, um: 0.025, r: 3, f: 0.5},
        ],
      },
    }
  ],

  conclusion: "This is the conclusion. Goodbye!",
}
const template = (
	<Chapter spec={spec}/>
);
ReactDOM.render(template, document.getElementById('root'));