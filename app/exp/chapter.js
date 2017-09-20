import React from 'react';
import * as d3 from 'd3';
import './style-chapter.scss';
import symbolColors from "../style/symbolColors";
import dataRetriever from '../data/data';
import Section from './section';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Chapter extends React.Component {
  constructor(props){
    super(props);

    // this.setConfig(props.sectionConfigs.shift());
    /*
    let c = this.advanceSection.bind(this);
    props.spec.sections.forEach(function(s, i){
      if (s.sim) s.sim.completeCallback = c;
      s.index = i;
    });
    */
    this.state = {
      choiceState: {},
      stage: props.initialStage ? props.initialStage : 0,
    }
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
  advanceSection(choiceData) {
    let sections = this.props.spec.sections;
    let stage = this.state.stage+1;

    choiceData = choiceData ? choiceData : {};

    if (choiceData.insertions) {
      while (choiceData.insertions.length > 0) {
        sections.splice(stage, 0, _.last(choiceData.insertions));
      }
    }

    console.log("Advancing to stage %s", stage);
    /*
    this.setConfig(config);
    */
    // console.log("Advancing");

    this.setState({
      ...this.state,
      choiceState: {...this.state.choiceState, ...choiceData},
      complete: stage > sections.length,
      scrollSection: stage,
      stage,
      //config,
    });
  }
  createSectionComponents(sections) {
    let tr = [];
    let stage = this.state.stage;
    let advanceSection = this.advanceSection.bind(this);
    // Before you try to change this to a declarative map function for the umpteenth time, remember we have to insert dividers!
    let choiceState = this.state.choiceState;
    sections.forEach(function(s, i, a){
      if (s.mutate) {
        s = {...s};
        s.mutate(s, choiceState);
      }
      tr.push(React.createElement(Section, {...s, key:i, index: i, stage, advanceSection}));
      // if (i < a.length-1) tr.push(<hr key={i}/>);
    });
    return tr;
  }
  componentDidMount(){
    /*
    this.props.spec.sections.forEach(function(s){
      s.advanceCallback = this.advance.bind(this);
    });
    */

    // this.pausePlay();
    /*
    setTimeout(()=>{
      this.pausePlay();
    }, 2200);
    */
    //!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
  }
  /*
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
  */
  render() {
    let {stage, complete} = this.state;
    let {subtitle, introduction, sections, conclusion} = this.props.spec;
    let visibleSections = sections.slice();
    visibleSections.length = stage+1;

    return (
    <div className='main'>
      <div className='title'>{"Federal Reserve S"}<div className="variable" style={{color:symbolColors.i}}>i</div>{"mulator"}</div>
      <div className='subtitle'>{subtitle}</div>
      <div className='explanation'>
        <ReactCSSTransitionGroup transitionName="section" transitionEnterTimeout={2000} transitionLeaveTimeout={2000}>
          {this.createSectionComponents(visibleSections)}
        </ReactCSSTransitionGroup>
      </div>
    </div>
    );
  }
}

export default Chapter;
