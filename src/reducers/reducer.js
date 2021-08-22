import {masterChord,soundNameList} from '../subCord.js'
import {store} from '../index.js'
import {masterScale} from "../subCord.js";
//import { COUNT_UP, COUNT_DOWN } from '../actions';
//reducer
import * as Def from "../subCord";

const stepNum=96

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
    nextStep:1,
    beat1m:0,
    nextBeat1m:1,
    bdPlan  :Def.rhythmList["Rock"]["BD"],
    sdPlan  :Def.rhythmList["Rock"]["SD"],
    hhcPlan :Def.rhythmList["Rock"]["HHC"],
    chordList:[['A2','A3','C#3','E3','G3',],['A2','A3','C#3','E3','G3',],['D2','D3','F#3','A3','C3'],['D2','D3','F#3','A3','C3']],
    chordPlan:[
      ['1m',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
      [0,0,0,0,'1m',0,0,'4n',0,0,0,0,0,0,0,0,],
      [0,0,0,0,0,0,0,0,'1m',0,0,0,0,0,0,0,],
      [0,0,0,0,0,0,0,0,0,0,0,0,'1m',0,0,0,]
    ],
    blocksColor:Array(4).fill("btn btn-outline-primary w-100"),
    typesOfChords:Array(4).fill('07_7'),
    rootNoteOfChords:[9,9,2,2],
    displayCircle:true,
    scaleBlocksColor:Array(4).fill("btn btn-outline-primary w-100"),
    rootNoteOfScale:Array(4).fill(9),
    typeOfScale:Array(4).fill("04_minorPentatonic"),
    rawScaleNoteList:Array(4).fill(masterScale['04_minorPentatonic'].map(x=>(x+9)%12))
  },
}

export const shiftScaleNote=(i,value)=>{
  let state=store.getState().stateManager
  let list = state.base.rootNoteOfScale.slice()
  list[i] = (list[i]+value+12)%12

  let rawScaleNoteList=state.base.rawScaleNoteList.slice()
  rawScaleNoteList[i]=masterScale[state.base.typeOfScale[i]].map(x => (x+state.base.rootNoteOfScale[i]+value) % 12)
  return{
    type:'SHIFT_SCALE_NOTE',
    payload:list,
    meta:rawScaleNoteList
  }
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

export const setScaleType=(i,value)=> {
  let state = store.getState().stateManager
  let list = state.base.typeOfScale.slice()
  list[i]=value
  let rawScaleNoteList=state.base.rawScaleNoteList.slice()
  rawScaleNoteList[i]=masterScale[value].map(x => (x+state.base.rootNoteOfScale[i]) % 12)
  return {type: 'SET_SCALE_TYPE', payload:list,meta:rawScaleNoteList,i:i}
}

//This is Reudcer
export const mainReducer= (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_LOCALSTORAGE':
      return{base:action.base}
    case 'SET_SCALE_TYPE':
      return{base:{...state.base,typeOfScale:action.payload,rawScaleNoteList:action.meta}}
    case 'SHIFT_SCALE_NOTE':
      return{base:{...state.base,rootNoteOfScale:action.payload,rawScaleNoteList: action.meta}}
    case 'FLIP_SYMBOL':
      return{base:{...state.base,displayCircle:!state.base.displayCircle}}
    case 'SET_CHORD_PLAN':
      return{base:{...state.base,chordPlan:action.value}}
    case 'SET_CHORD_TYPE':
      return{
        base:{...state.base,typesOfChords:action.value,chordList:action.chordList}
      }
    case 'CHANGE_ROOT_NOTES':
      return{
        base:{...state.base,rootNoteOfChords:action.value,chordList:action.chordList}
      }
    case 'STEP':
      let step = (state.base.step+1) %stepNum
      let nextStep = (step+1) %stepNum
      let beat1m=~~(step/(stepNum/4))
      let nextBeat1m=(beat1m+1 )%4
      let blocksColor=Array(4).fill("btn btn-outline-primary h-100 w-100")
      blocksColor[beat1m]="btn btn-warning h-100 w-100"
      return{
        base:{...state.base,  step:step,nextStep:nextStep,beat1m:beat1m,nextBeat1m:nextBeat1m,blocksColor:blocksColor}
      }
    case 'CHANGE_INST':
      return{
        base:{...state.base,  inst:action.value}
      }
    case 'CHANGE_DRUM':
      let bdPlan  =Def.rhythmList[action.value]["BD"]
      let sdPlan  =Def.rhythmList[action.value]["SD"]
      let hhcPlan =Def.rhythmList[action.value]["HHC"]
      return{
        base:{...state.base,  drum:action.value,bdplan:bdPlan,sdPlan:sdPlan,hhcPlan: hhcPlan}
      }
//    case 'SHIFT_SCALE_NOTE':
//      return{
//        base:{...state.base,  rootNoteOfScale:action.value,rawScaleNoteList:action.meta}
//      }
    case 'BPM':
      return{
        base:{...state.base,  bpm:state.base.bpm+action.value}
      }
    case 'PLAY_STOP':
      let label = state.base.isPlay ? 'Play' : 'Stop'
      return{
        base:{...state.base,isPlay:!state.base.isPlay,isPlayLabel:label}
      }
    default:
      return state;
  }
}

