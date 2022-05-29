﻿import {
  baseScale,
  checkChordName,
  scaleToDiatonicChords,
  masterChord,
  soundNameList, calcDiatonicChords, diatonicOfScaleChords, parallelScaleChords
} from '../subCord.js'
import {store} from '../index.js'
import {masterScale} from "../subCord.js";
import * as Def from "../subCord";

//Reducerについて
//UIからdispatchで、reducer.jsの関数を実行
//関数が、return{type:**}でActionを発行
//mainReducerが全てのActionを受け取り、type毎に新しいstateを発行する

const stepNum=96

export const initialState = {
  diatonics:{
    keyNum:0,
    scale:"01_Major",
    scaleNotes:[0,2,4,5,7,9,11],
    paraScaleNotes:[0,2,3,5,7,8,10],
    flgHighChord:"1",
    chordNames:[
      "CM7","Dm7","Em7","Fm7","G7","Am7","Bm7b5"],
    chordsNotes:Array(7).fill(9),
    diatonicChords:diatonicOfScaleChords([0,2,4,5,7,9,11]),
    nonDiatonicChords:{
      "SecDominant":[],
      "SubDominantMinor":[],
      "parallelKeyChords":[],
      "substituteDominantChords":[],
    },
    testDiatonic:diatonicOfScaleChords([0,2,4,5,7,9,11]),
    paraScaleChords:[
      [3,7,10,2],
      [8,0,3,7],
      [10,2,5,8],
    ],
    inst:'aGuitar',
    //裏コード：CにおけるC#7
    touchDevice:0,

  },
  //base:Not use now
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


export const shiftScaleNote=(i,value)=>{
  let state=store.getState().stateManager
  let keyNum =state.diatonics.keyNum
  keyNum = (keyNum +value+12)%12

  //refactoring below
  /////
  //現状は、scaleを[[C3,E3,G3,A#3,[],...]に変換し、[[0,4,7,10],[],...]に変換し、
  //最後に[CM7,E7,A7,Dm7,...]を得ている。
  //　shiftScaleでは、masterとなるScaleを更新し、scale基準のdiatonicChordsが更新されるような作りにしたい
  //let diatonicChordNames = diatonicChordsNum.map(x=>checkChordName(x))
  let scaleNotes = state.diatonics.scaleNotes.map(x=>(x+12+value)%12)
  let diatonicChords = diatonicOfScaleChords(scaleNotes)
  let diatonicChordNames = diatonicChords.map(x=>checkChordName(x))

  let paraScaleNotes = state.diatonics.paraScaleNotes.map(x=>(x+12+value)%12)
  let paraScaleChords = parallelScaleChords(paraScaleNotes)
  /////
  //refactoring above

  //For loop sound player Not use now
  let list = state.base.rootNoteOfScale.slice()
  list[i] = (list[i]+value+12)%12
  //raw scale = backing track??
  let rawScaleNoteList=state.base.rawScaleNoteList.slice()
  rawScaleNoteList[i]=masterScale[state.base.typeOfScale[i]].map(x => (x+state.base.rootNoteOfScale[i]+value) % 12)

  //all scaleNames
  let majorDiatonicBaseName4 = ["M7","m7","m7","M7","7","m7","m7b5"]
  let minorDiatonicBaseName4 = ["m7","m7b5","M7","m7","m7","M7","7"]
  let harmonicMinorDiatonicBaseName4 = ["mM7","m7b5","M7(#5)","m7","7","M7","dim7"]
  let melodicMinorDiatonicBaseName4 = ["mM7","m7","M7(#5)","7","7","m7b5","m7b5"]

  let majorDiatonicChords=[]
  let minorDiatonicChords=[]
  let harmonicMinorDiatonicChords=[]
  let melodicMinorDiatonicChords=[]

  for(let [index,val] of majorDiatonicBaseName4.entries()){
    majorDiatonicChords.push  (soundNameList[(masterScale["02_Major"][index]+keyNum)%12]+majorDiatonicBaseName4[index])
    minorDiatonicChords.push(soundNameList[(masterScale["03_minor"][index]+keyNum)%12]+minorDiatonicBaseName4[index])
    harmonicMinorDiatonicChords.push(soundNameList[(masterScale["08_HarmonicMinor"][index]+keyNum)%12]+harmonicMinorDiatonicBaseName4[index])
    melodicMinorDiatonicChords.push(soundNameList[(masterScale["09_MelodicMinor"][index]+keyNum)%12]+melodicMinorDiatonicBaseName4[index])
  }

  return{
    type:'SHIFT_SCALE_NOTE',
    payload:list,
    meta:rawScaleNoteList,
    scaleNotes:scaleNotes,
    diatonicChords:diatonicChords, //[[C3,E3,G3],[D3,F3,...]...]
    diatonicNames:diatonicChordNames, //[CM7,Am7,...]　これがdrawtabに渡される
    keyNum:keyNum,//0 or 2 or etc
    paraScaleNotes:paraScaleNotes,
    paraScaleChords:paraScaleChords,
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
  //For diatonic
  let scaleNotes = baseScale[value].map(x=>(x+state.diatonics.keyNum)%12)
  let paraScaleNotes = state.diatonics.paraScaleNotes
  if(value=="01_Major"){
    paraScaleNotes=baseScale["02_minor"].map(x=>(x+state.diatonics.keyNum)%12)
  }else{
    paraScaleNotes=baseScale["01_Major"].map(x=>(x+state.diatonics.keyNum)%12)
  }
  let paraScaleChords = parallelScaleChords(paraScaleNotes)

  let scaleNoteList = baseScale[value].map(x => (x+state.base.rootNoteOfScale[i]) % 12)

  //extract valid scalestrue
  let availableScales ={}

  for(let key in masterScale){
    let eachScale=masterScale[key]
    let valid=true
    for(let eachNote of eachScale){

      if(baseScale[value].includes(eachNote)==false) {
        valid=false
      }
    }
    if(valid){
      availableScales[key]=eachScale
    }
  }

  let diatonicChords = diatonicOfScaleChords(scaleNotes)
  let diatonicChordNames = diatonicChords.map(x=>checkChordName(x))

  return {
    type: 'SET_BASE_SCALE',
    scale:value,
    payload:scaleNoteList,
    meta:availableScales,
    i:i,
    //chordList:chordList,
    diatonicChords:diatonicChords,
    diatonicNames:diatonicChordNames, //toward drawTab
    scaleNotes:scaleNotes,
    paraScaleNotes:paraScaleNotes,
    paraScaleChords:paraScaleChords,
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

export const shiftScaleType=(i)=>{
  let state = store.getState().stateManager

  //連想配列をArrayに変換
  let baseScaleArray=[]
  for(let key in baseScale){
    baseScaleArray.push([key,baseScale[key]])
  }

  let currentKeyNum=0
  let optionNum = baseScaleArray.length
  baseScaleArray.forEach((array,index)=>{
      if(array[0]==state.diatonics.scale) currentKeyNum=index
    }
  )

  let nextScaleName = baseScaleArray[(currentKeyNum+i)%optionNum][0]
  let nextScaleNotes = baseScaleArray[(currentKeyNum+i)%optionNum][1]

  return{type:'SET_DIATONIC_SCALE_TYPE',scale:nextScaleName,scaleNotes:nextScaleNotes }
}



//This is the Reudcer
export const mainReducer= (state = initialState, action) => {
  switch (action.type) {
    //mainReducerは、受け取った変数をStateに反映するだけ。
    case 'LOAD_LOCALSTORAGE':
      return{...state,base:action.base}
    case 'TOUCH_DEVICE_ON':
      return {
        ...state,
        diatonics: {...state.diatonics, touchDevice: action.touchDevice}
      }

    case 'SET_BASE_SCALE':
      return{
        ...state,
        diatonics:{...state.diatonics,scale:action.scale,chordNames:action.diatonicNames,
          chordsNotes:action.diatonicChords,scaleNotes:action.scaleNotes,paraScaleNotes:action.paraScaleNotes,paraScaleChords:action.paraScaleChords,},
        base:{...state.base,availableScales:action.meta,chordList:action.chordList,}
      }

    case 'SET_DIATONIC_SCALE_TYPE':
      console.log(action.scale)
      return{
        ...state,
      diatonics:{...state.diatonics,scale:action.scale,scaleNotes:action.scaleNotes},
      }

    case 'SET_SCALE_TYPE':
      return{...state,
        base:{...state.base,typeOfScale:action.payload,rawScaleNoteList:action.meta}}

    case 'SHIFT_SCALE_NOTE':
      return{...state,
        diatonics:{...state.diatonics,chordNames:action.diatonicNames,keyNum:action.keyNum,scaleNotes:action.scaleNotes,
          diatonicChords:action.diatonicChords,paraScaleNotes:action.paraScaleNotes,paraScaleChords:action.paraScaleChords},
        base:{...state.base,rootNoteOfScale:action.payload,rawScaleNoteList: action.meta,}}

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

    //Not use now below

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
        diatonics:{...state.diatonics,inst:action.value},
        base:{...state.base,  inst:action.value}
      }
    case 'CHANGE_DRUM':
      let bdPlan  =Def.rhythmList[action.value]["BD"]
      let sdPlan  =Def.rhythmList[action.value]["SD"]
      let hhcPlan =Def.rhythmList[action.value]["HHC"]
      return{...state,
        base:{...state.base,  drum:action.value,bdplan:bdPlan,sdPlan:sdPlan,hhcPlan: hhcPlan}
      }

    case 'BPM':
      return{...state,
        base:{...state.base,  bpm:state.base.bpm+action.value}
      }
    case 'PLAY_STOP':
      let label = state.base.isPlay ? 'Play' : 'Stop'
      return{...state,
        base:{...state.base,isPlay:!state.base.isPlay,isPlayLabel:label}
      }
    default:
      return state;
  }
}

