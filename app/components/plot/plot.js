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
		const vars = this.props.vars;
		let { yScale, xScale, onChange } = this;
		let { history, width, height, yDomain, xDomain } = this.props;
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
				<foreignObject width="17px" height="17px" y="-.7em" x={v[3]}>
						<Katexer string={v[2]} col={v[4]}/>
				</foreignObject>
			</g>
		));

		if (this.props.stage >= 0) {
		}
		if (vars.length > 0) {
			connectors.push(
				<path 
					className="path connector i"
					stroke={vars[0][1]}
					d={`M${xScale(last.time)+vars[0][3]+20},${yScale(this.props.i)}L${width},${yScale(this.props.i)}`}/>
			);
		}
		if (vars.length > 2) {
			connectors.push(
				<path 
					className="path connector πₑ"
					stroke={vars[2][1]}
					d={`M${xScale(last.time)+vars[2][3]+20},${yScale(this.props.πₑ)}L${width},${yScale(this.props.πₑ)}`}/>	
			);
		}
		if (this.props.stage >= 3) {
			connectors.push(
				<g className='g-nairu'>
					<foreignObject width="17px" height="18px" y="-.7em" x={5}
						transform={`translate(${x0+120}, ${ yScale(this.props.ū)-25})`}	>
						<Katexer string={"\\bar{u}"} col={col["indigo"]["500"]}/>
					</foreignObject>
					<path className="nairu" d={`M${0},${yScale(this.props.ū)}L${width},${yScale(this.props.ū)}`}/>
				</g>
			);
			connectors.push(
				<g className='g-r-bar'>
					<path className="r-bar" d={`M${x0+100},${yScale(last.πₑ)}L${x0+100},${yScale(this.props.r̄ + last.πₑ)}`}/>
					<foreignObject width="17px" height="18px" y="-.6em" x={0}
						transform={`translate(${x0+110}, ${ yScale(this.props.r̄*.5 + last.πₑ)})`}	>
						<Katexer string={"\\bar{r}"} col={col["cyan"]["700"]}/>
					</foreignObject>
				</g>
			);
		}
		if (this.props.stage >= 1) {
			let rBasis = last.πₑ;
			if (this.props.stage == 1) rBasis = last.π;
			connectors.push(
				<g className="g-r">
					<path className="real-r" d={`M${x0+45},${yScale(rBasis)}L${x0+45},${yScale(this.props.i)}`}/>
					<foreignObject width="17px" height="18px" y="-.7em" x={0}
						transform={`translate(${xScale(this.props.time)+50}, ${ yScale(last.i*.5 + rBasis*.5)})`}	>
						<Katexer string={"r"} col={col["cyan"]["700"]}/>
					</foreignObject>
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
