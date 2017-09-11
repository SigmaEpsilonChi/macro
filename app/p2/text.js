import symbolColors from "../style/symbolColors";

const getVarHTML = v => {
  return "<div class=\"variable\" style=\"color:"+symbolColors[v]+";\">"+v+"</div>";
}

const sections = [
  {
    variable: "",
    heading: "",
    words: 
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
    "A lot of other stuff happened, but we're sticking to the parts that fit in this simple model. Let's take a look at how the Fed handles such a crisis.<br>"
  },
  {
    variable: "",
    heading: "A Minor Crisis",
    words: 
    "The big red spot is when everybody starts defaulting.<br>"+
    "You need low Real Interest Rates to weather a crisis.<br>",
    details:
    "The Fed prints the money, so it can lend at whatever rate it chooses.<br>"+
    "This sets the benchmark for the rates offered by other lending institutions.<br>"+
    "<br>"+
    "Low interest rates encourage people to borrow and spend money.<br>"+
    "This has far-reaching effects on the rest of the economy.<br>"
  },
  {
    variable: getVarHTML("π"),
    heading: "Inflation",
    words:
    "The Fed uses "+getVarHTML("i")+" to control <b>Inflation</b> "+getVarHTML("π")+".<br>"+
    "<br>"+
    "Raise "+getVarHTML("i")+" to lower "+getVarHTML("π")+".<br>"+
    "Lower "+getVarHTML("i")+" to raise "+getVarHTML("π")+".<br>"+
    "<br>"+
    "Try it out for yourself!<br>",
    details:
    "Inflation effects any long-term financial calculation.<br>"+
    "For example, Inflation makes it 'cheaper' to pay back a loan.<br>"+
    "<br>"+
    "Lowering "+getVarHTML("i")+" encourages borrowing, which boosts spending.<br>"+
    "When spending goes up, Inflation goes up with it.<br>"+
    "<br>"+
    "However, Inflation is also self-reinforcing—it can run away from you!<br>"
  },
  {
    variable: getVarHTML("r"),
    heading: "The Real Interest Rate",
    words:
    "It actually doesn't matter if "+getVarHTML("i")+" is high or low.<br>"+
    "What matters is the <b>Real Interest Rate</b> "+getVarHTML("r")+".<br>"+
    "<br>"+
    getVarHTML("r")+" is the Nominal Interest Rate adjusted for Inflation.<br>"+
    "We approximate the Real Interest Rate as "+getVarHTML("r")+"="+getVarHTML("i")+"-"+getVarHTML("π")+".<br>"+
    "<br>"+
    "When "+getVarHTML("r")+" is low, "+getVarHTML("π")+" goes up.<br>"+
    "When "+getVarHTML("r")+" is high, "+getVarHTML("π")+" goes down.<br>",
    details:
    "The Nominal Interest Rate tells you the <i>dollar</i> cost of a loan.<br>"+
    "The Real Interest Rate tells you the <i>value</i> cost of a loan.<br>"+
    "<br>"+
    "People care about value, not dollars.<br>"+
    "<br>"+
    "So whether "+getVarHTML("i")+" is high or low doesn't matter;<br>"+
    "The truly important measurement is "+getVarHTML("r")+".<br>",
  },
  {
    variable: getVarHTML("u"),
    heading: "Unemployment",
    words:
    "A low "+getVarHTML("r")+" drives up spending, which drives down <b>Unemployment</b> "+getVarHTML("u")+".<br>"+
    "<br>"+
    "Bring down "+getVarHTML("r")+" to lower "+getVarHTML("u")+".<br>"+
    "Bring up "+getVarHTML("r")+" to raise "+getVarHTML("u")+".<br>",
    details:
    "It is difficult to lower Unemployment and Inflation at the same time.<br>"+
    "Tradeoffs like this are what make the Fed's task so challenging.<br>",
    /*
    "There is a <b>'Natural' Real Interest Rate</b> "+getVarHTML("r̄")+", driven by the invisible hand of the lending market.<br>"+
    "When "+getVarHTML("r")+" falls below "+getVarHTML("r̄")+", it becomes artificially cheaper to employ people and "+getVarHTML("u")+" falls.<br>"+
    "<br>"+
    "There is also a <b>'Natural' Unemployment Rate</b> "+getVarHTML("ū")+" driven by supply and demand in the hiring market.<br>"+
    "If "+getVarHTML("u")+" drops below "+getVarHTML("ū")+", more money trickles down and Inflation goes up.<br>"+
    "<br>"+
    "You may have noticed that we have come full-circle with our variables and returned to Inflation.<br>"+
    "This is because the economy is a complex dynamical system—cause and effect is loopy, not linear.<br>"
    */
  },
  {
    variable: getVarHTML("πₑ"),
    heading: "Expected Inflation",
    words:
    "People learn to anticipate inflation.<br>"+
    "<b>Expected Inflation</b> "+getVarHTML("πₑ")+" is what actually drives decisions.<br>"+
    "<br>"+
    ""+getVarHTML("πₑ")+" approaches "+getVarHTML("π")+" over time.", 
    details:
    "People base decisions on where they think Inflation is going, not where it is right now.<br>"+
    "For this reason, "+getVarHTML("πₑ")+" is often more useful than "+getVarHTML("π")+" for measuring "+getVarHTML("r")+".<br>"+
    "<br>"+
    "The Real Interest Rate is now charted as "+getVarHTML("r")+"="+getVarHTML("i")+"-"+getVarHTML("πₑ"),
  },
  {
    variable: getVarHTML("r̄")+" "+getVarHTML("ū"),
    heading: "Natural Rates",
    words:
    "There is a <b>'Natural' Real Interest Rate</b> "+getVarHTML("r̄")+" driven by GDP growth.<br>"+
    "When "+getVarHTML("r")+" falls below "+getVarHTML("r̄")+", Unemployment goes down.<br>"+
    "<br>"+
    "There is a <b>'Natural' Unemployment Rate</b> "+getVarHTML("ū")+" driven by demand for labor.<br>"+
    "If "+getVarHTML("u")+" drops below "+getVarHTML("ū")+", Inflation goes up.<br>",
    details:
    "This is where the model becomes very hard to intuitively understand.<br>"+
    "Our variables are defined in circular terms that create feedback loops.<br>"+
    "<br>"+
    "Economies are complex dynamical systems.<br>"+
    "Cause and effect is not linear; it's loopy.<br>"
    /*
    "There is a <b>'Natural' Real Interest Rate</b> "+getVarHTML("r̄")+", driven by the invisible hand of the lending market.<br>"+
    "When "+getVarHTML("r")+" falls below "+getVarHTML("r̄")+", it becomes artificially cheaper to employ people and "+getVarHTML("u")+" falls.<br>"+
    "<br>"+
    "There is also a <b>'Natural' Unemployment Rate</b> "+getVarHTML("ū")+" driven by supply and demand in the hiring market.<br>"+
    "If "+getVarHTML("u")+" drops below "+getVarHTML("ū")+", more money trickles down and Inflation goes up.<br>"+
    "<br>"+
    "You may have noticed that we have come full-circle with our variables and returned to Inflation.<br>"+
    "This is because the economy is a complex dynamical system—cause and effect is loopy, not linear.<br>"
    */
  },
];

