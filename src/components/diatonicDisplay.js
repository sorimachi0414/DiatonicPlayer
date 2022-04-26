import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Def from "../subCord";
import {changeDrum, changeInstP, flipHighChord} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {DropDownSelector} from './common.js'
import {chordTabList, chordTabListH} from "../subCord";


const DiatonicDisplay = (props)=> {
  //Initialize
  let flgHighChord=0
  let diatonicUI=[]

  //flg High Chord change Buuton
  let highChordButton =[]
  highChordButton.push(
    <Col>
      <button className="btn btn-outline-primary p-0 w-100 h-100"
              value={"High Chord"} onClick={()=>props.flipHighChord()}>{"High Chord"}</button>
    </Col>
  )



  function drawTab (chordName){
    let barreFret=0
    let barreLength=0
    let chordTabs=chordTabList
    let flgHighChord = props.base.flgHighChord
    if (flgHighChord) chordTabs = chordTabListH

    //Analysis
    let pictFirstFret = 0


    if(chordName in chordTabs){
      let tabWithoutN=[]
      for(let arg in chordTabs[chordName]){
       if(chordTabs[chordName][arg] >= 0) tabWithoutN.push(chordTabs[chordName][arg])
      }

      let minFret = Math.min(...tabWithoutN)
      let maxFret=Math.max(...chordTabs[chordName])

      if (minFret>0) {
        pictFirstFret = minFret-1
      }

      //Barre chord
      let firstStFret=chordTabs[chordName][0]
      let fifthStFret=chordTabs[chordName][4]
      let sixthStFret=chordTabs[chordName][5]

      barreFret=0
      if(firstStFret>0){
        if(firstStFret == sixthStFret ){
          barreFret=firstStFret
          barreLength=6
        }else if(firstStFret == fifthStFret){
          barreFret=firstStFret
          barreLength=5
        }
      }

    }

    //design layout


    //View
    let tabWidth = 100
    let tabHeight =100

    const canvasElem = document.createElement('canvas')
    canvasElem.width = tabWidth
    canvasElem.height = tabHeight
    const ctx = canvasElem.getContext('2d')

    // draw

    ctx.clearRect(0, 0, tabWidth, tabHeight)
    ctx.fillStyle = '#eee'
    ctx.fillRect(0, 0, tabWidth, tabHeight)

    // A---------B
    // | a------b
    // | |
    // | c-----d
    // C---------D

    let aX = 20
    let aY = 25
    let xNum = 5
    let xInt = 15
    let yInt = 12
    let bX = aX+xNum*xInt
    let cY = aY+5*yInt

    //horizontal
    ctx.beginPath () ;
    ctx.strokeStyle = "#000"
    ctx.moveTo( aX, aY )
    ctx.lineTo( aX, cY )
    ctx.lineWidth = 2 ;
    ctx.stroke() ;

    let yPoints = [aY,aY+yInt*1,aY+yInt*2,aY+yInt*3,aY+yInt*4,aY+yInt*5,]
    for(let arg of yPoints){
      ctx.beginPath () ;
      ctx.moveTo( aX, arg )
      ctx.lineTo( bX, arg )
      ctx.lineWidth = 1 ;
      ctx.stroke() ;
    }

    //Vertical
    for(let i =0;i<=xNum;i++){
      ctx.beginPath () ;
      ctx.moveTo( aX+xInt*i, aY )
      ctx.lineTo( aX+xInt*i, cY )
      ctx.lineWidth = 1 ;
      ctx.stroke() ;
    }

    //Position Mark
    let index=0
    let pictTab=[]
    if(chordName in chordTabs){
      if(pictFirstFret>0){
        pictTab = chordTabs[chordName].map(x=>x-pictFirstFret+1)
      }else{
        pictTab = chordTabs[chordName]
      }
      for(let val of pictTab){
        ctx.beginPath () ;
        ctx.fillStyle = "rgba(0,0,0,1)" ;
        if(val<0){
          ctx.font = "14px sans-serif";
          ctx.fillText("x", aX-xInt/1.3, index*yInt+aY+4);
        }else　if(val==0) {
          ctx.arc( aX+val*xInt - xInt/2, index*yInt+aY, 4, 0, 2 * Math.PI, false ) ;
          ctx.stroke()
        }else{
          ctx.arc( aX+val*xInt - xInt/2, index*yInt+aY, 5, 0, 2 * Math.PI, false ) ;
          ctx.fill()
        }
        index+=1
      }

      //depict barre
      if(barreFret>0){
        barreFret = barreFret - pictFirstFret+1
        ctx.beginPath () ;
        ctx.moveTo( aX+xInt*barreFret-xInt/2, aY+yInt*0 )
        ctx.lineTo( aX+xInt*barreFret-xInt/2, aY+yInt*barreLength-yInt )
        ctx.lineWidth = 10 ;
        ctx.stroke() ;
      }

    }

    //Fet Number
    if(pictFirstFret>0){
      for(let i =0;i<xNum;i++){
        ctx.font = "12px sans-serif";
        ctx.fillText(i+pictFirstFret, 20+i*xInt+5, cY+yInt)
      }
    }

    //ChordLabel
    ctx.font = "14px sans-serif";
    ctx.fillText(chordName, 5, 15);

    let testPng = canvasElem.toDataURL()
    return testPng
  }

  diatonicUI.push(
    <Col className={"mx- 0px-0 align-self-center text-center"}>
      <Row>
        <Col xs={3}>Tonic:</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[0])} />}</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[2])} />}</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[5])} />}</Col>
      </Row>
      <Row>
        <Col xs={3}>SubDominant:</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[1])} />}</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[3])} />}</Col>
      </Row>
      <Row>
        <Col xs={3}>Dominant:</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[4])} />}</Col>
        <Col xs={3}>{<img alt="icon" src={drawTab(props.base.diatonicNames[6])} />}</Col>
      </Row>
    </Col>
  )


  return(
    <Row className="card-body pt-1">
      <Col>
        <Row>
          {highChordButton}
        </Row>
        <Row>
        {diatonicUI}
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
    changeInstP: function(value){
      return dispatch(changeInstP(value))
    },
    changeDrum:function(value){
      return dispatch(changeDrum(value))
    },
    flipHighChord:function(){
      return dispatch(flipHighChord())
    }
  }
}

export const DiatonicDisplay_func =　connect(mapStateToProps, mapDispatchToProps)(DiatonicDisplay);