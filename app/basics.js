// import '../style/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Chapter from './exp/chapter';
import symbolColors from './style/symbolColors';

const getVarHTML = v => {
  return "<div class=\"variable\" style=\"color:"+symbolColors[v]+";\">"+v+"</div>";
}

const spec = {
  subtitle: "Chapter 1: Loans",

  sections: [
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      heading: "Pop Quiz",
      words:
      "I give you $100. A year later you give me $105. Have I made a profit?<br>",
      button: ["Yes.", "No."],
      suppressScroll: true,
    },
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words:
      "Trick question! It depends on Inflation.<br>"+
      "Let's say Inflation is 10%.<br>"+
      "<br>"+
      "After one year my $100 is worth $10 less.<br>"+
      "<br>"+
      "So $105 adjusted for Inflation is worth...<br>"+
      "",
      button: [
        {prompt: "$90", data: {lostValueQuiz: 0}},
        {prompt: "$95", data: {lostValueQuiz: 1}},
        {prompt: "$100?", data: {lostValueQuiz: 2}},
      ],
    },
    {
      mutate: function(spec, state) {
        if (state.lostValueQuiz == 1) spec.words = "That was a softball... but yeah, $95.<br>"+spec.words;
        else spec.words = "Eh, close enough. It's worth $95.<br>"+spec.words;
      },
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "I get <i>more dollars</i> but <i>less value</i>.<br>"+
      "<br>"+
      "Kinda weird, right?<br>"+
      "<br>"+
      "<hr>"+
      "<br>"+
      "Dollars and value usually seem like the same thing.<br>"+
      "In fact they are more like two partners in a dance.<br>"+
      "<br>"+
      "When the band plays well everyone rises to their feet.<br>"+
      "When the rhythm breaks down we may trip and even fall.<br>"+
      "<br>"+
      "I'm going to tell you a story about falling to our knees.<br>"+
      "A story of collapsing under the weight of our own promises.<br>"+
      "<br>"+
      "...But first let's talk about loans.<br>"+
      "<br>"+
      "",
      button: "Enough preamble. Get to the real stuff.",
      hideButtons: true,
    },
    {
      heading: getVarHTML("i")+"  "+getVarHTML("π")+"  "+getVarHTML("r"),
      // heading: "Interest & Inflation",
      words: 
      "There are three important numbers for any loan:<br>"+
      "",
      button: "Hit me with them.",
      hideButtons: true,
    },
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "<br>"+
      "<li><b>Nominal Interest "+getVarHTML("i")+"</b>—The dollar cost or 'sticker price' of a loan.</li>"+
      "",
      button: "Okay",
      hideButtons: true,
    },
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "<br>"+
      "<li><b>Inflation "+getVarHTML("π")+"</b>—How much value or 'purchasing power' a dollar will lose in a year.</li>"+
      "",
      button: "Uh-huh",
      hideButtons: true,
    },
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "<br>"+
      "<li><b>Real Interest "+getVarHTML("r")+"</b>—Nominal Interest minus Inflation; the <i>value</i> cost of a loan.</li>"+
      "",
      button: "Sure",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "A simple formula binds these variables: "+getVarHTML("i")+"-"+getVarHTML("π")+"="+getVarHTML("r")+"<br>"+
      "",
      button: [
        {prompt: "This is fascinating!", data: {isBored: false}},
        {prompt: "I am bored already.", data: {isBored: true}}
      ],
    },
    /*
    {
      heading: "More Loans&rarr;More Inflation",
      words: 
      "Banks lend out more money than they actually possess.<br>"+
      "So when when a bank makes a loan, new dollars enter the economy.<br>"+
      "<br>"+
      "Each new dollar makes every other dollar worth less.<br>"+
      "This is where Inflation comes from.<br>"+
      "<br>"+
      "When Real Interest is low, people borrow more.<br>More Loans&rarr;More New Dollars&rarr;More Inflation<br>"+
      "<br>"+
      "When Real Interest is high, people borrow less.<br>Less Loans&rarr;Less New Dollars&rarr;Less Inflation."+
      "",
      button: "You tricky bastard.",
    },
    */
    {
      mutate: function(spec, state) {
        if (state.isBored) spec.words = "Okay, fine! We'll skip to the fun part: <i>Crashing the economy.</i><br><br>"+spec.words;
        else spec.words = "Liar. Whatever, let's skip to the fun part: <i>Crashing the economy.</i><br><br>"+spec.words;
      },
      heading: "Crash Test",
      words: 
      /*
      "High Inflation is bad for the economy. Negative Inflation—AKA Deflation—is even worse.<br>"+
      "<br>"+
      "Try it out for yourself. Remember:<br>"+
      "<br>"+
      "Low Real Interest&rarr;Inflation Rises<br>"+
      "High Real Interest&rarr;Inflation Falls<br>"+
      */
      "The Federal Reserve controls Inflation with Interest.<br>"+
      "The economy 'crashes' when Inflation gets too high or low.<br>"+
      "<br>"+
      "Low Real Interest&rarr;Rising Inflation. Try it out!<br>"+
      "<br>"+
      //"Low Real Interest&rarr;Inflation Rises<br>"+
      //"High Real Interest&rarr;Inflation Falls<br>"+
      "",
      bars: {
        symbols: ["i", "r", "π"],
        // symbols: ["i", "r", "π", "r̄"],
        // symbols: ["i", "r", "π", "r̄", "u"],
        // symbols: ["i", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū", "y", "ȳ"],
        initialData: {
          u: 0.05,
          i: 0.06,
          π: 0.04,
          πₑ: 0.04,
          // σu: 0.05,
        },
        configs: [
          {
            prompts: {
              start: "Crash the economy with high Inflation",
              goal: "Congratulations, the dollar is worthless!",
              fail: "Inflation went in the wrong direction. Try again!",
            },
            goal: {symbol: 'π', value: 0.1},
            fail: {symbol: 'π', value: 0},
          },
          {
            prompts: {
              start: "Now go for Deflation (Negative Inflation)",
              goal: "Dollars are worth too much. Nobody can pay their debts. Well done!",
              fail: "Inflation went in the wrong direction. Try again!",
            },
            goal: {symbol: 'π', value: 0},
            fail: {symbol: 'π', value: 0.1},
          },
          {
            prompts: {
              // start: "(you can still mess around here if you want)",
            },
          },
        ],
      },
    },
    {
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      heading: getVarHTML("r")+" is Really Interesting",
      words: 
      "So Real Interest can move Inflation. But why?<br>"+
      "Let's go back to that first loan:<br>"+
      "<br>"+
      "I gave you $100 at Nominal Interest "+getVarHTML("i")+" = 5%<br>"+
      "<br>"+
      "Inflation "+getVarHTML("π")+" = 10%<br>"+
      "<br>"+
      "If "+getVarHTML("i")+"-"+getVarHTML("π")+"="+getVarHTML("r")+", what was your Real Interest "+getVarHTML("r")+"?<br>"+
      "",
      button: [
        {prompt: "-5%", data: {realInterestQuiz: 0}},
        {prompt: "10%", data: {realInterestQuiz: 1}},
        {prompt: "0%", data: {realInterestQuiz: 2}},
      ],
    },
    {
      mutate: function(spec, state) {
        if (state.realInterestQuiz == 0) spec.words = "☆ Put this on your fridge.<br><br>"+spec.words;
        else spec.words = "☯ There are no wrong answers on the internet.<br><br>"+spec.words;
        //else if (state.realInterestQuiz == 1) spec.words = "Liar. Whatever, let's skip to the fun part: <i>Crashing the economy.</i><br><br>"+spec.words;
        //else if (state.realInterestQuiz == 2) spec.words = "Liar. Whatever, let's skip to the fun part: <i>Crashing the economy.</i><br><br>"+spec.words;
      },
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "Your Real Interest rate was -5%. <i>Negative</i>.<br>"+
      "I charged you interest and lost $5!<br>"+
      "<br>"+
      "This is why we calculate Real Interest: Inflation makes loans 'cheaper'.<br>"+
      "<br>"+
      "What happens when loans are cheap?<br>"+
      "",
      button: [
        {prompt: "People take out less loans.", data: {cheapLoanQuiz: 0}},
        {prompt: "People take out more loans?", data: {cheapLoanQuiz: 1}},
        {prompt: "WOOHOO LOAN PARTY", data: {cheapLoanQuiz: 2}},
      ],
    },
    {
      mutate: function(spec, state) {
        if (state.cheapLoanQuiz == 0) spec.words = "Maybe you don't want a bargain-bin loan, but other people do.<br><br>"+spec.words;
        else if (state.cheapLoanQuiz == 1) {
          if (state.realInterestQuiz == 0) spec.words = "Right again.<br><br>"+spec.words;
          else spec.words = "☆ For your refrigerator.<br><br>"+spec.words;
        }
        else if (state.cheapLoanQuiz == 2) spec.words = "Pretty much, yeah. Later we'll see how that can be bad.<br><br>"+spec.words;
      },
      // variable: getVarHTML("i")+" "+getVarHTML("π")+" "+getVarHTML("r"),
      words: 
      "People take out <i>more</i> loans, which has a side-effect:<br>"+
      "<br>"+
      "More Loans→More Spending→More Demand for goods and services.<br>"+
      "When demand goes up faster than supply, prices inflate.<br>"+
      "",
      button: "Lots of Loans→Rising Inflation. So what?",
      hideButtons: true,
    },
    {
      heading: "The Inflation-Interest Cycle",
      words:
      "So Low Real Interest→Lots of Loans→Rising Inflation.<br>"+
      "This creates a vicious cycle:<br>"+
      "",
      button: "Let's get vicious",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "<li>Real Interest "+getVarHTML("r")+" is low. Cheap loans for everyone!</li>"+
      "",
      button: "Okay",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "<li>Spending increases, Inflation "+getVarHTML("π")+" goes up</li>"+
      "",
      button: "Then what",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "<li>"+getVarHTML("i")+"-"+getVarHTML("π")+"="+getVarHTML("r")+", so when Inflation "+getVarHTML("π")+" goes up...</li>"+
      "",
      button: "Oh no.",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "<li>Real Interest "+getVarHTML("r")+" is <i>lower</i>. Cheaper loans for everyone!</li>"+
      "",
      button: "I get it! It's a cycle.",
      hideButtons: true,
    },
    {
      words: 
      "<br>"+
      "<li>Spending increases, Inflation "+getVarHTML("π")+" goes up</li>"+
      "",
      button: "No really, I get it.",
      hideButtons: true,
    },
    {
      heading: "Tipping Point",
      words: 
      "So that's how Inflation destabilizes. But what if we want to <i>stabilize</i> Inflation?<br>"+
      "Good news: there is a 'Goldilocks' Real Interest rate where Inflation is stable.<br>"+
      "<br>"+
      "Economists call this the Natural Real Interest rate.<br>"+
      "Inflation moves slowly if Real Interest is near its Natural rate.<br>"+
      "<br>"+
      "",
      bars: {
        // symbols: ["i", "r", "π"],
        symbols: ["i", "r", "π", "r̄"],
        // symbols: ["i", "r", "π", "r̄", "u"],
        // symbols: ["i", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū", "y", "ȳ"],
        initialData: {
          u: 0.05,
          i: 0.06,
          π: 0.04,
          πₑ: 0.04,
          // σu: 0.05,
        },
        configs: [
          {
            prompts: {
              start: "Send Inflation skyward... but slowly!",
              goal: "You gave the economy a slow and painful death",
              fail: "Inflation went in the wrong direction. Try again!",
            },
            goal: {
              symbol: 'π',
              value: 0.1,
              timer: {
                t: 5,
                prompt: "You inflated too fast! Try going slower.",
              },
            },
            fail: {symbol: 'π', value: 0},
          },
          {
            prompts: {
              start: "Now send us creeping toward Deflation",
              goal: "You gave the economy a slow and painful death",
              fail: "Inflation went in the wrong direction. Try again!",
            },
            goal: {
              symbol: 'π',
              value: 0,
              timer: {
                t: 5,
                prompt: "You dis-inflated too fast! Try going slower.",
              },
            },
            fail: {symbol: 'π', value: 0.1},
          },
          {
            prompts: {
            },
          },
        ],
      },
    },
    {
      heading: "Inflation Over Time",
      words: 
      "The Fed doesn't set an Interest rate and walk away.<br>"+
      "They vote on new target rates several times a year.<br>"+
      "<br>"+
      "Running The Fed is an <i>active process</i>.<br>"+
      "",
      button: "My Interest rate in this topic is falling.",
    },
    {
      words: 
      "Well then, get ready for an exciting new challenge!<br>"+
      "<br>"+
      "Let's plot these variables over time.<br>"+
      "Try to survive the year!<br>"+
      "<br>"+
      "",
      sim: {
        // symbols: ["i", "r", "π"],
        symbols: ["i", "r", "π", "r̄"],
        // symbols: ["i", "r", "π", "r̄", "u"],
        // symbols: ["i", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū"],
        // symbols: ["i", "πₑ", "r", "π", "r̄", "u", "ū", "y", "ȳ"],
        initialData: {
          u: 0.05,
          i: 0.06,
          π: 0.04,
          πₑ: 0.04,
          // σu: 0.05,
        },
        maxTime: 12,
        winTime: 10,
        configs: [
          {
            prompts: {
              start: "Drag the chart to begin",
              goal: "You made it through the year!",
            },
            /*
            goal: {
              symbol: 'time',
              value: 10,
            },
            */
            fail: [
              {symbol: 'π', value: 0, prompt: "You have died of Deflation."},
              {symbol: 'π', value: 0.1, prompt: "Inflation is too high. You have been asked to resign."},
            ],
          },
          /*
          {
            prompts: {
              start: "Drag the chart to begin",
              goal: "You made it through the year!",
            },
            fail: [
              {symbol: 'π', value: 0, prompt: "You have died of Deflation."},
              {symbol: 'π', value: 0.1, prompt: "Inflation is too high. You have been asked to resign."},
            ],
          },
          */
          {
            prompts: {
            },
          },
        ],
      },
    },
    {
      heading: "That's all for now",
      words: 
      "More is on the way.<br>"+
      "Thanks for playing!<br>"+
      "",
    },
  ],
}
const template = (
	<Chapter spec={spec} initialStage={0}/>
);
ReactDOM.render(template, document.getElementById('root'));