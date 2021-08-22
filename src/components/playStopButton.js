import {playStopType} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";

const PlayStopButton = (props)=>{
  return (
    <button onClick={(e) => { props.playStopDispatch()}} className={'btn btn-primary fs-2 w-100 px-0'}>
      {props.base.isPlayLabel}
    </button>
  )
}
let mapStateToProps = (state) => {
  return {base: state.stateManager.base,}
}
let mapDispatchToProps = (dispatch) => {
  return {
    playStopDispatch: function(){
      return dispatch(playStopType())
    },
  }
};
export const PlayStopButton_func=　connect(mapStateToProps, mapDispatchToProps)(PlayStopButton);
