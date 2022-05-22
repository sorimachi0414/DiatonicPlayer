import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Def from "../subCord";
import {changeDrum, changeInstP, flipHighChord} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {DropDownSelector} from './common.js'
import {
  chordTabList,
  chordTabListH,
  drawTab,
  drawSecDominant,
  soundNameList,
  instList,
  subDominantMinorChord,
  secDominantMinorChords,
  secDominantHarmonicMinorChords,
  secDominantMelodicMinorChords,
  secDominantMajorChords,
  passingDimToSecDominantChords, notesToTonejsChord, checkChordName
} from "../subCord";


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

  //Diatonic Block template
  let diatonicViewBlock =(args)=>{
    //args = ["Tonic",[["I",0],["III",2],["VI",5]]],...
    let templBlock =(args) =>{
      //args = [I,0],[III,2],...
      let res = []
      args.forEach((arg)=>{
        //arg[1] likes 0,etc
        let triadChord = [...props.diatonics.diatonicChords[arg[1]]]
        triadChord.pop()
        console.log("triadChord",triadChord)
        let triadChordName = checkChordName(triadChord)
        console.log(triadChordName)
        res.push(
          <>
            <Col xs={3} className={"py-2"}>
              {arg[0]} <img alt="icon" src={drawTab(props.diatonics.chordNames[arg[1]],props.diatonics.flgHighChord)}
                        onClick={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(props.diatonics.diatonicChords[arg[1]]), "2n")}
            />
            </Col>
          <Col xs={3} className={"py-2"}>
            {arg[0]} <img alt="icon" src={drawTab(triadChordName,props.diatonics.flgHighChord)}
                          onClick={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(triadChord), "2n")}
          />
          </Col>
          </>
        )
      })

      return res
    }

    //Sec Dominant Block
    let secDominantChords
    if(props.diatonics.scale.indexOf("Major")>=0){
      secDominantChords = secDominantMajorChords(props.diatonics.keyNum)
    }else if(props.diatonics.scale.indexOf("Harmonic")>=0){
      secDominantChords = secDominantHarmonicMinorChords(props.diatonics.keyNum)
    }else if(props.diatonics.scale.indexOf("Melodic")>=0){
      secDominantChords = secDominantMelodicMinorChords(props.diatonics.keyNum)
    }else{
      secDominantChords = secDominantMinorChords(props.diatonics.keyNum)
    }

    let diminishChords = passingDimToSecDominantChords(secDominantChords)


    let secDominantDiminishBlock =[]

    for(let index=0;index<secDominantChords.length;index++){
      let tempTonic = soundNameList[(secDominantChords[index][0] +5)%12]
      secDominantDiminishBlock.push(
        <Row>
          <Col xs={4} className={"py-2 bg-success"}>
            <img alt="icon" src={drawTab(secDominantChords[index],1,"( => "+tempTonic+")")} />
          </Col>
          {diminishChords[index].map(x=>
            <Col xs={2} className={"py-2"}>
              <img alt="icon" src={drawTab(x,1,)} />
            </Col>
          )}
        </Row>
      )

    }

    //Sub Dominant Minor Block
    let subDominantMinorCode =""
    if(props.diatonics.scale.indexOf("Major")>=0){
      subDominantMinorCode =
        <Row className={"my-2"}>
          <Col xs={12} className={"bg-success text-white"}>Sub Dominant Minor(non-Diatonic Chords)</Col>
          <Col xs={3} className={"py-2"}>
            <img alt="icon" src={drawTab(subDominantMinorChord(props.diatonics.keyNum),props.diatonics.flgHighChord)} />
          </Col>
        </Row>
    }

    //parallel chords
    let paraChordsBlock =[]
    for(let x of[0,1,2]){
      paraChordsBlock.push(
        <Col xs={3} className={"py-2"}>{} <img alt="icon" src={drawTab(props.diatonics.paraScaleChords[x],props.diatonics.flgHighChord)} /></Col>
      )
    }

    let code=[]
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
            <Col xs={8} className={"bg-secondary text-white"}>Diminsh Chords</Col>
          </Row>
          {secDominantDiminishBlock}
          {/* drawSecDominant(props.diatonics.scaleNotes,props.diatonics.flgHighChord)*/}
        </Col>
      </Row>
        {subDominantMinorCode}
      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>Parallel key chords(non-Diatonic Chords)</Col>
        {paraChordsBlock}
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

  diatonicUI.push(diatonicViewBlock(diatonicStructures))

  //Return Block
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