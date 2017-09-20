import { connect } from 'react-redux';
import _ from 'lodash';
import React from 'react';
import * as d3 from 'd3';
import col from "../style/colors";
import symbolColors from "../style/symbolColors";

// const m = {
// 	top: 8,
// 	left: 8,
// 	bottom: 8,
// 	right: 8
// };
const m = 16;

const varSpecs = {
  i: {
  	name: 'Nominal Interest',
  	showDelta: false,
  },
  π: {
  	name: 'Inflation',
  	showDelta: true,
  },
  πₑ: {
  	name: 'Expected Inflation',
  	showDelta: false,

  },
  r: {
  	name: 'Real Interest',
  	parent: ['πₑ', 'π'],
  	span: 'i',
  	showDelta: false,
  },
  r̄: {
  	name: 'Natural Real Interest',
  	outline: 'r',
  	showDelta: false,
  	// floor: ['πₑ', 'π']
  },
  u: {
  	name: 'Unemployment',
  	showDelta: true,
  },
  ū: {
  	name: 'Natural Unemployment',
  	outline: 'u',
  	showDelta: false,
  },
  y: {
  	name: 'GDP Growth',
  	showDelta: true,

  },
  ȳ: {
  	name: 'Natural GDP Growth',
  	outline: 'y',
  	showDelta: false,
  },
};

// for (var s in varSpecs) {
	// if (s.floor)
// }

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
		return <stack className="katex-stack" style={{color: this.props.col}} dangerouslySetInnerHTML={ {__html: rendered } } />
	}
});
*/

