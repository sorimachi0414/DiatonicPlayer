import {playStopType} from "../reducers/reducer";
import {connect} from "react-redux";
import React from "react";

const PlayStopButton = (props)=>{
  const { isPlayLabel,isPlay} = props;

  const playStopSwitch=()=>{
    props.playStopDispatch()
  }
  return (
    <button onClick={(e) => { playStopSwitch(); }} className={''}>
      {isPlayLabel}
    </button>
  )
}
let mapStateToProps = (state) => {
  return {
    isPlay: state.stateManager.base.isPlay,
    isPlayLabel: state.stateManager.base.isPlayLabel,
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    playStopDispatch: function(){
      return dispatch(playStopType())
    },
  };
};
export const PlayStopButton_func=　connect(mapStateToProps, mapDispatchToProps)(PlayStopButton);
