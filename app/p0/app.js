import { connect } from 'react-redux';
import React from 'react';
import * as d3 from 'd3';
import { Provider } from 'react-redux';
import './style-app.scss';
import Plot from './plot/plot';
import store from './reduce';


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(){
    // There must be a better way to pass new configurations to the store. This shit is ugly.
    // if (this.props.externalConfig != this.props.config) this.props.setConfig(this.props.externalConfig);
    // if (this.props.externalMacroData != this.props.macroData) this.props.setMacroData(this.props.externalMacroData);
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
  pausePlay() {
    console.log("App Pause/Play");
    //if (!(this.paused = !this.paused)) {
      let last = 0;
      this.timer = d3.timer(elapsed => {
          const dt = elapsed - last;
          last = elapsed;
          if (this.paused) this.timer.stop();
          this.props.tick(dt);
          // console.log("Delta: %s", dt);
          //if (this.props.victory != last.victory) this.setState({this}); 
        });
    //}
  }
  render() {
    let props = this.props;
    let {data, config} = props;

    return (
      <div className='main' style={{display: 'flex', flexDirection: 'column'}}>
        {config.symbols.length == 0 ? null :
          <div className='flex-container-row'>
            <div className='plot-container'><Plot /></div>
          </div>
        }
        <div className='status-bar'>
          <div className='status-text'>
            {config.statusOverride ?
              config.statusOverride :
              data.status
            }
          </div>

          {config.buttonOverride ?
            <button className="status-button" onClick={props.advanceCallback}>{config.buttonOverride}</button> :
            data.victory == 0 ? null :
              config.conclusion || data.victory < 0 ?
                <button className="status-button" onClick={props.reset}>RESET</button> :
                <button className="status-button" onClick={props.advanceCallback}>ADVANCE</button>
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
    advance() {
      dispatch({ type: 'ADVANCE' });
    },
    */
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

class PlotApp extends React.Component {
  constructor(props) {
    super(props);
    if (props.config) console.log("PlotApp configuration Received!");
    else console.log("PlotApp configuration not received.")
  }
  render() {
    console.log("Rendering PlotApp (container for PlotAppComponent)")
    return (
      <Provider store={store}>
        <ConnectedApp externalConfig={this.props.config} advanceCallback={this.props.advanceCallback} externalMacroData={this.props.macroData}/>
      </Provider>
    );
  }
}


export default PlotApp;