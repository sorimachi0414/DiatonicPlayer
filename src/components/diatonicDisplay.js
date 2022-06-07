import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { flipHighChord} from "../reducers/reducer";
import {connect} from "react-redux";
import React, {createRef, useEffect, useRef} from "react";

import{
  subDominantMinorChord,
  secDominantMinorChords,
  secDominantHarmonicMinorChords,
  secDominantMelodicMinorChords,
  secDominantMajorChords,
} from "../musicDefinition"
import {
  drawTab,
  soundNameList,
  instList,
  passingDimToSecDominantChords, notesToTonejsChord, checkChordName
} from "../subCord";

export const GuitarTab = (props) => {

  let onTouchStart = (event) => {
    instList[props.inst].triggerAttackRelease(props.sound,"2n")
    event.preventDefault()
  }
  let onMouseDown = (event) => {
    instList[props.inst].triggerAttackRelease(props.sound,"2n")
    console.log(props.sound)
    event.preventDefault()
  }
  const ref = useRef(null);

  useEffect(() => {
    if(props.loadGood){
      ref.current?.addEventListener("touchstart", onTouchStart, {passive: false})
      ref.current?.addEventListener("mousedown", onMouseDown, {passive: false})
      return (() => {
        ref.current?.removeEventListener("touchstart", onTouchStart)
        ref.current?.removeEventListener("mousedown", onMouseDown)
      }
    )
    }

  })

  return (
    <img alt="icon" className="img-fluid d-block mx-auto"
         src={drawTab(props.tab, props.flgHighChord,props.com)}
         ref={ref}
    />
  )
}

