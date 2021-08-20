import React from 'react';
import { connect } from 'react-redux';
import {mainReducer} from "../reducers/reducer";
/*
export const countUp = (value) => {
  return {
    type: 'COUNT_UP',
    value
  };
}

export const countDown = (value) => {
  return {
    type: 'COUNT_DOWN',
    value
  };
}

const Counter = (props) => {
  const { currentValue, clickCount } = props;

  const handlePlusButton = () => {
    props.countUp(1);
  };

  const handleMinusButton = () => {
    props.countDown(1);
  };

  return (
    <div>
      <h2>関数コンポーネント</h2>
      <div>clickCount: {clickCount}</div>
      <div>
        <button onClick={(e) => { handleMinusButton(e); }}>-</button>
        <input type="text" value={currentValue} readOnly />
        <button onClick={(e) => { handlePlusButton(e); }}>+</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    clickCount: state.stateManager.clickCount,
    currentValue: state.stateManager.currentValue,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    countUp: function (value) {
      return dispatch(countUp(value));
    },
    countDown: function (value) {
      return dispatch(countDown(value));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

 */