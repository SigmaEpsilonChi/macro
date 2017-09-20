import { connect } from 'react-redux';
import React from 'react';
import { findDOMNode } from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as d3 from 'd3';
import './style-plot';
import Axis from '../axis/axis';
import col from "../../style/colors"
import SvgSlider from "../svg-slider/svg-slider";

const m = {
	top: 5,
	left: 32.5,
	bottom: 5,
	right: 20
};

const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		return <span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});

const Plot = React.createClass({
	mixins: [PureRenderMixin],
	xScale(v) {
		const { width, xDomain } = this.props;
		return (v - xDomain[0]) / (xDomain[1] - xDomain[0]) * width;
	},
	yScale(v) {
		const { yDomain, height } = this.props;
		return height * (yDomain[1] - v) / (yDomain[1] - yDomain[0]);
	},
	pathMaker(data, xVar, yVar) {
		var i = data.length,
			points = new Array(i);
		while (i--) {
			points[i] = [
				this.xScale(data[i][xVar]),
				this.yScale(data[i][yVar])
			];
		}
		return "M" + points.join("L");
	},
	componentDidMount() {
		const domNode = findDOMNode(this);
		console.log("Component Mounted");
		//this.resize();
    	this.creatGraph();
		//window.addEventListener('resize', this.resize);
	},
    componentDidUpdate() {
    	this.creatGraph();
    },
	resize() {
		const width = this.refs.holder.clientWidth - m.left - m.right;
		const height = 0 - m.top - m.bottom;
		console.log("Resizing to %s, %s", width, height);
		this.props.dispatch({type: 'CHANGE_MACRO', changes: {width, height} });
	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.resize)
	},
	render() {
		console.log("Rerendering Plot");
		let { yScale, xScale, onChange } = this;
		let { history, yDomain, xDomain } = this.props;
		let paths = _.map(vars, d=>{
			return (
			);
		});
		return (
			/*
			<svg className='chart'>
				<g transform={`translate(${m.left},${m.top})`}>
					<Axis 
						tickArguments={[5]}
						classname='axis'
						domain={yDomain}
						range={[height,0]}
						height={height}
						orientation='left'
						tickFormat={d3.format(".2p")}
						innerTickSize={-width}/>
				</g>
			</svg>
			*/
		);
	}

	createGraph() {
		const node = this.node;
		const svg = d3.select(node).append("svg")
			.attr("width", node.clientWidth)
			.attr("height", node.clientHeight);
	}
});

const mapStateToProps = state => state.macroData;

export default connect(mapStateToProps)(Plot);
