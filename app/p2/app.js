import React from 'react';
import * as d3 from 'd3';
import '../style/style-app.scss';
import PlotApp from '../p0/app';
import symbolColors from "../style/symbolColors";
import Explanation from '../exp/explanation';
import text from './text';
import dataRetriever from '../data/data';
import store from '../p0/reduce';

class AppComponent extends React.Component {
  constructor(props){
    super(props);

    this.setConfig(props.configurations.shift());

    this.state = {
      stage: 0,
    }
  }
  setConfig(config){

    store.dispatch({
      type: 'CONFIGURE',
      config,
    });
    // dataRetriever(config.macro.year0, config.macro.year1, config.macro.month1, function(macroData){store.dispatch({type:'SET_MACRO', macroData})});
  }
  componentDidMount(){
    console.log("Root AppComponent is mounted");
    this.pausePlay();
    /*
    setTimeout(()=>{
      this.pausePlay();
    }, 2200);
    */
    //!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
  }
  pausePlay() {
    console.log("App Pause/Play");
    //if (!(this.paused = !this.paused)) {
      let last = 0;
      this.timer = d3.timer(elapsed => {
          const dt = elapsed - last;
          last = elapsed;
          if (this.paused) this.timer.stop();
          store.dispatch({
            type: 'TICK',
            dt
          });
          console.log("Delta: %s", dt);
          //if (this.props.victory != last.victory) this.setState({this}); 
        });
    //}
  }
  advance(){
    let stage = this.props.configurations.length == 0 ?
        this.state.stage :
        this.state.stage+1;

    let config = this.props.configurations.length == 0 ?
        this.state.config :
        this.props.configurations.shift();

    this.setConfig(config);

    console.log("Advancing");

    this.setState({
      ...this.state,
      stage,
      //config,
    });
  }
  componentDidMount(){
    this.pausePlay();
    /*
    setTimeout(()=>{
      this.pausePlay();
    }, 2200);
    */
    //!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
  }
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
  }
  render() {
    let sectionStrings = text.sections.slice();
    sectionStrings.length = this.state.stage+2;

    return (
    <div className='main'>
      <div className='title'>{"Federal Reserve S"}<div className="variable" style={{color:symbolColors.i}}>i</div>{"mulator"}</div>
      <div className='chapter'>{"Chapter 2: History Lessons"}</div>
      <Explanation sections={sectionStrings}/>
      <PlotApp /*config={this.state.config}*/ advanceCallback={this.advance.bind(this)} /*macroData={this.state.macroData}*//>
      {this.props.configurations.length > 0 ? null :
        <div className='section'>
          <div className='words' dangerouslySetInnerHTML={{__html: text.conclusion}}/>
        </div>
      }
    </div>
    );
  }
}

export default AppComponent;
