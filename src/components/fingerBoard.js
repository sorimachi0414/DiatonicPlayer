import React from "react";
import * as Def from "../subCord";
import {stepNum,fretNum,strings} from "../subCord"
import {changeDrum, changeInstP} from "../reducers/reducer";
import {connect} from "react-redux";

//export class FingerBoard_iso extends React.Component{
const FingerBoard_iso =(props)=>{

  //各弦の各フレットを配置
  let arrangeFingerElements=(i,j)=> {
    let stringShift
    let noteClass
    let fretLetter

    //ポジションマーク
    let positionMark = (Def.positionMarkArray[i][j]>0) ? <div className="circle" /> : ""
    let fretClass = j===0 ? "square nut" : "square"

    //各フレットを音名に変換、スケールと照合
    stringShift=Def.stringNumToShift[i]

    //各フレットを音階に変換　C=0
    let fretSound=(stringShift+j+1) % 12

    //スケール構成音の情報を整理
    let noteInfo=[0,0,0,0]//'ActiveBaseNote','ActiveNote','NextBaseNote','NextNote',
    if(props.base.rawScaleNoteList[props.base.beat1m].indexOf(fretSound)===0)  noteInfo[0]=1
    if(props.base.rawScaleNoteList[props.base.beat1m].indexOf(fretSound)>0){
      //noteInfo[1]=Def.noteColorList[fretSound]
      noteInfo[1]=1
    }
    if(props.base.rawScaleNoteList[props.base.nextBeat1m].indexOf(fretSound)===0) noteInfo[2]=1
    if(props.base.rawScaleNoteList[props.base.nextBeat1m].indexOf(fretSound)>0)   noteInfo[3]=1

    //スケール構成音に色付け
    if(noteInfo[0]>0){
      //構成音の場合
      noteClass="note noteBase"
      fretLetter="●"
    }else if(noteInfo[1]!=0){
      noteClass="note "
      noteClass+=noteInfo[1]
      fretLetter="●"
    }else if(noteInfo[2]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteBase noteNext noteTrans"
      fretLetter="○"
    }else if(noteInfo[3]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteNext noteTrans"
      fretLetter="○"
    }else{
      noteClass="note noteTrans"
    }

    //次の音に向け、ステップの半分で見た目変化を開始
    let beat4n=~~(props.base.step/(stepNum/16))
    if(beat4n % 4 >1){
      if(noteInfo[0]!=0 || noteInfo[1]!=0){
        //今Active
        if(noteInfo[2]>0){
          ;
        }else if(noteInfo[3]>0){
          ;
        }else{
          //次invalid
          if(noteInfo[0]>0){
            noteClass="note noteBase noteGone"
          }else if(noteInfo[1]!=0){
            noteClass="note noteGone"
          }
        }
      }else{
        //今invalid
        if(noteInfo[2]>0){
          noteClass="note noteBase noteNext noteSlope"
        }else if(noteInfo[3]>0){
          noteClass="note noteNext noteSlope"
        }else{
          ;
        }
      }
    }
    fretClass +=' wd-'+j

    //fretLetterを数字に変更
    if (props.base.displayCircle==false){
      let keyNote=props.base.rawScaleNoteList[props.base.beat1m][0]
      fretLetter=(fretSound-keyNote+12 )%12
    }
    return(
      <div key={'p'+i+'and'+j} className={fretClass} >
        <div key={i*100} className={noteClass}>{fretLetter}</div>
        {positionMark}
      </div>
    )
  }

  const addFretNumber=(i)=>{
    let tempClass ='squareFretNumber fs-6'
    tempClass +=' wd-'+i
    return(
      <div key={i} className={tempClass} >{i+1}</div>
    )
  }

  let eachStrings = []
  let fingerElements

  //各弦のフレットを表示
  for (let i = 0; i < strings; i++) {
    let fingerElements = []
    //１フレット毎、配列にプールしていく
    for (let j = 0; j < fretNum; j++) {
      fingerElements.push(  arrangeFingerElements(i, j)  )
    }
    eachStrings.push(fingerElements)
  }

  //フレット番号表示
  fingerElements = []
  for (let n = 0; n < fretNum; n++) {
    fingerElements.push(  addFretNumber(n) )
  }
  eachStrings.push(fingerElements)

  let allStrings=[]
  for(let i=0;i<7;i++){
    allStrings.push(  <div className="next-row">{eachStrings[i]}</div>  )
  }

  return(
    <div className="pt-4">
      {allStrings}
    </div>
  )

}

let mapStateToProps = (state) => {
  return {base: state.stateManager.base,}
}
let mapDispatchToProps=(dispatch)=>{
  return{
    changeInstP: function(value){
      return dispatch(changeInstP(value))
    },
    changeDrum:function(value){
      return dispatch(changeDrum(value))
    }
  }
}

export const FingerBoard =　connect(mapStateToProps, mapDispatchToProps)(FingerBoard_iso);