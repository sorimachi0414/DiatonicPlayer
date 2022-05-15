﻿import {
  baseScale,
  checkChordName,
  convertSoundNameNum,
  scaleToDiatonicChords,
  masterChord,
  soundNameList
} from '../subCord.js'
import {store} from '../index.js'
import {masterScale} from "../subCord.js";
//import { COUNT_UP, COUNT_DOWN } from '../actions';
//reducer

//Reducerについて
//UIからdispatchで、reducer.jsの関数を実行
//関数が、return{type:**}でActionを発行
//mainReducerが全てのActionを受け取り、type毎に新しいstateを発行する

import * as Def from "../subCord";

const stepNum=96
const numToDiatonicPurpose=["T","SD","T","D","T","SD","D"]

export const initialState = {
  clickCount: 0,
  currentValue: 0,
  diatonics:{
    keyNum:9,
    scale:"01_Major",
    scaleNotes:[0,2,4,5,7,9,11],
    flgHighChord:"1",
    chordNames:["AM7", "Bm7", "C#m7", "DM7", "E7", "F#m7", "G#m7b5" ],
    chordsNotes:Array(7).fill(9),
  },
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
    typeOfScale:Array(4).fill("02_Major"),
    rawScaleNoteList:Array(4).fill(masterScale['02_Major'].map(x=>(x+9)%12)),
  },
}
//diatonicNames:["AM7", "Bm7", "C#m7", "DM7", "E7", "F#m7", "G#m7b5" ],z
//diatonicChords: Array(7).fill(9),

