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
    let eachFunctionChordsBlock =(args,title="",color="") =>{
      //args = [I,0],[III,2],...
      let fundamentalDiatonics = []
      args.forEach((arg)=>{
        //arg[1] likes 0,etc
        let triadChord = [...props.diatonics.diatonicChords[arg[1]]]
        triadChord.pop()
        let triadChordName = checkChordName(triadChord)

        fundamentalDiatonics.push(
          <Col xs={4} sm={3} className={"py-2 px-3"}>
            <Row className={"pb-2 border rounded"}>
              <Col xs={8} md={8} className={color+" text-white px-1 text-truncate"}>
                {title}
              </Col>
              <Col xs={4} md={4}>
                {arg[0]}
              </Col>

              <Col xs={12} className={"py-2"}>
                <img alt="icon" className="img-fluid d-block mx-auto"
                    src={drawTab(props.diatonics.chordNames[arg[1]],props.diatonics.flgHighChord)}
                     onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(props.diatonics.diatonicChords[arg[1]]), "2n")}
                />
              </Col>
              <Col xs={12} className={"py-2"}>
                <img alt="icon"  className="img-fluid d-block mx-auto"
                   src={drawTab(triadChordName,props.diatonics.flgHighChord)}
                     onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(triadChord), "2n")}
                />
              </Col>
            </Row>
          </Col>
        )
      })

      return fundamentalDiatonics
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
        <Row className={"border"}>
          <Col xs={4} sm={3}>
            <Row>
              <Col className={"py-2"}>
                <img alt="icon"  className="img-fluid d-block mx-auto"
                     src={drawTab(secDominantChords[index],1,"( => "+tempTonic+")")}
                     onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(secDominantChords[index]), "2n")}
                />

              </Col>
            </Row>
          </Col>

          <Col><Row>

            {diminishChords[index].map(x=>
              <Col xs={6} sm={3} md={3} className={"py-2"}>
                <img alt="icon"  className="img-fluid d-block mx-auto"
                     src={drawTab(x,1,)}
                     onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(x), "2n")}
                />
              </Col>
            )
            }
          </Row></Col>
        </Row>
      )

    }

    //Sub Dominant Minor Block
    let subDominantMinorCode =""
    if(props.diatonics.scale.indexOf("Major")>=0){
      subDominantMinorCode =
        <Col xs={4} sm={3} className={"py-2 px-3"}>
          <Row className={"pb-2 border rounded"}>
            <Col xs={8} className={"bg-success"+" text-white px-1 text-truncate"}>
              {"SD Minor (non-Diat.)"}
            </Col>
            <Col xs={4}>
              {"IV"}
            </Col>
            <Col xs={12} className={"py-2"}>
              <img alt="icon"  className="img-fluid d-block mx-auto"
                   src={drawTab(subDominantMinorChord(props.diatonics.keyNum),props.diatonics.flgHighChord)}
                   onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(subDominantMinorChord(props.diatonics.keyNum)), "2n")}
              />
            </Col>
          </Row>
        </Col>
    }

    //parallel chords
    let paraChordsBlock =[]
    for(let x of[0,1,2]){
      paraChordsBlock.push(
        <Col xs={4} sm={3} className={"py-2 px-3"}>
          <Row className={"pb-2 border rounded"}>
            <Col xs={8} className={"bg-success"+" text-white px-1 text-truncate"}>
              {"Parallel Key(non-Diat.)"}
            </Col>
            <Col xs={4}>
              {Array("III","VI","VII")[x]}
            </Col>
            <Col xs={12} className={"py-2"}>
              <img alt="icon"  className="img-fluid d-block mx-auto"
                   src={drawTab(props.diatonics.paraScaleChords[x],props.diatonics.flgHighChord)}
                   onMouseDown={()=>instList['aGuitar'].triggerAttackRelease(notesToTonejsChord(props.diatonics.paraScaleChords[x]), "2n")}
              />
            </Col>
          </Row>
        </Col>
      )
    }

    let diatonicViewCode=[]
    diatonicViewCode.push(
      <Col className={"mx- 0px-0 align-self-center"}>
      <Row className={"my-2"}>
        {eachFunctionChordsBlock(args[0][1],args[0][0],"bg-info")}

        {eachFunctionChordsBlock(args[1][1],args[1][0],"bg-warning")}

        {eachFunctionChordsBlock(args[2][1],args[2][0],"bg-danger")}
        {subDominantMinorCode}
        {paraChordsBlock}
      </Row>

      <Row className={"my-2"}>
        <Col xs={12} className={"bg-success text-white"}>
          Secondary Dominant(non-Diatonic Chords)
        </Col>
        <Col className={"border py-2 px-4"}>
          <Row>
            <Col xs={2} sm={3} className={"bg-info text-white text-truncate"}>2ndary Dominants</Col>

            <Col xs={10} sm={9} className={"bg-secondary text-white text-truncate"}>Diminsh Chords</Col>
          </Row>
          {secDominantDiminishBlock}
        </Col>
      </Row>

    </Col>
    )

    return diatonicViewCode
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

  //History Block


  //Return Block
  return(

      <Col>
        <Row className={""}>
          {diatonicViewBlock(diatonicStructures)}
        </Row>
        <Row>
          <Col xs={12} className={"bg-info"}>
            History
          </Col>
          <Col xs={3}>I</Col>
          <Col xs={3}>II</Col>
          <Col xs={3}>III</Col>
          <Col xs={3}>IV</Col>
        </Row>
        <Row>
          {highChordButton}
          {inversionButton}
          {/*Secondary Dominant*/}
        </Row>

      </Col>

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