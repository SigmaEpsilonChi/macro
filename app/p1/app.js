import React from 'react';
import * as d3 from 'd3';
import '../style/style-app.scss';
import PlotApp from '../p0/app';
import symbolColors from "../style/symbolColors";
import Explanation from '../exp/explanation';
import text from './text';

class AppComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      stage: 0,
      config: props.configurations.shift(),
    }
  }
  advance(){
    let stage = this.props.configurations.length == 0 ?
        this.state.stage :
        this.state.stage+1;

    let config = this.props.configurations.length == 0 ?
        this.state.config :
        this.props.configurations.shift();

    store.dispatch({
      type: 'SET_CONFIG',
      config,
    });

    console.log("Advancing");

    this.setState({
      ...this.state,
      stage,
      // config,
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
    console.log("Re-rendering p0");

    let sectionStrings = text.sections.slice();
    sectionStrings.length = this.state.stage+2;

    return (
    <div className='main'>
      <div className='title'>{"Federal Reserve S"}<div className="variable" style={{color:symbolColors.i}}>i</div>{"mulator"}</div>
      <div className='chapter'>{"Chapter 1: Interest Rates"}</div>
      <Explanation sections={sectionStrings}/>
      <PlotApp advanceCallback={this.advance.bind(this)}/>
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
