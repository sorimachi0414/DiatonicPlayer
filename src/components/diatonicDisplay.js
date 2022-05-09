import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Def from "../subCord";
import {changeDrum, changeInstP, flipHighChord} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {DropDownSelector} from './common.js'
import {chordTabList, chordTabListH,drawTab,drawSecDominant} from "../subCord";


const DiatonicDisplay = (props)=> {
  //Initialize
  let flgHighChord=0
  let diatonicUI=[]

  //flg High Chord change Buuton
  let highChordButton =
    <Col>
      <button className="btn btn-outline-primary p-0 w-100 h-100"
              value={"High Chord"} onClick={()=>props.flipHighChord()}>{"High Chord"}</button>
    </Col>

  //tenkai = inversion
  let inversionButton =
    <Col>
      <button className="btn btn-outline-primary p-0 w-100 h-100"
              value={"High Chord"} onClick={()=>props.flipHighChord()}>{"Display Inversion Chord"}</button>
    </Col>

  if(props.base.activeScale.indexOf("Major")>=0){
  diatonicUI.push(
    <Col className={"mx- 0px-0 align-self-center"}>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-info text-white"}>Tonic</Col>
        <Col xs={3} className={"py-2"}>I <img alt="icon" src={drawTab(props.base.diatonicNames[0],props.base.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>III <img alt="icon" src={drawTab(props.base.diatonicNames[2],props.base.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>VI <img alt="icon" src={drawTab(props.base.diatonicNames[5],props.base.flgHighChord)} /></Col>
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-warning text-white"}>SubDominant</Col>
        <Col xs={3} className={"py-2"}>II <img alt="icon" src={drawTab(props.base.diatonicNames[1],props.base.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>IV <img alt="icon" src={drawTab(props.base.diatonicNames[3],props.base.flgHighChord)} /></Col>
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-danger text-white"}>Dominant</Col>
        <Col xs={3} className={"py-2"}>V <img alt="icon" src={drawTab(props.base.diatonicNames[4],props.base.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>VII <img alt="icon" src={drawTab(props.base.diatonicNames[6],props.base.flgHighChord)} /></Col>
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Secondary Dominant(non-Diatonic Chords)</Col>
          {drawSecDominant(props.base.baseScaleNoteList,props.base.flgHighChord)}
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Sub Dominant Minor(non-Diatonic Chords)</Col>
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Passing Diminish Chord(non-Diatonic Chords)</Col>
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Substitute Dominant Chord</Col>
      </Row>
    </Col>
  )}  else if (props.base.activeScale.indexOf("Melodic")>=0){
    diatonicUI.push(
      <Col className={"mx- 0px-0 align-self-center"}>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-info text-white"}>Tonic Minor</Col>
          <Col xs={3} className={"py-2"}>I <img alt="icon" src={drawTab(props.base.diatonicNames[0],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>III <img alt="icon" src={drawTab(props.base.diatonicNames[2],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>VI <img alt="icon" src={drawTab(props.base.diatonicNames[5],props.base.flgHighChord)} /></Col>

        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-warning text-white"}>SubDominant Minor</Col>
          <Col xs={3} className={"py-2"}>II <img alt="icon" src={drawTab(props.base.diatonicNames[1],props.base.flgHighChord)} /></Col>


        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-danger text-white"}>Dominant Minor</Col>
          <Col xs={3} className={"py-2"}>IV <img alt="icon" src={drawTab(props.base.diatonicNames[3],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>V <img alt="icon" src={drawTab(props.base.diatonicNames[4],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>VII <img alt="icon" src={drawTab(props.base.diatonicNames[6],props.base.flgHighChord)} /></Col>

        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Secondary Dominant(non-Diatonic Chords)</Col>
          {drawSecDominant(props.base.baseScaleNoteList,props.base.flgHighChord)}
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Sub Dominant Minor(non-Diatonic Chords)</Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Passing Diminish Chord(non-Diatonic Chords)</Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Substitute Dominant Chord</Col>
        </Row>
      </Col>
    )
  } else if (props.base.activeScale.indexOf("minor")>=0){
    diatonicUI.push(
      <Col className={"mx- 0px-0 align-self-center"}>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-info text-white"}>Tonic Minor</Col>
          <Col xs={3} className={"py-2"}>I <img alt="icon" src={drawTab(props.base.diatonicNames[0],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>III <img alt="icon" src={drawTab(props.base.diatonicNames[2],props.base.flgHighChord)} /></Col>

        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-warning text-white"}>SubDominant Minor</Col>
          <Col xs={3} className={"py-2"}>II <img alt="icon" src={drawTab(props.base.diatonicNames[1],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>IV <img alt="icon" src={drawTab(props.base.diatonicNames[3],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>VI <img alt="icon" src={drawTab(props.base.diatonicNames[5],props.base.flgHighChord)} /></Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-danger text-white"}>Dominant Minor</Col>
          <Col xs={3} className={"py-2"}>V <img alt="icon" src={drawTab(props.base.diatonicNames[4],props.base.flgHighChord)} /></Col>
          <Col xs={3} className={"py-2"}>VII <img alt="icon" src={drawTab(props.base.diatonicNames[6],props.base.flgHighChord)} /></Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Secondary Dominant(non-Diatonic Chords)</Col>
          {drawSecDominant(props.base.baseScaleNoteList,props.base.flgHighChord)}
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Sub Dominant Minor(non-Diatonic Chords)</Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Passing Diminish Chord(non-Diatonic Chords)</Col>
        </Row>
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Substitute Dominant Chord</Col>
        </Row>
      </Col>
    )
  }

  return(
    <Row className="card-body pt-1">
      <Col>
        <Row>
          {diatonicUI}
        </Row>
        <Row>
          {highChordButton}
          {inversionButton}
          {/*Secondary Dominant*/}
        </Row>

      </Col>
    </Row>
  )
}

let mapStateToProps = (state) => {
  return {base: state.stateManager.base,}
}
let mapDispatchToProps=(dispatch)=>{
  return{
    // changeInstP: function(value){
    //   return dispatch(changeInstP(value))
    // },
    // changeDrum:function(value){
    //   return dispatch(changeDrum(value))
    // },
    flipHighChord:function(){
      return dispatch(flipHighChord())
    }
  }
}

export const DiatonicDisplay_func =　connect(mapStateToProps, mapDispatchToProps)(DiatonicDisplay);