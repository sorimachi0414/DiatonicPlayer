//import { COUNT_UP, COUNT_DOWN } from '../actions';
//reducer
import * as Def from "../subCord";

export const initialState = {
  clickCount: 0,
  currentValue: 0,
  base: {
    isPlay: false,
    isPlayLabel: 'Play',
    bpm: 130,
    inst:'organ',
    drum:'Rock',
    step:0,
    beat:3,
    bdPlan  :Def.rhythmList["Rock"]["BD"],
    sdPlan  :Def.rhythmList["Rock"]["SD"],
    hhcPlan :Def.rhythmList["Rock"]["HHC"],
    chordList:[['A2','A3','C#3','E3','G3',],['A2','A3','C#3','E3','G3',],['D2','D3','F#3','A3','C3'],['D2','D3','F#3','A3','C3']],
    chordPlan:[
      ['1m',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
      [0,0,0,0,'1m',0,0,'4n',0,0,0,0,0,0,0,0,],
      [0,0,0,0,0,0,0,0,'1m',0,0,0,0,0,0,0,],
      [0,0,0,0,0,0,0,0,0,0,0,0,'1m',0,0,0,],
    ],
  },
}

export const setRepeat = (value)=>{
  return {  type:'SET_REPEAT',value  }
}

export const bpmChangeType = (value)=>{
  return {  type:'BPM',value  }
}

export const playStopType = (value)=>{
  return{ type:'PLAY_STOP',  }
}

export const changeInstP=(value)=>{
  return{ type:'CHANGE_INST',value  }
}

export const changeDrum=(value)=>{
  return{ type:'CHANGE_DRUM',value  }
}

export const countUp = (value) => {
  return {type: 'COUNT_UP',value  };
}

export const countDown = (value) => {
  return {  type: 'COUNT_DOWN',value };
}

//This is Reudcer
export const mainReducer= (state = initialState, action) => {
  switch (action.type) {
    case 'STEP':
      let step = state.base.step
      step = step>=96-1 ? 0 :step+1
      return{
        base:{...state.base,  step:step}
      }
    case 'CHANGE_INST':
      return{
        base:{...state.base,  inst:action.value}
      }
    case 'CHANGE_DRUM':
      return{
        base:{...state.base,  drum:action.value}
      }
    case 'BPM':
      return{
        base:{...state.base,  bpm:state.base.bpm+action.value}
      }
    case 'PLAY_STOP':
      let label = state.base.isPlay ? 'Play' : 'Stop'
      return{
        base:{...state.base,isPlay:!state.base.isPlay,isPlayLabel:label}
      }
    case 'COUNT_UP':
      return {
        clickCount: state.clickCount + 1,
        currentValue: state.currentValue + action.value
      };
    case 'COUNT_DOWN':
      return {
        clickCount: state.clickCount + 1,
        currentValue: state.currentValue - action.value
      };
    default:
      return state;
  }
}