class Chart extends React.Component{
	constructor(props){
		super(props);
	}
	yScale(v) {
		const { yDomain, height } = this.props;
		return height*v/(yDomain[1]-yDomain[0]);
	}
	onChange(ypx) {
		const { height, yDomain, paused } = this.props;
		// ypx -= m;
		ypx = height-ypx+m;
		let i = (ypx/height)*(yDomain[1]-yDomain[0]);
		i = Math.min(i, yDomain[1]);
		i = Math.max(i, yDomain[0]);
		this.props.dispatch({type: 'SET_I', i});
		// if (paused) this.props.dispatch({type: 'SET_I', i});
	}
	changePlot(changes) {
		this.props.dispatch({ type: 'CHANGE_PLOT', changes });
	}
	componentDidMount() {
		// const domNode = findDOMNode(this);
		console.log("Chart Mounted");
		this.resize();
    	//this.createGraph();
		window.addEventListener('resize', this.resize);

	}
	mountChart(div){
		if (!this.chart) {
			this.chart = div;

		}
	}
	mountContainer(div){
		if (!this.container) {
			console.log("Registering drag event on container");
			this.container = div;
			let dragging = false;
			const drag = d3.drag()
				.on('start', () => {
					dragging = true;
					this.props.dispatch({type: 'PAUSE'});
				})
				.on('drag', () => {
					dragging = true;
					if (!this.props.allowAdjustment) this.props.dispatch({type: 'RESET'});
					this.onChange(d3.mouse(div)[1]);
				})
				.on('end', () => {
					dragging = false;
					this.props.dispatch({type: 'PLAY'});
					//a();
				});
			d3.select(div).call(drag);
		}
	}
  componentDidUpdate() {
	// console.log("Component Updated");
  	//this.createGraph();
  }
	resize() {
		const width = this.chart.clientWidth;// - m*2;
		const height = this.chart.clientHeight;// - m*2;
		console.log("Chart resizing to %s, %s", width, height);
		this.changePlot({ width, height });
	}
	componentWillUnmount() {
		console.log("Chart Unmounting");
		window.removeEventListener('resize', this.resize);
	}
	generateGoal(goal, spec){

		let goalHeight = 20;
		let goalTop = -this.yScale(goal.value);

		let borderWidth = 1;
		let borderRadius = 0;//goalHeight/2;

		// if (goal.sign > 0) goalTop -= goalHeight;
		goalTop -= goalHeight/2;
		goalTop -= borderWidth; //Because of border

		let timerFill = 'white';//'rgba(0, 0, 0, 0)';
		let timerText = null;
		let timerWidth = null;
		let timerHeight = goalHeight-4;
		let timerTop = 2;
		let timerTextSize = 16;

		let backgroundWidth = 100;

		if (goal.timer) {
			let goalTime = Math.max(goal.timer.t-this.props.time, 0);
			timerWidth = (backgroundWidth*goalTime/goal.timer.t)+'%';

			if (goalTime > 0) {
				timerFill = col['red']['600'];
				timerText = Math.ceil(goalTime) + (this.props.paused ? " Seconds" : "...");
			}
			else {
				timerText = '✔';//✓';
				timerTextSize = 13;
			}
		}

		return (
			<div className='goal'
				style={{
					position: 'absolute',
					// overflow: 'hidden',

					display: 'flex',
					justifyContent: 'center',

					top: goalTop,
					width: '100%',
					height: goalHeight+2*borderWidth,
					// margin: '0 auto',

					zIndex: 2,
				}}
				>
				<div className='checkerPattern'
					style={{
						position: 'absolute',
						// overflow: 'visible',

						// background: timerFill,

						borderRadius,
						border: borderWidth+'px solid black',

						top: -borderWidth,

						width: backgroundWidth+'%',
						height: goalHeight,
						zIndex: 1,
					}}
					>
				</div>
				{!timerText ? null :
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						position: 'absolute',
						overflow: 'visible',
						width: '100%',
					}}
					>
					<div className='progress'
						style={{
							// margin: 'auto',
							position: 'absolute',
							overflow: 'visible',
							// lineHeight: spec.height,
							fontSize: 16,

							borderRadius,
							// border: borderWidth+'px solid black',

							background: timerFill,
							// wordBreak: 'keep-all',
							// whiteSpace: 'nowrap',
							width: timerWidth,//'30%',
							height: goalHeight,
							// lineHeight: goalHeight,
							textAlign: 'center',
							// height: '100%',
							zIndex: 1,
							opacity: 0.95,
						}}
						>
					</div>
					<div
						style={{
							// fontFamily: 'Tahoma, Geneva, sans-serif',
							flexGrow: 0,
							// margin: 'auto',
							position: 'absolute',
							// overflow: 'visible',
							// lineHeight: spec.height,
							fontSize: timerTextSize,

							top: timerTop,
							borderRadius: timerHeight/2,

							background: 'white',
							// wordBreak: 'keep-all',
							// whiteSpace: 'nowrap',
							// width: 40,
							minWidth: 40,
							// minWidth: '4px',
							// flexBasis: 10,
							padding: '0 8px',
							height: timerHeight,
							// lineHeight: goalHeight,
							textAlign: 'center',
							// height: '100%',
							zIndex: 2,
						}}
						>
						{timerText}
					</div>
				</div>
				}
			</div>
		);
	}
	generateArrow(spec){
		// let tipHeight
		let shaftWidth = 2;
		let shaftHeight = this.yScale(Math.abs(spec.delta));

		let tipSize = 12;
		let tipScaled = Math.min(shaftHeight, tipSize);
		let tipBorderSide = tipSize+'px solid transparent';
		let tipBorderDown = tipScaled+'px solid #000';
		let tipBorderUp = 'none';

		let shaftBorder = shaftWidth/2+'px dashed #000';

		shaftHeight -= tipScaled;

		let shaftTop = (spec.value < 0 ? spec.height : 0) - (spec.delta > 0 ? shaftHeight : 0)-spec.scaledBorderWidth;
		let tipTop = (spec.delta > 0 ? -shaftHeight-tipScaled : shaftHeight)-spec.scaledBorderWidth;

		return (
			<div className='delta'
				style={{
					opacity: 0.8,
					zIndex: 1,
				}}
				>
				<div className='shaft'
					style={{
						// margin: 'auto',
						position: 'absolute',
						overflow: 'visible',
						// background: '#000',
						// lineHeight: spec.height,

						top: shaftTop,
						height: shaftHeight,
						// wordBreak: 'keep-all',
						// whiteSpace: 'nowrap',
						width: shaftWidth,//shaftWidth,
						marginLeft: -shaftWidth,

						borderLeft: shaftBorder,
						borderRight: shaftBorder,
						// height: '100%',
					}}
					>
				</div>
				<div className='tip'
					style={{
						// margin: 'auto',
						position: 'absolute',
						overflow: 'visible',
						// lineHeight: spec.height,
						marginLeft: -tipSize,
					  borderLeft: tipBorderSide,
					  borderRight: tipBorderSide,
	  				borderBottom: (spec.delta < 0 ? tipBorderUp : tipBorderDown),
	  				borderTop: (spec.delta > 0 ? tipBorderUp : tipBorderDown),

	  				top: tipTop,
						// wordBreak: 'keep-all',
						// whiteSpace: 'nowrap',
						width: 0,
						height: 0,
						// height: '100%',
					}}
					>
				</div>
			</div>
		);
	}
	generateBars(spec, parent){
		let props = this.props;
		let {yScale, onChange } = this;
		let {yDomain, xDomain} = props;

		//let floorSymbol = stackFloorSymbols[stackSymbols.indexOf(s)];
		//let peakSymbol = varSpecs[s].peak;

		//let height = yScale(Math.abs(val));

		//let top = -yScale(props[bottomSymbol]+Math.abs(val));
		spec.value0 = parent ? parent.value1 : 0;
		spec.value1 = spec.span ? spec.span.value1 : spec.value0+spec.value;

		spec.background = spec.outline ? 'rgba(0, 0, 0, 0)' : spec.value < 0 ? 'rgba(0, 0, 0, 0.6)' : symbolColors[spec.symbol];
		spec.borderStyle = spec.outline ? 'dashed' : 'solid';
		spec.borderWidth = spec.outline ? 4 : 8;
		spec.borderColor = symbolColors[spec.symbol];
		// spec.opacity = !parent || spec.outline ? 1 : 0.85;
		spec.color = spec.outline ? 'black' : 'white';
		// spec.top = -this.yScale(Math.max(spec.value, 0));

		spec.height = this.yScale(Math.abs(spec.value1-spec.value0));
		spec.top = -this.yScale(Math.max(spec.value0, spec.value1));

		spec.scaledBorderWidth = Math.min(spec.height/2, spec.borderWidth);

		// console.log(spec);

		let ss = this.generateBars.bind(this);
		let childDivs = _.map(spec.children, c => ss(c, spec));

		let gg = this.generateGoal.bind(this);
		let goalDivs = _.map(spec.goals, g => gg(g, spec));

		return (
		<div className='bar'
			key={spec.symbol}
			style={{
				flexBasis: 256,
				flexGrow: 0,
				flexShrink: 1,
				flexFloor: 128,

				//margin: -spec.borderWidth,
				//marginLeft: 0,
				//marginRight: 0,

				// display: 'flex',
				// flexDirection: 'column',
				position: 'relative',
			}}
			>
			<div className='fill-overlay'
				style={{
					// flexGrow: 0,
					width: '100%',

					position: 'relative',
					// top: -yScale(val),
					// bottom: yScale(0),
					// height: (100*val/(yDomain[1]-yDomain[0]))+"%",
					// height: yScale(val),

					// background: symbolColors[v],
					borderRadius: 8,

					display: 'flex',
					height: 0,
					overflow: 'visible',

					// textAlign: 'center',
					// lineHeight: b.height,
					// ...b,

				}}
				>
				<div className='fill'
					style={{
						flexShrink: 1,
						flexGrow: 1,
						// width: '100%',

						position: 'relative',
						// top: -yScale(val),
						// bottom: yScale(0),
						// height: (100*val/(yDomain[1]-yDomain[0]))+"%",
						// height: yScale(val),

						// background: symbolColors[v],
						borderRadius: 8,
						//marginTop: -spec.borderWidth,

						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',

						overflow: 'visible',

						top: spec.top,
						height: Math.max(spec.height-spec.borderWidth*2, 0),
						background: spec.background,

						borderTopWidth: spec.scaledBorderWidth,
						borderBottomWidth: spec.scaledBorderWidth,
						borderLeftWidth: spec.borderWidth,
						borderRightWidth: spec.borderWidth,

						borderColor: spec.borderColor,
						borderStyle: spec.borderStyle,

						opacity: spec.opacity,

						// textAlign: 'center',
						// lineHeight: b.height,
						// ...b,

					}}
					>
					<div className='label'
						style={{
							flexGrow: 1,
							flexShrink: 0,
							color: spec.color,
							// margin: 'auto',
							textAlign: 'center',
							position: 'absolute',
							overflow: 'hidden',
							// lineHeight: spec.height,
							// top: spec.height/2,
							// wordBreak: 'keep-all',
							// whiteSpace: 'nowrap',
							width: '100%',
							// height: '100%',
							opacity: 1,
						}}
						>
						<div style={{fontSize: 14}}>{spec.name}</div>
						<div style={{fontSize: 18}}>{spec.symbol+" = "+(Math.round(spec.value*100*10)/10)+"%"}</div>
					</div>
					{!spec.showDelta ? null : this.generateArrow(spec)}
				</div>
				{!spec.overlay ? null :
					<div className='overlay'
						style={{
							flexShrink: 1,
							flexGrow: 1,
							display: 'flex',
							height: 0,
							overflow: 'visible',
							position: 'relative',
							top: 0,
							// width: '100%',
							// top: b.height*Math.sign(-b.val),
						}}
						>
						{this.generateBars.bind(this)(spec.overlay, parent)}
					</div>
				}
			</div>
			{childDivs.length == 0 ? null :
				<div className='children'
					style={{
						display: 'flex',
						height: 0,
						overflow: 'visible',
						position: 'absolute',
						top: 0,
						width: '100%',
						// top: b.height*Math.sign(-b.val),
					}}
					>
					{childDivs}
				</div>
			}
			{goalDivs.length == 0 ? null :
				<div className='goals'
					style={{
						display: 'flex',
						height: 0,
						overflow: 'visible',
						position: 'absolute',
						top: 0,
						width: '100%',
						// top: b.height*Math.sign(-b.val),
					}}
					>
					{goalDivs}
				</div>
			}
		</div>
		);
	}
	render() {
		let props = this.props;
		let {yScale, onChange } = this;
		let {history, width, height, yDomain, xDomain, symbols} = props;

		yScale = yScale.bind(this);
		
		/*
		let vars = [];
		varSpecs.forEach(function(v){
			if (symbols.includes(v[0])) vars.push(v);
		});
		*/

		let goals = this.props.goal ? this.props.goal.vals : [];//_.cloneDeep(this.props.goal.vals);

		// Start with a deep clone of our original specs object. Remove any symbols not in our config.
		//let specs = _.pickBy(_.cloneDeep(varSpecs), (v, k) => _.includes(symbols, k));
		// nvm let's do this so our specs are sorted (is there really no way to sort an object?)
		let specs = {};
		_.forEach(symbols, s => {
			specs[s] = _.cloneDeep(varSpecs[s]);
		});
		// Specs for our root bars
		let barSpecs = _.pickBy(specs, (v, k) => !v.parent && !v.outline);
		// Specs for bars with parents
		let childSpecs = _.pickBy(specs, (v, k) => v.parent && !v.outline);
		// Specs for overlay bars
		let overlaySpecs = _.pickBy(specs, (v, k) => v.outline);
		// If array of possible parents, pick the first one we have a symbol for
		_.forOwn(childSpecs, v => {
			v.parent = v.parent.constructor === Array ?
				_.find(v.parent, p => _.includes(symbols, p)) :
				v.parent;
			if (v.span) {
				v.span = specs[v.span];
				/*
				v.span = v.span.constructor === Array ?
					_.find(v.span, p => _.includes(symbols, p)) :
					v.span;
				*/
			}
			if (v.overlay) {
				v.overlay = specs[v.overlay];
			}
		});
		// Assign children to their parents
		_.forOwn(specs, (v, k) =>
			v.children = _.filter(childSpecs, c => c.parent == k)
		);
		// Assign overlays to the bar they outline
		_.forOwn(specs, (v, k) =>
			v.overlay = _.find(overlaySpecs, o => o.outline == k)
		);

		// Assign symbol, value, and height to each spec
		_.forOwn(specs, (v, k) => {
			v.symbol = k;
			v.value = props[k];
			v.absValue = Math.abs(v.value);
			v.background = symbolColors[k];
			v.delta = props.deltas[k];
			v.showDelta = v.showDelta && props.paused;
			v.goals = _.filter(goals, g => g.symbol == k);
		});

		// Assign symbol, value, and height to each spec
		let ss = this.generateBars.bind(this);
		let bars = _.map(barSpecs, b => ss(b, null));

		return (
			<div className='chart-inner-container'
				ref={this.mountContainer.bind(this)}
				style={{
					// width: '100%',
					// height: '100%',
					// margin: 'auto',
					flexGrow: 1,
					flexFloor: 32,

					display: 'flex',
					flexDirection: 'column',
				}}
				>
				<div className='chart'
					ref={this.mountChart.bind(this)}
					style={{
						marginTop: m,
						marginBottom: m,
						marginLeft: m,
						marginRight: m,

						borderWidth: 1,
						borderColor: '#CCC',
						borderStyle: 'dashed',

						flexGrow: 1,

						display: 'flex',
						justifyContent: 'center',
					}}
					>
					<div className='bars'
						style={{
							display: 'flex',
							position: 'relative',
							justifyContent: 'center',
							top: height,
							width: '100%',
							height: 0,
						}}
						>
						{bars}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.data,
	...state.plot,
	...state.config
});

export default connect(mapStateToProps)(Chart);
