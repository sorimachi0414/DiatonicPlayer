import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'

//Redux
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import {ScaleSelectorFooterRedux_func, ScaleSelectorRedux_func} from './components/scaleSelector'
import {MusicSelector_func} from './components/musicSelector.js'
import {mainReducer} from "./reducers/reducer";
import {DiatonicDisplay_func} from "./components/diatonicDisplay";
import {FooterRedux_func} from "./components/footer";

///debug content
const reducer = () => combineReducers({
  stateManager: mainReducer,
});

export const store = createStore(
  reducer(),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

//stateが更新された時のコールバック
store.subscribe(()=>{
  /*
  let state = store.getState().stateManager
  playStopSwitch(state.base.isPlay)
  Tone.Transport.bpm.value = state.base.bpm
  instrument=Def.instList[state.base.inst]
   */
  //TODO:Debug unset commentout for release
  //localStorage.setItem('base', JSON.stringify(state.base));
});

// ----------------------------------------
//スマートフォンでのダブルタップ抑制
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });

// VIEW----------------------------------------
export let buffers={}
const WholeBlock =(props)=>{

  React.useEffect(() => {
    //called once

    //Loading state from localStorage
    document.title = 'Diatonic Chords Generator';
    if ("base" in localStorage) {
      let base=JSON.parse(localStorage.getItem('base'))
      store.dispatch(
        {type:'LOAD_LOCALSTORAGE',base:{...base,isPlay:false,isPlayLabel:'Play'}}
      )
    }

  }, []);


  return(
    <div>
      <Container fluid>
        <Row className="justify-content-center mb-5">
          <Col  xs={12} md={10} className="text-center">
            Diatonic Chord Player
          </Col>
          <Col xs={12} sm={12} md={12} lg={10} xl={8} className="px-0">

            <div className="card my-2">
              <div className="card-header">
                Scale Selector
              </div>
              <div className="card-body pt-1">
                <ScaleSelectorRedux_func />
              </div>
            </div>

            <div className="card my-2">
              <div className="card-header">
                Diatonic Chords
              </div>
              <Row className='card-body pt-1'>
                <DiatonicDisplay_func />
              </Row>
            </div>

          </Col>
        </Row>

      </Container>

      <Container>
        <Row className="navbar navbar-light bg-light fixed-bottom">
          <Col xs={12} sm={10} md={10} lg={6} className="offset-sm-1 offset-md-2 offset-lg-3">
            <Row className="px-1 mx-0">

                <FooterRedux_func />

            </Row>
          </Col>
    </Row>
      </Container>
    </div>
  )

}

ReactDOM.render(
  <Provider store={store}>
    <WholeBlock />
  </Provider>,
  document.getElementById('root')
);
