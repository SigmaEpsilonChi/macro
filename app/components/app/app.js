import { connect } from 'react-redux';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as d3 from 'd3';
import './style-app.scss';
import Plot from '../plot/plot';
import col from "../../style/colors"
import PicFrame from '../pic/pic';
import Explanation from '../exp/explanation';

const KK = React.createClass({
  mixins: [PureRenderMixin],
  render() {
    const rendered = katex.renderToString(this.props.S, { displayMode: false });
    const style = this.props.col ? { color: this.props.col } : {};
    return <span className="katex-span" style={style} dangerouslySetInnerHTML={ {__html: rendered } } />
  }
});

const CC = {
  // y: col.green["600"],
  π_e: col.orange["600"],
  π: col.pink["600"],
  r: col.teal["600"],
  i: col["light-blue"]["700"],
  u: col.indigo["500"]
};

const vars = [
  // ["y", col.green["500"], "y", 5, col.green["500"]],
  ["i", col["light-blue"]["500"], "i", 5, col["light-blue"]["500"]],
  ["π", col.pink["500"], "\\pi", 25, col.pink["500"]],
  ["πₑ", col.orange['600'], "\\pi_e", 60, col.orange['700'], ],
  ["u", col.indigo["500"], "u", 15, col.indigo["500"]],
  ["ū", col.indigo["500"], "ū", 80, col.indigo["500"]],
  ["r", col.teal["600"], "r", 80, col.teal["600"]],
  ["r̄", col.teal["600"], "r̄", 80, col.teal["600"]],
];

// wtf even is this function I can't believe I wrote this garbage. I blame javascript.
const getVarHTML = v => {
  var tr = "???";
  vars.forEach((a) => {
    if (a[0] == v) {
      tr = "<div class=\"variable\" style=\"color:"+a[1]+";\">"+v+"</div>";
    }
  });
  // Seriously what is happening here? What am I not understanding about how return works from inside a loop in JS?
  return tr;
}

const sections = [
  {
    variable: "",
    heading: "",
    words: 
    "Congratulations on your appointment as chair of the Federal Reserve!<br>"+
    "<br>"+
    "Your mission is to keep the macroeconomic variables of the US economy in balance.<br>"+
    "It's a difficult job, so let's dive right in to the tools at your disposal."
  },
  {
    variable: getVarHTML("i"),
    heading: "The Nominal Interest Rate",
    words: 
    "The Fed's most important tool is the <b>Nominal Interest Rate</b> "+getVarHTML('i')+".<br>"+
    "This is the 'sticker price' of borrowing money from the government.<br>",
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
    /*
    "It's not the Nominal Interest Rate that matters, but the <b>Real Interest Rate</b> "+getVarHTML("r")+".<br>"+
    "<br>"+
    "The Real Interest Rate is the Nominal Interest Rate minus <b>Inflation</b> "+getVarHTML("π")+".<br>"+
    "Inflation makes it 'cheaper' to pay back a loan, so you have to adjust for it.<br>"+
    "<br>"+
    "Try it out for yourself, but be careful! Inflation is self-reinforcing—it can run away from you!<br>",
    */
    details:
    "It's not "+getVarHTML("i")+" that really matters, but the <b>Real Interest Rate</b> "+getVarHTML("r")+".<br>"+
    "The Real Interest Rate is approximately "+getVarHTML("r")+"="+getVarHTML("i")+"-"+getVarHTML("π")+".<br>"+
    "<br>"+
    "Inflation effects any long-term financial calculation.<br>"+
    "For example, Inflation makes it 'cheaper' to pay back a loan.<br>"+
    "<br>"+
    "That's why a low Real Interest Rate boosts spending, which raises Inflation.<br>"+
    "However, Inflation is also self-reinforcing—it can run away from you!<br>"
    //"If Inflation goes up, the Real Interest Rate must therefore go down.<br>"+
    //"<br>"+
    //"The dance between Interest Rates and Inflation is a fundamental part of the economy.<br>"+
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
    variable: getVarHTML("u"),
    heading: "Unemployment",
    words:
    "Lower interest rates drive up spending.<br>"+
    "More spending means less <b>Unemployment</b> "+getVarHTML("u")+"<br>"+
    "<br>"+
    "Lower "+getVarHTML("i")+" to lower "+getVarHTML("u")+".<br>"+
    "Raise "+getVarHTML("i")+" to raise "+getVarHTML("u")+".<br>",
    details:
    "There is a <b>'Natural' Real Interest Rate</b> "+getVarHTML("r̄")+", driven by the invisible hand of the lending market.<br>"+
    "When "+getVarHTML("r")+" falls below "+getVarHTML("r̄")+", it becomes artificially cheaper to employ people and "+getVarHTML("u")+" falls.<br>"+
    "<br>"+
    "There is also a <b>'Natural' Unemployment Rate</b> "+getVarHTML("ū")+" driven by supply and demand in the hiring market.<br>"+
    "If "+getVarHTML("u")+" drops below "+getVarHTML("ū")+", more money trickles down and Inflation goes up.<br>"+
    "<br>"+
    "You may have noticed that we have come full-circle with our variables and returned to Inflation.<br>"+
    "This is because the economy is a complex dynamical system—cause and effect is loopy, not linear.<br>"
  }
];