const DiatonicDisplay = (props) => {
  //flg High Chord change Buuton
  let highChordButton =
    <Col>
      <button className="btn btn-outline-primary p-0 w-100 h-100"
              value={"High Chord"} onClick={() => props.flipHighChord()}>{"High Chord"}</button>
    </Col>

  //TODO:Inversion(tenkai) cord.
  let inversionButton =
    <Col>
      <button className="btn btn-outline-primary p-0 w-100 h-100"
              value={"High Chord"} onClick={() => props.flipHighChord()}>{"Display Inversion Chord"}</button>
    </Col>

  //Diatonic Block template
  let diatonicViewBlock = (diatonicOrder) => {
    //diatonicOrder = ["Tonic",[["I",0],["III",2],["VI",5]]],...
    let eachFunctionChordsBlock = (orders, title = "", color = "") => {
      //orders = [I,0],[III,2],...
      let fundamentalDiatonics = []
      orders.forEach(([degreeRoma, degreeArabic]) => {
        //orders[1] likes 0,etc
        let triadChord = [...props.diatonics.diatonicChords[degreeArabic]] //popで破壊されるので値渡し
        triadChord.pop()
        let triadChordName = checkChordName(triadChord)

        fundamentalDiatonics.push(
          <Col xs={4} sm={3} className={"py-2 px-3"}>
            <Row className={"pb-2 border rounded"}>
              <Col xs={8} md={8} className={color + " text-white px-1 text-truncate"}>
                {title}
              </Col>
              <Col xs={4} md={4}>
                {degreeRoma}
              </Col>

              <Col xs={12} className={"py-2"}>
                <GuitarTab
                  tab={props.diatonics.chordNames[degreeArabic]}
                  flgHighChord={props.diatonics.flgHighChord}
                  sound={notesToTonejsChord(props.diatonics.diatonicChords[degreeArabic])}
                  inst={props.diatonics.inst}
                  loadGood={props.diatonics.loadComplete}
                  />
              </Col>
              <Col xs={12} className={"py-2"}>
                <GuitarTab
                  tab={triadChordName}
                  flgHighChord={props.diatonics.flgHighChord}
                  sound={notesToTonejsChord(triadChord)}
                  inst={props.diatonics.inst}
                  loadGood={props.diatonics.loadComplete}

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
    if (props.diatonics.scale.indexOf("Major") >= 0) {
      secDominantChords = secDominantMajorChords(props.diatonics.keyNum)
    } else if (props.diatonics.scale.indexOf("Harmonic") >= 0) {
      secDominantChords = secDominantHarmonicMinorChords(props.diatonics.keyNum)
    } else if (props.diatonics.scale.indexOf("Melodic") >= 0) {
      secDominantChords = secDominantMelodicMinorChords(props.diatonics.keyNum)
    } else {
      secDominantChords = secDominantMinorChords(props.diatonics.keyNum)
    }

    let diminishChords = passingDimToSecDominantChords(secDominantChords)

    let secDominantDiminishBlock = []

    for (let index = 0; index < secDominantChords.length; index++) {
      let tempTonic = soundNameList[(secDominantChords[index][0] + 5) % 12]
      secDominantDiminishBlock.push(
        <Row className={"border"}>
          <Col xs={4} sm={3}>
            <Row>
              <Col className={"py-2"}>
                <GuitarTab
                  tab={secDominantChords[index]}
                  com={"( => " + tempTonic + ")"}
                  flgHighChord={props.diatonics.flgHighChord}
                  sound={notesToTonejsChord(secDominantChords[index])}
                  inst={props.diatonics.inst}
                  loadGood={props.diatonics.loadComplete}

                />
              </Col>
            </Row>
          </Col>

          <Col><Row>

            {diminishChords[index].map(x =>
              <Col xs={6} sm={3} md={3} className={"py-2"}>
                <GuitarTab
                  tab={x}
                  flgHighChord={props.diatonics.flgHighChord}
                  sound={notesToTonejsChord(x)}
                  inst={props.diatonics.inst}
                  loadGood={props.diatonics.loadComplete}

                />
              </Col>
            )
            }
          </Row></Col>
        </Row>
      )

    }

    //Sub Dominant Minor Block
    let subDominantMinorCode = ""
    if (props.diatonics.scale.indexOf("Major") >= 0) {
      subDominantMinorCode =
        <Col xs={4} sm={3} className={"py-2 px-3"}>
          <Row className={"pb-2 border rounded"}>
            <Col xs={8} className={"bg-success" + " text-white px-1 text-truncate"}>
              {"SD Minor (non-Diat.)"}
            </Col>
            <Col xs={4}>
              {"IV"}
            </Col>
            <Col xs={12} className={"py-2"}>
              <GuitarTab
                tab={subDominantMinorChord(props.diatonics.keyNum)}
                flgHighChord={props.diatonics.flgHighChord}
                sound={notesToTonejsChord(subDominantMinorChord(props.diatonics.keyNum))}
                inst={props.diatonics.inst}
                loadGood={props.diatonics.loadComplete}

              />
            </Col>
          </Row>
        </Col>
    }

    //parallel chords
    let paraChordsBlock = []
    for (let x of [0, 1, 2]) {
      paraChordsBlock.push(
        <Col xs={4} sm={3} className={"py-2 px-3"}>
          <Row className={"pb-2 border rounded"}>
            <Col xs={8} className={"bg-success" + " text-white px-1 text-truncate"}>
              {"Parallel Key(non-Diat.)"}
            </Col>
            <Col xs={4}>
              {Array("III", "VI", "VII")[x]}
            </Col>
            <Col xs={12} className={"py-2"}>
              <GuitarTab
                tab={props.diatonics.paraScaleChords[x]}
                flgHighChord={props.diatonics.flgHighChord}
                sound={notesToTonejsChord(props.diatonics.paraScaleChords[x])}
                inst={props.diatonics.inst}
                loadGood={props.diatonics.loadComplete}

              />
            </Col>
          </Row>
        </Col>
      )
    }

    let diatonicViewCode = []
    diatonicViewCode.push(
      <Col className={"mx- 0px-0 align-self-center"}>
        <Row className={"my-2"}>
          {eachFunctionChordsBlock(diatonicOrder[0][1], diatonicOrder[0][0], "bg-info")}

          {eachFunctionChordsBlock(diatonicOrder[1][1], diatonicOrder[1][0], "bg-warning")}

          {eachFunctionChordsBlock(diatonicOrder[2][1], diatonicOrder[2][0], "bg-danger")}
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
  if (props.diatonics.scale.indexOf("Major") >= 0) {
    diatonicStructures = [
      ["Tonic", [["I", 0], ["III", 2], ["VI", 5]]],
      ["SubDominant", [["II", 1], ["IV", 3],]],
      ["Dominant", [["V", 4], ["VII", 6],]],
    ]
  } else if (props.diatonics.scale.indexOf("Melodic") >= 0) {
    diatonicStructures = [
      ["Tonic Minor", [["I", 0], ["III", 2], ["VI", 5]]],
      ["SubDominant Minor", [["II", 1],]],
      ["Dominant Minor", [["IV", 3], ["V", 4], ["VII", 6],]],
    ]
  } else if (props.diatonics.scale.indexOf("minor") >= 0) {
    diatonicStructures = [
      ["Tonic Minor", [["I", 0], ["III", 2],]],
      ["SubDominant Minor", [["II", 1], ["IV", 3], ["VI", 5]]],
      ["Dominant Minor", [["V", 4], ["VII", 6],]],
    ]
  }

  //History Block


  //Return Block
  return (

    <Col>
      <Row className={""}>
        {diatonicViewBlock(diatonicStructures)}
      </Row>
      {/*
        <Row>
          <Col xs={12} className={"bg-info"}>
            History
          </Col>
          <Col xs={3}>I</Col>
          <Col xs={3}>II</Col>
          <Col xs={3}>III</Col>
          <Col xs={3}>IV</Col>
        </Row>
        */}
      <Row>
        {highChordButton}
        {inversionButton}
      </Row>

    </Col>

  )
}

let mapStateToProps = (state) => {
  return {
    diatonics: state.stateManager.diatonics,
  }
}
let mapDispatchToProps = (dispatch) => {
  return {
    flipHighChord: function () {
      return dispatch(flipHighChord())
    }
  }
}

export const DiatonicDisplay_func = connect(mapStateToProps, mapDispatchToProps)(DiatonicDisplay);