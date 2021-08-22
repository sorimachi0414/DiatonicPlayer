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
          value={soundNameList[props.base.selectedScaleNoteList[i]]}
          onClickP={() => shiftScaleNote(i,1)}
          onClickN={() => shiftScaleNote(i,-1)}
        />
        <ListedSelector
          chordOrScale={'Scale'}
          initList={Array(4).fill("04_minorPentatonic")}
          optionList={masterScale}
          class={"scaleTypeSelector"}
          boxNum={i}
          //value={scaleTypeNameList[this.state.selectedScaleTypeList[i]]}
          value={masterScale[props.base.selectedScaleTypeList[i]]}
          onChange={(i,e) => setScaleType(i,e)}
          //readStorage={this.changeScaleFromStorage}
        />
      </Col>
    )
  }

  let beat1m=props.base.beat1m
  let nextBeat1m=(beat1m>=3) ? 0 : beat1m+1

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
      <FingerBoard
        //fretNum={fretNum}
        //step={props.base.step}
        //nowScale={scaleProcessor(props.base.selectedScaleNoteList[beat1m],props.base.selectedScaleTypeList[beat1m])}
        //nextScale={scaleProcessor(props.base.selectedScaleNoteList[nextBeat1m],props.base.selectedScaleTypeList[nextBeat1m])}
        //displayCircle={props.base.displayCircle}
      />
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
