import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Def from "../subCord";
import {changeDrum, changeInstP} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";
import {DropDownSelector} from './common.js'

const MusicSelector = (props)=> {
  return(
    <Row className="card-body pt-1">
      <Col  xs={2} sm={2} className="mx- 0px-0 align-self-center text-center">
        Tone
      </Col>
      <Col xs={4} sm={3} className="p-2">
        <DropDownSelector
          change={(e)=>props.changeInstP(e)}
          optionList={Def.instList}
          initValue={props.base.inst}
        />
      </Col>
      <Col  xs={2} sm={2} className="px-0 align-self-center text-center">
        Drum
      </Col>
      <Col xs={4} sm={3} className="p-2">
        <DropDownSelector
          change={(e)=>props.changeDrum(e)}
          optionList={Def.rhythmList}
          initValue={props.base.drum}
        />
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
    }
  }
}

export const MusicSelector_func =　connect(mapStateToProps, mapDispatchToProps)(MusicSelector);