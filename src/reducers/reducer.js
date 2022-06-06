
import{parallelScaleChords,baseScale,masterScale}from"../musicDefinition"
import {buffers, store} from '../index.js'
import {
  checkChordName,
  soundNameList, diatonicOfScaleChords, instList
} from '../subCord.js'

//Reducerについて
//UIからdispatchで、reducer.jsの関数を実行
//関数が、return{type:**}でActionを発行
//mainReducerが全てのActionを受け取り、type毎に新しいstateを発行する

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
    inst:'piano',
    //裏コード：CにおけるC#7
    //touchDevice:0,
    audioLoadCount: 0,
    loadComplete:false,


  },
}

export const shiftScaleNote=(i,value)=>{
  let state=store.getState().stateManager
  let keyNum =state.diatonics.keyNum
  keyNum = (keyNum +value+12)%12

  //refactoring below
  //現状は、scaleを[[C3,E3,G3,A#3,[],...]に変換し、[[0,4,7,10],[],...]に変換し、
  //最後に[CM7,E7,A7,Dm7,...]を得ている。
  //　shiftScaleでは、masterとなるScaleを更新し、scale基準のdiatonicChordsが更新されるような作りにしたい
  //let diatonicChordNames = diatonicChordsNum.map(x=>checkChordName(x))
  let scaleNotes = state.diatonics.scaleNotes.map(x=>(x+12+value)%12)
  let diatonicChords = diatonicOfScaleChords(scaleNotes)
  let diatonicChordNames = diatonicChords.map(x=>checkChordName(x))

  let paraScaleNotes = state.diatonics.paraScaleNotes.map(x=>(x+12+value)%12)
  let paraScaleChords = parallelScaleChords(paraScaleNotes)
  //refactoring above

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
    scaleNotes:scaleNotes,
    diatonicChords:diatonicChords, //[[C3,E3,G3],[D3,F3,...]...]
    diatonicNames:diatonicChordNames, //[CM7,Am7,...]　これがdrawtabに渡される
    keyNum:keyNum,//0 or 2 or etc
    paraScaleNotes:paraScaleNotes,
    paraScaleChords:paraScaleChords,
  }
}


export const changeInstP=(value)=>{
  return{ type:'CHANGE_INST',value  }
}

export const flipHighChord=(value)=>{
  return {type:'FLIP_HIGH_CHORD',value}
}

export const setBaseScale=(i,value)=> {
  //TODO:triad change is not work
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
    meta:availableScales,
    i:i,
    diatonicChords:diatonicChords,
    diatonicNames:diatonicChordNames, //toward drawTab
    scaleNotes:scaleNotes,
    paraScaleNotes:paraScaleNotes,
    paraScaleChords:paraScaleChords,
  }
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

    case 'TONEJS_LOADED':
      let count = state.diatonics.audioLoadCount +1
      let loadComplete = Object.keys(instList).length<=count?true:false
      return{
        ...state,
        diatonics:{...state.diatonics,audioLoadCount:count,loadComplete:loadComplete}
      }

    case 'SET_BASE_SCALE':
      return{
        ...state,
        diatonics:{...state.diatonics,scale:action.scale,chordNames:action.diatonicNames,
          diatonicChords:action.diatonicChords,scaleNotes:action.scaleNotes,paraScaleNotes:action.paraScaleNotes,paraScaleChords:action.paraScaleChords,},
      }

    case 'SET_DIATONIC_SCALE_TYPE':
      console.log(action.scale)
      return{
        ...state,
      diatonics:{...state.diatonics,scale:action.scale,scaleNotes:action.scaleNotes},
      }

    case 'SET_SCALE_TYPE':
      return{...state,
      }

    case 'SHIFT_SCALE_NOTE':
      return{...state,
        diatonics:{...state.diatonics,chordNames:action.diatonicNames,keyNum:action.keyNum,scaleNotes:action.scaleNotes,
          diatonicChords:action.diatonicChords,paraScaleNotes:action.paraScaleNotes,paraScaleChords:action.paraScaleChords},
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
      }

    case 'CHANGE_INST':
      return{...state,
        diatonics:{...state.diatonics,inst:action.value},
      }

    default:
      return state;
  }
}

