import React from 'react';
import * as d3 from 'd3';
import col from "../../style/colors";


const SvgSlider = React.createClass({
	componentDidMount() {
		const onChange = this.props.onChange;
		let dragging = false;
		const drag = d3.drag()
			.on('drag', () => {
				dragging = true;
				onChange(d3.mouse(this.refs.container)[1]);
			})
			.on('end', () => {
				dragging = false;
				//a();
			});
		//d3.select(this.refs.container).call(drag);
		const circ = d3.select(this.refs.container)
			.select('circle');
		/*
		function a() {
			if (dragging) {
				circ.transition()
					.duration(200)
					.attr('r', 6);
					return;
			}
			circ.transition('grow')
				.duration(700)
				.ease(d3.easeCubicInOut)
				.attr("r", 7.5)
				.transition('grow')
				.duration(1000)
				.ease(d3.easeCubicInOut)
				.attr('r', 4)
				.each('end', a);
		}
		a();
		*/
	},
	render() {
		const { domain, height, ypx } = this.props;
		return (
			<g className='g-slider' ref="container" >
				<circle 
					className='circle-handle' 
					transform={`translate(0,${ypx})`}
					stroke={'white'}
					r={6}/>
			</g>
		);
	}
});

export default SvgSlider;
