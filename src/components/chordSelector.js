import * as Def from "../subCord";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {playStopType} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {store} from "../index";
import {ListedSelector} from "./common"
import {ChordChopperCheckBox,ThreeButtonChanger} from "./common.js";

const soundNameList=Def.soundNameList
const masterChord=Def.masterChord

const ChordSelectorRedux =(props)=>{


  function changeChord(i,val) {
    let rootShift,chordNotes,actionType,list,chordList
    if (typeof val == 'number') {
      list = props.base.rootNoteOfChords.slice()
      list[i] = (list[i] + 12 + val) % 12

      actionType='CHANGE_ROOT_NOTES'
      chordNotes = masterChord[props.base.typesOfChords[i]]
      rootShift=list[i]
    } else if (typeof val == 'string') {
      list = props.base.typesOfChords.slice()
      list[i]=val

      actionType='SET_CHORD_TYPE'
      chordNotes=masterChord[val]
      rootShift = props.base.rootNoteOfChords[i]
    }
    chordList=props.base.chordList.slice()
    let chordTonesShifted=chordNotes.map(x => (x+rootShift) %12)

    chordList[i]=chordTonesShifted.map(x =>soundNameList[x]+'3')
    chordList[i].push(soundNameList[rootShift]+'2')

    store.dispatch({type:actionType,value:list,chordList:chordList})
  }

  function changeChordChopper(note,bar){
    let chordPlan=props.base.chordPlan.slice() //16cel
    let oneBar = chordPlan[bar].slice() //4cel

    //1小節毎に処理
    let status =oneBar[note+bar*4] //今の値
    oneBar[note+bar*4]= (status==0)?'4n':0  //クリックした値を更新

    let oneBarThis = oneBar.slice(0+bar*4,4+bar*4)
    //コードを鳴らす長さを調整
    function arrayToByte(list){
      let byte=0
      for(let i in list){
        byte = (list[i]!=0) ? byte+2**(3-i):byte
      }
      return byte
    }

    //oneBarを置換
    oneBar.splice(0+bar*4,4,...Def.chordChopLength[arrayToByte(oneBarThis)])

    chordPlan[bar] = oneBar
    store.dispatch({type:'SET_CHORD_PLAN',value:chordPlan})
  }

  function arrangeChordSelector(i){
    let check0=(props.base.chordPlan[i][i*4]!=0)?'checked':''
    let check1=(props.base.chordPlan[i][1+i*4]!=0)?'checked':''
    let check2=(props.base.chordPlan[i][2+i*4]!=0)?'checked':''
    let check3=(props.base.chordPlan[i][3+i*4]!=0)?'checked':''

    return (
      <Col xs={3} key={i}>
        <Row>
          <Col xs={12}  className="mx-0 px-0">
            <ChordChopperCheckBox
              key={'CC1c'+i}
              type="checkbox"
              checked={check0}
              onClick={()=>changeChordChopper(0,i)}
              value={props.base.chordPlan[i][i*4]}
            />
            <ChordChopperCheckBox
              key={'CC2c'+i}
              type="checkbox"
              checked={check1}
              onClick={()=>changeChordChopper(1,i)}
              value={props.base.chordPlan[i][1+i*4]}
            />
            <ChordChopperCheckBox
              key={'CC3c'+i}
              type="checkbox"
              checked={check2}
              onClick={()=>changeChordChopper(2,i)}
              value={props.base.chordPlan[i][2+i*4]}
            />
            <ChordChopperCheckBox
              key={'CC4c'+i}
              type="checkbox"
              checked={check3}
              onClick={()=>changeChordChopper(3,i)}
              value={props.base.chordPlan[i][3+i*4]}
            />
          </Col>
          <Col xs={12} sm={12}>
            <ThreeButtonChanger
              key={'cns'+i}
              color={props.base.blocksColor[i]}
              value={soundNameList[props.base.rootNoteOfChords[i]]}
              onClick={() => changeChord(i,1)}
              onClickP={() => changeChord(i,1)}
              onClickN={() => changeChord(i,-1)}
            />
            <ListedSelector
              chordOrScale={'Chord'}
              key={'cts'+i}
              initList={props.base.typesOfChords[i]}
              optionList={masterChord}
              class={"scaleTypeSelector"}
              boxNum={i}
              //value={masterChord[props.base.typesOfChords[i]]}
              value={props.base.typesOfChords[i]}
              onChange={(i,e) => changeChord(i,String(e))}
            />
          </Col>
        </Row>
      </Col>
    );
  }

  let chordSelectors=[]
  const blockLength=4
  for(let i=0;i<blockLength;i++){
    chordSelectors.push(
      arrangeChordSelector(i)
    )
  }

  return(
    <Row className='card-body pt-1'>
      {chordSelectors}
    </Row>
  )
}

let mapStateToProps = (state) => {
  return {  base: state.stateManager.base }
};

let mapDispatchToProps = (dispatch) => {
  return {
    playStopDispatch: function(){
      return dispatch(playStopType())
    },
  };
};
export const ChordSelectorRedux_func=　connect(mapStateToProps, mapDispatchToProps)(ChordSelectorRedux);
