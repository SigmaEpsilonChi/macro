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
	top: 20,
	left: 32.5,
	bottom: 20,
	right: 25
};

function GraphVariable(props){
	let {
		string,
		color,
		aligner = 0.7,
		offset = {x: 0, y: 0},
	} = props;
	return (
		<foreignObject x={offset.x} y={offset.y}>
			<div className="path-variable" style={{color: color, fontSize: "24px", fontFamily: "Times New Roman, Times, serif", fontStyle: "italic"}}>{string}</div>
		</foreignObject>
	)
}

/*
const Katexer = React.createClass({
	mixins: [PureRenderMixin],
	render() {
		const rendered = katex.renderToString(this.props.string, { displayMode: true });
		return <span className="katex-span" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});
*/

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
	onChange(ypx) {
		const { height, yDomain } = this.props;
		let i = yDomain[1] - ypx / height * (yDomain[1] - yDomain[0]);
		i = Math.min(i, yDomain[1]);
		i = Math.max(i, yDomain[0]);
		this.props.dispatch({
			type: 'SET_I',
			i
		});
	},
	changePlot(changes) {
		this.props.dispatch({ type: 'CHANGE_PLOT', changes });
	},
	componentDidMount() {
		const domNode = findDOMNode(this);
		console.log("Plot Mounted");
		this.resize();
    	//this.createGraph();
		window.addEventListener('resize', this.resize);

		let dragging = false;
		const drag = d3.drag()
			.on('drag', () => {
				dragging = true;
				this.onChange(d3.mouse(this.refs.holder)[1]);
			})
			.on('end', () => {
				dragging = false;
				//a();
			});
		d3.select(this.refs.holder).call(drag);
	},
  componentDidUpdate() {
	// console.log("Component Updated");
  	//this.createGraph();
  },
	resize() {
		const width = this.refs.holder.clientWidth - m.left - m.right;
		const height = this.refs.holder.clientHeight - m.bottom - m.top;
		console.log("Plot resizing to %s, %s", width, height);
		this.changePlot({ width, height });
	},
	componentWillUnmount() {
		console.log("Plot Unmounting");
		window.removeEventListener('resize', this.resize)
	},
	render() {
		let { yScale, xScale, onChange } = this;
		let { history, width, height, yDomain, xDomain, challenge, vars, colors} = this.props;
		let last = this.props.history[this.props.history.length - 1];
		let x0 = xScale(last.time);
		let zz = width * .7 + (xScale(last.time) + 40) * .3;
		let paths = _.map(vars, v => (
			<path className='path'
				d={this.pathMaker(history,'time',v[0])}
				stroke={v[1]}
				key={v[0]}/>
		));

		let connectors = _.map(vars, v => (
			<g className='foreign' transform={`translate(${x0}, ${yScale(this.props[v[0]])})`} key={v[0]}>
				<line className="path connector" x1="0" x2={width-x0/*v[3]*/} y1="0" y2="0" stroke={v[1]} />
				<GraphVariable string={v[0]} color={v[1]} offset={{x: v[2], y: 0}}/>
			</g>
		));

		if (challenge.includes("ū")) {
			connectors.push(
				<g className='g-nairu'>
					<path className="nairu" d={`M${0},${yScale(this.props.ū)}L${width},${yScale(this.props.ū)}`}/>
					<GraphVariable string={"ū"} color={colors.ū} offset={{x: x0+120, y: yScale(this.props.ū)-25}}/>
				</g>
			);
		}
		if (challenge.includes("r̄")) {
			let rbarBasis = this.props.π;
			if (challenge.includes("πₑ")) rbarBasis = this.props.πₑ;
			connectors.push(
				<g className='g-r-bar'>
					<path className="r-bar" d={`M${x0+100},${yScale(rbarBasis)}L${x0+100},${yScale(this.props.r̄ + rbarBasis)}`}/>
					<GraphVariable string={"r̄"} color={colors.r̄} aligner={-1} offset={{x: x0+120, y: yScale(this.props.r̄*.5 + rbarBasis)}}/>
				</g>
			);
		}
		if (challenge.includes("r")) {
			let rBasis = last.π;
			if (challenge.includes("πₑ")) rBasis = last.πₑ;
			connectors.push(
				<g className="g-r">
					<path className="real-r" d={`M${x0+45},${yScale(rBasis)}L${x0+45},${yScale(this.props.i)}`}/>
					<GraphVariable string={"r"} color={colors.r} aligner={-1} offset={{x: xScale(this.props.time)+50, y: yScale(this.props.i*.5 + rBasis*.5)}}/>
				</g>
			);
		}
		return (
			<div ref='holder' className='plot-inner-container'>
				<svg 
					className='chart' 
					width={width+m.left+m.right}
					height={height+m.top+m.bottom}>

				  <defs>
			      <marker id="arrow" viewBox="0 0 10 10" refX="1" refY="5" 
			              markerUnits="strokeWidth" markerWidth="5" markerHeight="5"
			              orient="auto">
			        <path d="M 5 0 L 10 10 L 0 10 z" fill="context-stroke"/>
			      </marker>
				  </defs>

					<pattern id="checkers"
          	x="0" y="0" width="20" height="20"
          	patternUnits="userSpaceOnUse" >

    				<rect fill="#333" x="0" width="10" height="10" y="0"/>
    				<rect fill="#333" x="10" width="10" height="10" y="10"/>
    				<rect fill="#FFF" x="0" width="10" height="10" y="10"/>
    				<rect fill="#FFF" x="10" width="10" height="10" y="0"/>
  				</pattern>
					<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="8" height="8">
					  <path d="M-2,2 l4,-4
					           M0,8 l8,-8
					           M6,10 l4,-4" 
					        stroke="#F88" strokeWidth="1"/>
					</pattern>

					<rect x={m.left} y={height+m.bottom} width={width} height={m.bottom} fill="url(#diagonalHatch)" strokeWidth="0"/>
					<rect x={m.left} width={width} height={m.top} fill="url(#diagonalHatch)" strokeWidth="0"/>
  				
					<g transform={`translate(${m.left},${m.top})`}>
  					<rect transform={`translate(${xScale(this.props.winTime)}, 0)`} width="20" height={height} strokeWidth="1" stroke="#3" fill="url(#checkers)"/>

						<Axis 
							tickArguments={[5]}
							classname='axis'
							domain={yDomain}
							range={[height,0]}
							height={height}
							orientation='left'
							tickFormat={d3.format(".2p")}
							innerTickSize={-width}/>
						
						{connectors}
						{paths}

						<g transform={`translate(${xScale(last.time)},0)`}>
							<SvgSlider 
								ypx={yScale(this.props.i)}
								domain={yDomain}
								height={height}		
								onChange={onChange}/>
						</g>
					</g>
				</svg>
			</div>
		);
	}
});

const mapStateToProps = state => ({
	...state.data,
	...state.plot
});

export default connect(mapStateToProps)(Plot);
