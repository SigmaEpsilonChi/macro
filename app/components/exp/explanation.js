import React from 'react';
import './style-exp.scss';
import Section from '../exp/section';

const Explanation = React.createClass({
  createSectionComponents(sections) {
    let tr = [];
    sections.forEach(function(s, i, a){
      tr.push(<Section heading={sections[i].heading} words={sections[i].words} variable={sections[i].variable} key={i}/>);
      if (i < a.length-1) tr.push(<hr/>);
    });
    return tr;
  },
  render() {
    return (
    <div className='explanation'>
      {this.createSectionComponents(this.props.sections)}
    </div>
    );
  }
});

export default Explanation;