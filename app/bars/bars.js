import { connect } from 'react-redux';
import React from 'react';
import * as d3 from 'd3';
import { Provider } from 'react-redux';
import './style-bars.scss';
import Chart from './chart';
import createStore from './reduce';


class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    let last = 0;
    let timer = d3.timer(elapsed => {
      const dt = elapsed - last;
      last = elapsed;
      // if (this.paused) this.timer.stop();
      props.tick(dt);
    });
  }
  componentWillReceiveProps(){
  }
  componentDidMount(){
    console.log("PlotAppComponent is mounted");
  	// this.pausePlay();
    // if (this.props.externalConfig) this.props.setConfig(this.props.externalConfig);
    /*
  	setTimeout(()=>{
  		this.pausePlay();
  	}, 2200);
    */
  	//!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
  }
  render() {
    let props = this.props;
    let {data, config} = props;

    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {config.symbols.length == 0 || config.hide ? null :
          <div className='flex-container-row'>
            <div className='chart-container'><Chart/></div>
          </div>
        }
        <div className='status-bar'>
          {config.hide ? null :
            <div className='status-text'>
              {data.status}
            </div>
          }
          {config.hide ? null :
            data.time == 0 ? null :
              data.victory == 0 && config.goal ? null :
                data.victory > 0 ?
                  <button className="status-button" onClick={props.advance}>NEXT</button> :
                  <button className="status-button" onClick={props.reset}>RESET</button>
          }
        </div>
  		</div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    /*
    conclude() {
      dispatch({ type: 'CONCLUDE' });
    },
    */
    pause() {
      dispatch({ type: 'PAUSE' });
    },
    play() {
      dispatch({ type: 'PLAY' });
    },
    advance() {
      dispatch({ type: 'ADVANCE' });
    },
    reset() {
      dispatch({ type: 'RESET' });
    },
    tick(dt) {
      dispatch({
        type: 'TICK',
        dt
      });
    },
    setVariable({ value, variable }) {
      dispatch({
        type: 'SET_VARIABLE',
        value,
        variable
      });
    }
  };
};

const ConnectedApp = connect(state => state, mapDispatchToProps)(AppComponent);

class Bars extends React.Component {
  constructor(props) {
    super(props);

    let store = createStore();

    store.dispatch({type: 'CONFIGURE', config: props.config});

    this.state = {
      store: store,
    }
  }
  render() {
    console.log("Rendering Bars (container for Chart AppComponent)")
    return (
      <Provider store={this.state.store}>
        <ConnectedApp/>
      </Provider>
    );
  }
}


export default Bars;