import Col from "react-bootstrap/Col";
import {setScaleType, setBaseScale, shiftScaleNote, flipHighChord} from "../reducers/reducer";
import Row from "react-bootstrap/Row";
import {connect} from "react-redux";
import React from "react";
import {ThreeButtonChanger,ListedSelector} from "./common";
import {soundNameList, masterScale,baseScale, fretNum, defaultState} from "../subCord"
import {FingerBoard} from './fingerBoard.js'
import {store} from "../index";
import {ScaleSelectorFooterRedux_func} from "./scaleSelector";

const FooterRedux =(props) => {


  return(
    <>
      <Col xs={6} md={6} className='align-self-center px-1'>
        <Row>
          <Col xs={12}>
            <span className={"fs-2"}>{soundNameList[props.diatonics.keyNum]} {props.diatonics.scale.substr(3)}</span>
          </Col>
          <Col xs={3}>
            <button className="btn btn-outline-primary p-0 w-100 h-100" value={props.value} onClick={props.onClickN}>{"<"}</button>
          </Col>
          <Col xs={3}>
            <button className="btn btn-outline-primary p-0 w-100 h-100" value={props.value} onClick={props.onClickP}>{">"}</button>
          </Col>
        </Row>
      </Col>
      <Col xs={6}>
        <Row className={"m-2"}>
          <Col xs={6}>
            <button className="btn btn-outline-primary p-0 w-100 h-100"
                    value={"High Chord"} onClick={()=>props.flipHighChord()}>{"High Chord"}</button>
          </Col>
        </Row>
        <Row className={"m-2"}>
          <div className="d-block d-sm-none">xs 576px</div>
          <div className="d-none d-sm-block d-md-none">sm >576px</div>
          <div className="d-none d-md-block d-lg-none">md >768px</div>
          <div className="d-none d-lg-block d-xl-none">lg >992px</div>
          <div className="d-none d-xl-block">xl >1200px</div>
        </Row>



      </Col>
    </>
  )


  function scaleProcessor(key,type){
    return masterScale[type].map(x => (x+key) % 12)
  }

  const repeatSelector=(i)=>{
    return(
      <Col key={i} xs={12}>
        <Row>
          <Col xs={3}>
            <ThreeButtonChanger
              class={"scaleNoteSelector"}
              color={'btn btn-outline-primary w-100'}
              color={props.base.blocksColor[i]}
              value={soundNameList[props.diatonics.keyNum]}
              onClickP={() => props.shiftScaleNote(i,1)}
              onClickN={() => props.shiftScaleNote(i,-1)}
            />
          </Col>
          <Col xs={5}>
            {/*Base Scale*/}
            <ListedSelector
              chordOrScale={'Scale'}
              initList={props.base.typeOfScale[i]}
              optionList={baseScale}
              class={"scaleTypeSelector"}
              boxNum={i}
              value={props.base.typeOfScale[i]}
              //value={masterScale[props.base.typeOfScale[i]]}
              onChange={(i,value) => props.setBaseScale(i,value)}
            />
          </Col>
          {/*
        <Col xs={5}>
          Display Scale
          <ListedSelector
            chordOrScale={'Scale'}
            initList={props.base.typeOfScale[i]}
            optionList={props.base.availableScales}
            class={"scaleTypeSelector"}
            boxNum={i}
            value={props.base.typeOfScale[i]}
            //value={masterScale[props.base.typeOfScale[i]]}
            onChange={(i,value) => props.setScaleType(i,value)}
            //readStorage={this.changeScaleFromStorage}
          />
        </Col>
        */}
        </Row>
      </Col>
    )
  }

  let selectors=[]
  const selectorLength=1
  for(let i=0;i<selectorLength;i++){
    selectors.push( repeatSelector(i) )
  }

  return(
    <Row>
      {selectors}
      {/*
        <FingerBoard/>
        <Col xs={12} sm={6}>
        <button className="btn btn-outline-success" onClick={()=>props.flipSymbol()} >
        change Circle to Number
        </button>
        </Col>
        <Col xs={12} sm={6}>
        <button className="btn btn-outline-warning" onClick={() => {
        //localStorage.clear()}
        let base = defaultState
        store.dispatch({type: 'LOAD_LOCALSTORAGE', base: base})
      }
      }>  Reset save data</button>
        </Col>
      */}
    </Row>
  )

}



const mapStateToProps = (state) => {
  return {base: state.stateManager.base,diatonics: state.stateManager.diatonics,}
}

const mapDispatchToProps=(dispatch)=>{
  return{
    shiftScaleNote:function (i,value){
      return dispatch(shiftScaleNote(i,value))
    },
    setBaseScale: function (i,value){
      return dispatch(setBaseScale(i,value))
    },
    setScaleType: function (i,value){
      return dispatch(setScaleType(i,value))
    },
    flipSymbol:function(){
      return dispatch({type:'FLIP_SYMBOL'})
    },
    flipHighChord:function(){
      return dispatch(flipHighChord())
    }
  }
}
export const FooterRedux_func =　connect(mapStateToProps, mapDispatchToProps)(FooterRedux);


