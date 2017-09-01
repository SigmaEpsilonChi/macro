import React from 'react';
import './style-exp.scss';

const Section = React.createClass({
  //words: "This is an example section",

  render() {
    return (
    <div className='section'>
      {this.props.heading == "" ? null :
        <div className='heading' dangerouslySetInnerHTML={{__html: this.props.heading+" "+this.props.variable}}/>
      }
      <div className='words' dangerouslySetInnerHTML={{__html: this.props.words}}/>
    </div>
    );
  }
});

export default Section;