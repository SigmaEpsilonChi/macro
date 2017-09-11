import React from 'react';
import PlotApp from '../p0/app';
import './style-exp.scss';

class Section extends React.Component {
  constructor() {
    super();
    this.state = {
      showDetails: false,
    }
  }
  render() {
    return (
    <div className='section'>
      {this.props.heading == "" ? null :
        <div className='heading' dangerouslySetInnerHTML={{__html: this.props.heading+" "+this.props.variable}}/>
      }
      <div className='words' dangerouslySetInnerHTML={{__html: this.props.words}}/>
      {!this.props.details ? null :
        (this.state.showDetails ? 
          <div className='details' dangerouslySetInnerHTML={{__html: this.props.details}}/> :
          <div className='details-button' onClick={()=>this.setState({showDetails:true})}>More details</div>
        )
      }
      <PlotApp /*config={this.state.config}*/ /*macroData={this.state.macroData}*//>
    </div>
    );
  }
}

export default Section;