import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React from "react";

export const ChordChopperCheckBox =(props)=>{
  return(
    <input className="form-check-input m-05 p-sm-2 mx-sm-1" type="checkbox" checked={props.checked} value={props.value} onChange={props.onClick} />
  )
}

export const ThreeButtonChanger =(props)=>{
  return(
    <Row className="p-2 px-3">
      <Col xs={3} sm={3} md={3} className="p-0 m-0">
        <button className="btn btn-outline-primary p-0 w-100 h-100" value={props.value} onClick={props.onClickN}>{"<"}</button>
      </Col>
      <Col xs={6} sm={6} md={6} className="p-0 m-0 ">
        <button className={props.color} value={props.value} onClick={props.onClickP}><span className="fs-2"> {props.value}</span></button>
      </Col>
      <Col xs={3} sm={3} md={3} className="p-0 m-0">
        <button className="btn btn-outline-primary p-0 w-100 h-100" value={props.value} onClick={props.onClickP}>{">"}</button>
      </Col>
    </Row>
  )
}

export const DropDownSelector =(props)=> {
  let options=[]
  for(let key in props.optionList){
    options.push(
      <option key={key} value={key}>{key}</option>
    )
  }
  return(
    <select defaultValue={props.initValue} className="form-select w-100" onChange={(e)=>props.change(e.target.value)}>
      {options}
    </select>
  )
}

export class ListedSelector extends React.Component{
  render(){
    let options=[]
    for (let key in this.props.optionList) {
      options.push(
        <option key={key} value={key}>{key.substr(3,key.length)}</option>
      )
    }
    return(
      //valueがSelectの初期値となる。valueが入っていると、他に変更してもValueに戻る。
      <select
        size={5}
        defaultValue={this.props.initList}
        className="form-select p-1"
        //value={this.props.value}
        onClick={(e)=>this.props.onChange(this.props.boxNum,e.target.value)}>
        {options}
      </select>
    )
  }
}
