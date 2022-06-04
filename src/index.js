import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";
import * as Def from "./subCord.js"
import {instList, stepNum, tickTackInterval} from "./subCord"
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
import {PlayStopButton_func} from './components/playStopButton.js'
import {BPMChanger_func} from './components/bpmChanger.js'
import {ChordSelectorRedux_func} from './components/chordSelector.js'

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

//Tone.js

//将来的な機能追加で使用するコード
//ステップシーケンサー
/*
function playStopSwitch(status){
  Def.organ.context.resume();
  Def.drum.context.resume();
  Def.piano.context.resume();
  Def.eGuitar.context.resume();
  Def.aGuitar.context.resume();
  (status==1)?Tone.Transport.start():Tone.Transport.stop();
}*/

/*
let instrument=Def.instList['organ']
function playThisChord(chordList,length,time){
  if(length!=0) instrument.triggerAttackRelease(chordList, length,time)
}

const BD = (en,time) => {if(en>0)Def.drum.triggerAttackRelease(['C3'],'1m',time)}
const SD = (en,time) => {if(en>0)Def.drum.triggerAttackRelease(['C4'],'1m',time)}
const HHC = (en,time) => {if(en>0)Def.drum.triggerAttackRelease(['C5'],'1m',time)}

function exPlan16to48(argList){
  let list
  if(argList.length>16){
    list=argList
  }else{
    list=Array(stepNum).fill(0)
    for(let i=0;i<argList.length;i++){
      list[i*6] = argList[i]
    }
  }
  return list
}
*/
/*
//Redux Schedule Repeat
Tone.Transport.scheduleRepeat((time) => {
  let state = store.getState().stateManager.base

  for(let n=0;n<4;n++){
    playThisChord(state.chordList[n],exPlan16to48(state.chordPlan[n])[state.step],time)
  }
  BD(exPlan16to48(state.bdPlan)[state.step],time)
  SD(exPlan16to48(state.sdPlan)[state.step],time)
  HHC(exPlan16to48(state.hhcPlan)[state.step],time)

  //make chordlist
  if(state.step>=95){
    store.dispatch({type:'RENEW_CHORD_LIST'})
  }

  //tickTack
  store.dispatch({type:'STEP'})

}, tickTackInterval, "0m");
*/

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

    // for(let key in instList){
    //   instList[key].onload = ()=>{
    //     console.log('onload')
    //     store.dispatch(
    //       {type:'TONEJS_LOADED',load:true}
    //     )
    //   }
    // }

    //Load inst audio buffer

    //load inst tone.js
    // let inst = store.getState().stateManager.diatonics.inst
    //
    // buffers[inst] = new Tone.Sampler({
    //   urls: {
    //     B2: "agB2.mp3",
    //     B3: "agB3.mp3",
    //     B4: "agB4.mp3",
    //   },
    //   baseUrl: "./",
    //   volume:-10,
    //   onload:()=>{
    //     store.dispatch(
    //       {type:'TONEJS_LOADED',load:true}
    //     )
    //   }
    // }).toDestination();

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
