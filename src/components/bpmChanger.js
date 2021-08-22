import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {connect} from "react-redux";
import React from "react";
import {bpmChangeType} from "../reducers/reducer";

const btnClass="btn btn-outline-success border-1 p-0 w-100 h-100"

const BPMChanger=(props)=>{
  return(
    <Row className="mx-0">
      <Col className="col-2 px-1">
        <button className={btnClass} onClick={()=>props.bpmChange(-10)}>-10</button>
      </Col>
      <Col className="col-2  px-1">
        <button className={btnClass} onClick={()=>{props.bpmChange(-1)}}>-1</button>
      </Col>
      <Col className="col-4 px-1 text-center">
        <span className="fw-bolder fs-4">bpm</span>
        <span className="text-info fw-bolder fs-4">{props.bpm}</span>
      </Col>
      <Col className="col-2  px-1">
        <button className={btnClass} onClick={()=>{props.bpmChange(1)}}>+1</button>
      </Col>
      <Col className="col-2  px-1">
        <button className={btnClass} onClick={()=>{props.bpmChange(10)}}>+10</button>
      </Col>
    </Row>
  )
}

let mapStateToProps = (state) => {
  return {
    bpm:state.stateManager.base.bpm,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    bpmChange:function (value){
      return dispatch(bpmChangeType(value))
    },
  };
};

export const BPMChanger_func=　connect(mapStateToProps, mapDispatchToProps)(BPMChanger);