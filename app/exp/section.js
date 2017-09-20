import React from 'react';
import Sim from '../sim/sim';
import Bars from '../bars/bars';
import './style-chapter.scss';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const buttonSpec = {
  prompt: "Next",
  data: null,
}

const chosenButtonStyle = {
  cursor: 'default',

}

const unchosenButtonStyle = {
  cursor: 'default',
  border: 'none',
}

const fadeInStyle = {
  opacity: 1,
  height: 'auto',
}

const fadeOutStyle = {
  height: 0,
  opacity: 0,
}

class Section extends React.Component {
  constructor(props) {
    super(props);

    if (props.sim) this.props.sim.completeCallback = this.completeCallback.bind(this);
    if (props.bars) this.props.bars.completeCallback = this.completeCallback.bind(this);

    this.state = {
      fade: false,
      showDetails: false,
      complete: !(props.sim || props.bars),
    }
  }
  mountSection(div){
    if (!this.state.div) {
      this.setState({
        ...this.state,
        // fade: true,
        div,
      });

      if (!this.props.suppressScroll) div.scrollIntoView();
      console.log("Section registered");
    }
    /*
    else if (_.isUndefined(this.state.fade)) {
      this.setState({
        ...this.state,
        fade: true,
      });

      console.log("Section fading in");
    }
    */
  }
  componentDidMount(){
    console.log("Section mounted");
    this.setState({
      ...this.state,
      fade: true,
    });
  }
  completeCallback(){
    /*
    this.setState({
      ...this.state,
      complete: true,
    });
    */
    if (this.props.stage == this.props.index) this.props.advanceSection();
  }
  clickButton(b, i){
    if (!_.isNumber(this.state.chosenButton)) {
      this.setState({
        ...this.state,
        chosenButton: i,
      });
      this.props.advanceSection(b.data ? b.data : {});
    }
  }
  render() {
    let clickButton = this.clickButton.bind(this);
    console.log("Rendering Section");
    return (
      <div>
        <div className='section'/*className={'section' + (this.state.fade ? ' show' : ' hide') }*/
          ref={this.mountSection.bind(this)}
          /*
          style={this.state.fade ?
            fadeInStyle :
            fadeOutStyle
          }
          */
          >
          <div className='text'>
            {!this.props.heading ? null :
              <div className='heading' dangerouslySetInnerHTML={{__html: this.props.heading+(this.props.variable ? " "+this.props.variable : "")}}/>
            }
            <div className='words' dangerouslySetInnerHTML={{__html: this.props.words}}/>
            {!this.props.details ? null :
              (this.state.showDetails ? 
                <div className='details' dangerouslySetInnerHTML={{__html: this.props.details}}/> :
                <div className='details-button' onClick={()=>this.setState({showDetails:true})}>More details</div>
              )
            }
          </div>
          {!this.props.sim ? null :
            <Sim config={this.props.sim}/>
          }
          {!this.props.bars ? null :
            <Bars config={this.props.bars}/>
          }
          {!this.props.button || (this.props.index != this.props.stage && this.props.hideButtons) ? null :
            <div className='complete-button-row'>
              {_.map(_.isArray(this.props.button) ? this.props.button : [this.props.button], (b, i) => {
                b = _.isObject(b) ? {...buttonSpec, ...b} : {...buttonSpec, prompt: b};
                // let styleMod = !this.state.chosenButton ? null : this.state.chosenButton == i ? chosenButtonStyle : unchosenButtonStyle;
                let className = _.isNumber(this.state.chosenButton) ? this.state.chosenButton == i ? 'complete-button-chosen' : 'complete-button-unchosen' : 'complete-button';
                return <div className={className} onClick={()=>clickButton(b, i)} key={i}>{b.prompt}</div>
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}

export default Section;