const conclusionText = 
  "You are now fully prepared to run the Federal Reserve!<br>"+
  "<br>"+
  "...just kidding. This is a highly-simplified model. "+
  "The natural rates of unemployment and interest are fixed, "+
  "you can achive 0% unemployment, "+
  "and the market perturbations are driven purely by noise (as opposed to 'signal' like wars, trade deals, and other global events). "+
  "Moreover, the Fed has other tools such as long-term interest rates and quantitative easing.<br>"+
  "<br>"+
  "What the model <i>does</i> capture is some of the tradeoffs and metrics that drive decisions at the Fed. "+
  "To that end, here are some bullet points to take away from this game:<br>"+
  "<br>"+
  "<li>The Real Interest Rate matters much more than the Nominal Interest Rate</li>"+
  "<li>It is difficult to lower unemployment and inflation at the same time</li>"+
  "<li>The economy is a complex system, which means macroeconomics is <i>hard</i>!</li>"+
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

const AppComponent = React.createClass({
  sections: [],
  visVars: [],
  paused: true,
  timer: null,
  componentDidMount(){
  	this.pausePlay();
    /*
  	setTimeout(()=>{
  		this.pausePlay();
  	}, 2200);
    */
  	//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
  },
  pausePlay() {
    if (!(this.paused = !this.paused)) {
      let last = 0;
      this.timer = d3.timer(elapsed => {
          const dt = elapsed - last;
          last = elapsed;
          if (this.paused) this.timer.stop();
          this.props.tick(dt);
          // console.log("Delta: %s", dt);
          //if (this.props.victory != last.victory) this.setState({this}); 
        });
    }
  },
  /*
  shouldComponentUpdate() {
    let last = this.props.history[this.props.history.length - 1];
    //if (this.props.victory != last.victory) return true;
    return false; 
  },
  */
  render() {
    this.visVars = vars.slice();
    this.sections = sections.slice();

    this.sections.length = this.props.stage+2;
    switch (this.props.stage) {
      case 0: 
        this.visVars.length = 0;
        break;
      case 1: 
        this.visVars.length = 2;
        break;
      case 2: 
        this.visVars.length = 3;
        break;
      case 3: 
        this.visVars.length = 4;
        break;
      case 4: 
        this.visVars.length = 4;
        break;
    }
    return (
    <div className='main'>
      <div className='title'>{"Federal Reserve S"}<div className="variable" style={{color:vars[0][1]}}>i</div>{"mulator"}</div>
      <Explanation sections={this.sections}/>
      {this.props.stage == 0 ? null :
        <div className='flex-container-row'>
          <div className='plot-container'><Plot vars={this.visVars}/></div>
		    </div>
      }
      <div className='status-bar'>
        <div className='status-text'>{this.props.stage == 0 ? "Ready to run the economy?" : this.props.status}</div>
        {this.props.stage == 0 ? <button className="status-button" onClick={this.props.advance}>Click Here!</button> : [
          (this.props.victory < 0 ? <button className="status-button" onClick={this.props.reset}>RESET</button> : null),
          (this.props.victory > 0 ? <button className="status-button" onClick={this.props.advance}>{this.props.stage == this.props.maxStage ? "RESET" : "ADVANCE"}</button> : null)
        ]}
      </div>
      {this.props.stage > 0 ? null :
        <div className='conclude-button' onClick={this.props.conclude}>
          <div>Been here before? Skip to the end.</div>
        </div>
      }
      {this.props.stage < this.props.maxStage ? null :
        <div className='section'>
          <div className='words' dangerouslySetInnerHTML={{__html: conclusionText}}/>
        </div>
      }
		</div>
    );
  }
});

const mapActionsToProps = dispatch => {
  return {
    conclude() {
      dispatch({ type: 'CONCLUDE' });
    },
    advance() {
      dispatch({ type: 'ADVANCE' });
    },
    reset() {
      dispatch({ type: 'RESET' });
    },
    tick(dt) {
      dispatch({
        type: 'TICK',
        dt
      })
    },
    setVariable({ value, variable }) {
      dispatch({
        type: 'SET_VARIABLE',
        value,
        variable
      });
    }
  };
};

export default connect(state => state.data, mapActionsToProps)(AppComponent);