export const shiftScaleNote=(i,value)=>{
  let state=store.getState().stateManager
  let keyNum =state.diatonics.keyNum
  keyNum = (keyNum +value)%12

  let list = state.base.rootNoteOfScale.slice()
  list[i] = (list[i]+value+12)%12
  //raw scale = backing track??
  let rawScaleNoteList=state.base.rawScaleNoteList.slice()
  rawScaleNoteList[i]=masterScale[state.base.typeOfScale[i]].map(x => (x+state.base.rootNoteOfScale[i]+value) % 12)

  //Add for diatonic app
  let rootNow = list[0]
  let scaleNoteList =state.diatonics.scaleNotes.map(x=>(x+rootNow+12)%12)

  //make diatonicChords from a scale
  let diatonicChords=scaleToDiatonicChords(scaleNoteList)

  //add base sound
  diatonicChords.map((val,index)=>{
    diatonicChords[index].push(soundNameList[scaleNoteList[index]]+'2')
  })

    //make Chord Name like CM7,Dm7,...
  let diatonicChordsNum = convertSoundNameNum(diatonicChords)
  let diatonicChordNames = diatonicChordsNum.map(x=>checkChordName(x))

  return{
    type:'SHIFT_SCALE_NOTE',
    payload:list,
    meta:rawScaleNoteList,
    diatonicChords:diatonicChords, //[CM7,Am7,...]
    diatonicNames:diatonicChordNames, //[[C3,E3,G3],[D3,F3,...]...]
    keyNum:keyNum,//0 or 2 or etc
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

export const flipHighChord=(value)=>{
  return {type:'FLIP_HIGH_CHORD',value}
}

export const countUp = (value) => {
  return {type: 'COUNT_UP',value  };
}

export const countDown = (value) => {
  return {  type: 'COUNT_DOWN',value };
}

export const setBaseScale=(i,value)=> {
  let state = store.getState().stateManager
  let scaleNoteList = baseScale[value].map(x => (x+state.base.rootNoteOfScale[i]) % 12)

  //extract valid scalestrue
  let availableScales ={}

  for(let key in masterScale){
    let eachScale=masterScale[key]
    let valid=true
    for(let eachNote of eachScale){
      console.log(eachNote)
      if(baseScale[value].includes(eachNote)==false) {
        valid=false
      }
    }
    if(valid){
      availableScales[key]=eachScale
    }
  }

  //make diatonicChords from a scale
  let diatonicChords=scaleToDiatonicChords(scaleNoteList)
  //add base sound
  diatonicChords.map((val,index)=>{
    diatonicChords[index].push(soundNameList[scaleNoteList[index]]+'2')
  })

  //make Chord Name like CM7,Dm7,...
  let diatonicChordsNum = convertSoundNameNum(diatonicChords)
  let diatonicChordNames = diatonicChordsNum.map(x=>checkChordName(x))

  let chordList=[]
  chordList[0]=diatonicChords[0]
  chordList[1]=diatonicChords[3]
  chordList[2]=diatonicChords[4]
  chordList[3]=diatonicChords[0]

  return {
    type: 'SET_BASE_SCALE',
    scale:value,
    payload:scaleNoteList,
    meta:availableScales,
    i:i,
    chordList:chordList,
    diatonicChords:diatonicChords,
    diatonicNames:diatonicChordNames
  }
}

export const setScaleType=(i,value)=> {
  let state = store.getState().stateManager
  let list = state.base.typeOfScale.slice()
  // list[i]=value
  list=[value,value,value,value]
  let rawScaleNoteList=state.base.rawScaleNoteList.slice()
  rawScaleNoteList[i]=masterScale[value].map(x => (x+state.base.rootNoteOfScale[i]) % 12)
  rawScaleNoteList=[rawScaleNoteList[i],rawScaleNoteList[i],rawScaleNoteList[i],rawScaleNoteList[i]]


  return {type: 'SET_SCALE_TYPE', payload:list,meta:rawScaleNoteList,i:i}
}

//This is Reudcer
export const mainReducer= (state = initialState, action) => {
  switch (action.type) {
    //mainReducerは、受け取った変数をStateに反映するだけ。
    case 'LOAD_LOCALSTORAGE':
      return{...state,base:action.base}

    case 'SET_BASE_SCALE':
      return{
        ...state,
        diatonics:{...state.diatonics,scale:action.scale,chordNames:action.diatonicNames,chordsNotes:action.diatonicChords,},
        base:{...state.base,availableScales:action.meta,chordList:action.chordList,}
      }

    case 'SET_SCALE_TYPE':
      return{...state,
        base:{...state.base,typeOfScale:action.payload,rawScaleNoteList:action.meta}}

    case 'SHIFT_SCALE_NOTE':
      return{...state,
        diatonics:{...state.diatonics,chordNames:action.diatonicNames,chordsNotes:action.diatonicChords,keyNum:action.keyNum},
        base:{...state.base,rootNoteOfScale:action.payload,rawScaleNoteList: action.meta,}}
    case 'FLIP_SYMBOL':
      return{...state,
        base:{...state.base,displayCircle:!state.base.displayCircle}}
    case 'SET_CHORD_PLAN':
      return{...state,
        base:{...state.base,chordPlan:action.value}}
    case 'SET_CHORD_TYPE':
      return{...state,
        base:{...state.base,typesOfChords:action.value,chordList:action.chordList}
      }
    case 'CHANGE_ROOT_NOTES':
      return{...state,
        base:{...state.base,rootNoteOfChords:action.value,chordList:action.chordList}
      }
    case 'STEP':
      let step = (state.base.step+1) %(stepNum/1)
      let nextStep = (step+1) %stepNum
      let beat1m=0//~~(step/(stepNum/4))
      let nextBeat1m=1//(beat1m+1 )%4

      let blocksColor=Array(4).fill("btn btn-outline-primary h-100 w-100")
      blocksColor[beat1m]="btn btn-warning h-100 w-100"
      return{
        base:{...state.base,  step:step,nextStep:nextStep,beat1m:beat1m,nextBeat1m:nextBeat1m,blocksColor:blocksColor}
      }
    case 'RENEW_CHORD_LIST':
      let extractFromList=(array)=>{
        return array[Math.floor(Math.random() * array.length)]
      }

      let getCadence =(lastChord)=>{
        let nextChord=0
        if (lastChord==4){
          nextChord=extractFromList([0,0,0,0,2,5])
        }else if(lastChord==0){
          nextChord=extractFromList([0,2,2,5,5,1,1,3,3,6,6,4,4])
        }else if(lastChord==1){
          nextChord=extractFromList([0,0,2,2,5,5,1,3,3,6,6,4,4])
        }else if(lastChord==2){
          nextChord=extractFromList([0,0,2,5,5,1,1,3,3,6,6,4,4])
        }else if(lastChord==3){
          nextChord=extractFromList([0,0,2,2,5,5,1,1,3,6,6,4,4])
        }else if(lastChord==5){
          nextChord=extractFromList([0,0,2,2,5,1,1,3,3,6,6,4,4])
        }else if(lastChord==6){
          nextChord=extractFromList([0,0,2,2,5,5,1,1,3,3,6,4,4])
        }
        return nextChord
      }
      // ...chord0| chord1 chord 2 chord 3 chord4 | chord1 chord2,,,
      let chord0,chord1,chord2,chord3,chord4
      chord0 = state.base.chordList[3]
      chord1 = getCadence(chord0)
      chord2 = getCadence(chord1)
      chord3 = getCadence(chord2)
      chord4 = getCadence(chord3)



      let chordList=[]
      chordList[0]=state.diatonics.chordsNotes[chord1]
      chordList[1]=state.diatonics.chordsNotes[chord2]
      chordList[2]=state.diatonics.chordsNotes[chord3]
      chordList[3]=state.diatonics.chordsNotes[chord4]

      let staticTonics = state.diatonics.chordsNotes[0]+state.diatonics.chordsNotes[2]+state.diatonics.chordsNotes[5]
      let staticSubDominants = state.diatonics.chordsNotes[1]+state.diatonics.chordsNotes[3]
      let staticDominants = state.diatonics.chordsNotes[4]+state.diatonics.chordsNotes[6]

      //let diatonicNames = numToDiatonicPurpose[chord1] +" -> "+numToDiatonicPurpose[chord2] + " -> " +numToDiatonicPurpose[chord3] +" -> "+numToDiatonicPurpose[chord4]
      let diatonicNames = staticTonics +" -> "+staticSubDominants + " -> " +staticDominants
      //let diatonicNames = []

      return{...state,
        diatonics:{...state.diatonics,chordNames:action.diatonicNames},
        base:{...state.base,chordList:chordList,}
      }
    case 'CHANGE_INST':
      return{...state,
        base:{...state.base,  inst:action.value}
      }
    case 'CHANGE_DRUM':
      let bdPlan  =Def.rhythmList[action.value]["BD"]
      let sdPlan  =Def.rhythmList[action.value]["SD"]
      let hhcPlan =Def.rhythmList[action.value]["HHC"]
      return{...state,
        base:{...state.base,  drum:action.value,bdplan:bdPlan,sdPlan:sdPlan,hhcPlan: hhcPlan}
      }
//    case 'SHIFT_SCALE_NOTE':
//      return{
//        base:{...state.base,  rootNoteOfScale:action.value,rawScaleNoteList:action.meta}
//      }
    case 'BPM':
      return{...state,
        base:{...state.base,  bpm:state.base.bpm+action.value}
      }
    case 'PLAY_STOP':
      let label = state.base.isPlay ? 'Play' : 'Stop'
      return{...state,
        base:{...state.base,isPlay:!state.base.isPlay,isPlayLabel:label}
      }
    case 'FLIP_HIGH_CHORD':
      let flgHighChord = state.diatonics.flgHighChord
      if(flgHighChord>0){
        flgHighChord=0
      }else{
        flgHighChord=1
      }
      return{
        ...state,
        diatonics:{...state.diatonics,flgHighChord:flgHighChord},
        base:{...state.base,}
      }
    default:
      return state;
  }
}

