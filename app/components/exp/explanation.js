import React from 'react';
import './style-exp.scss';
import Section from '../exp/section';

const Explanation = React.createClass({
  createSectionComponents(sections) {
    let tr = [];
    sections.forEach(function(s, i, a){
      tr.push(React.createElement(Section, {...sections[i], key:i}));
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