const conclusion = 
  "You are now fully prepared to run the Federal Reserve!<br>"+
  "<br>"+
  "...just kidding. This is a highly-simplified model. "+
  "For example, the natural rates of unemployment and interest are fixed. "+
  "You can also achieve 0% unemployment. "+
  "Moreover, the Fed has other tools such as long-term interest rates and quantitative easing.<br>"+
  "<br>"+
  "What the model <i>does</i> capture is some of the tradeoffs and metrics that drive decisions at the Fed. "+
  "Here are some bullet points to take away from this game:<br>"+
  "<br>"+
  "<li>The Real Interest Rate matters much more than the Nominal Interest Rate</li>"+
  "<li>It is difficult to lower unemployment and inflation at the same time</li>"+
  "<li>The economy is a complex system. Predicting it is <i>really hard!</i></li>"+
  "<br>"+
  "Thanks to Lewis Lehe for the creative spark and hard work that made this article possible. "+
  "This is really his concept and model, I just put a fresh coat of paint on it. "+
  "You can play Lewis's original implementation <a href=\"http://lewis500.github.io/macro/\">here</a>.<br>"+
  "<br>"+
  "Thanks to David Romer for writing <a href=\"https://www.amazon.com/Advanced-Macroeconomics-Mcgraw-Hill-Economics-David/dp/0073511374\">Advanced Macroeconomics</a>, the textbook from which Lewis built this model.<br>"+
  "<br>"+
  "Thanks to all my friends in the <a href=\"http://explorabl.es\">Explorable Explanations</a> community.<br>"+
  "<br>"+
  "...and thanks to you for playing!";

export default {sections, conclusion}