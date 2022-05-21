import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Def from "../subCord";
import {changeDrum, changeInstP, flipHighChord} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {DropDownSelector} from './common.js'
import {chordTabList, chordTabListH, drawTab, drawSecDominant, soundNameList} from "../subCord";


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

  //view template
  let templDiatonic =(args)=>{
    //args = ["Tonic",[["I",0],["III",2],["VI",5]]],...
    let templBlock =(args) =>{
      //args = [I,0],[III,2],...
      let res = []
      for(let arg of args){
        //arg[1] likes 0,etc
        res.push(
          <Col xs={3} className={"py-2"}>{arg[0]} <img alt="icon" src={drawTab(props.diatonics.chordNames[arg[1]],props.diatonics.flgHighChord)} /></Col>
        )
      }
      return res
    }
    let code=[]

    let subDominantMinorRoot = soundNameList[(props.diatonics.keyNum+5)%12]
    let subDominantMinorName = subDominantMinorRoot+"m7"
    let subDominantMinorCode =""
    if(props.diatonics.scale.indexOf("Major")>=0){
      subDominantMinorCode = <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Sub Dominant Minor(non-Diatonic Chords)</Col>
        <Col xs={3} className={"py-2"}>
          <img alt="icon" src={drawTab(subDominantMinorName,props.diatonics.flgHighChord)} />
        </Col>

      </Row>
    }

    let parallelKeyChords = 0//TM,DM,SDM

    code.push(
      <Col className={"mx- 0px-0 align-self-center"}>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-info text-white"}>{args[0][0]}</Col>
        {templBlock(args[0][1])}
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-warning text-white"}>{args[1][0]}</Col>
        {templBlock(args[1][1])}
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-danger text-white"}>{args[2][0]}</Col>
        {templBlock(args[2][1])}
      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>
          Secondary Dominant(non-Diatonic Chords)
        </Col>
        <Col>
          <Row>
            <Col xs={4} className={"bg-info text-white"}>Secondary dominants</Col>
            <Col xs={8} className={"bg-warning text-white"}>Diminsh Chords</Col>
          </Row>
          { drawSecDominant(props.diatonics.scaleNotes,props.diatonics.flgHighChord)}
        </Col>
      </Row>
        {subDominantMinorCode}
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Pallarel key chords(non-Diatonic Chords)</Col>
        <Col xs={3} className={"py-2"}>{0} <img alt="icon" src={drawTab("D#7",props.diatonics.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>{0} <img alt="icon" src={drawTab("G#7",props.diatonics.flgHighChord)} /></Col>
        <Col xs={3} className={"py-2"}>{0} <img alt="icon" src={drawTab("A#7",props.diatonics.flgHighChord)} /></Col>

      </Row>
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Substitute Dominant Chord</Col>
      </Row>
    </Col>
    )

    return code
  }

  let diatonicStructures
  if(props.diatonics.scale.indexOf("Major")>=0){
    diatonicStructures = [
      ["Tonic",[["I",0],["III",2],["VI",5]]],
      ["SubDominant",[["II",1],["IV",3],]],
      ["Dominant",[["V",4],["VII",6],]],
    ]
  }  else if (props.diatonics.scale.indexOf("Melodic")>=0){
    diatonicStructures = [
      ["Tonic Minor",[["I",0],["III",2],["VI",5]]],
      ["SubDominant Minor",[["II",1],]],
      ["Dominant Minor",[["IV",3],["V",4],["VII",6],]],
    ]
  } else if (props.diatonics.scale.indexOf("minor")>=0){
    diatonicStructures = [
      ["Tonic Minor",[["I",0],["III",2],]],
      ["SubDominant Minor",[["II",1],["IV",3],["VI",5]]],
      ["Dominant Minor",[["V",4],["VII",6],]],
    ]
  }

  diatonicUI.push(templDiatonic(diatonicStructures))

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
  return {
    diatonics:state.stateManager.diatonics,
  }
}
let mapDispatchToProps=(dispatch)=>{
  return{
    flipHighChord:function(){
      return dispatch(flipHighChord())
    }
  }
}

export const DiatonicDisplay_func =　connect(mapStateToProps, mapDispatchToProps)(DiatonicDisplay);