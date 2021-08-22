import Col from "react-bootstrap/Col";
import {setScaleType, shiftScaleNote} from "../reducers/reducer";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";
import React from "react";
import {ThreeButtonChanger,ListedSelector} from "./common";
import {soundNameList,masterScale,fretNum} from "../subCord"
import {FingerBoard} from './fingerBoard.js'

const ScaleSelectorRedux =(props) => {

  function scaleProcessor(key,type){
    return masterScale[type].map(x => (x+key) % 12)
  }

  const repeatSelector=(i)=>{
    return(
      <Col key={i} xs={3}>
        <ThreeButtonChanger
          class={"scaleNoteSelector"}
          color={'btn btn-outline-primary w-100'}
          color={props.base.blocksColor[i]}
          value={soundNameList[props.base.rootNoteOfScale[i]]}
          onClickP={() => props.shiftScaleNote(i,1)}
          onClickN={() => props.shiftScaleNote(i,-1)}
        />
        <ListedSelector
          chordOrScale={'Scale'}
          initList={props.base.typeOfScale[i]}
          optionList={masterScale}
          class={"scaleTypeSelector"}
          boxNum={i}
          value={props.base.typeOfScale[i]}
          //value={masterScale[props.base.typeOfScale[i]]}
          onChange={(i,value) => props.setScaleType(i,value)}
          //readStorage={this.changeScaleFromStorage}
        />
      </Col>
    )
  }

  let selectors=[]
  const selectorLength=4
  for(let i=0;i<selectorLength;i++){
    selectors.push(
      repeatSelector(i)
    )
  }

  return(
    <Row>
      {selectors}
      <FingerBoard  />
      <Col xs={12} sm={6}>
        <button
          className="btn btn-outline-success"
          onClick={()=>props.flipSymbol()}
        >
          change Circle to Number
        </button>
      </Col>
      <Col xs={12} sm={6}>
        <button
          className="btn btn-outline-warning"
          onClick={'()=>localStorage.clear()'}
        >
          Reset save data
        </button>
      </Col>
    </Row>
  )

}

const mapStateToProps = (state) => {
  return {base: state.stateManager.base,}
}
const mapDispatchToProps=(dispatch)=>{
  return{
    shiftScaleNote:function (i,value){
      return dispatch(shiftScaleNote(i,value))
    },
    setScaleType: function (i,value){
      return dispatch(setScaleType(i,value))
    },
    flipSymbol:function(){
      return dispatch({type:'FLIP_SYMBOL'})
    }
  }
}
export const ScaleSelectorRedux_func =　connect(mapStateToProps, mapDispatchToProps)(ScaleSelectorRedux);
