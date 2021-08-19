//import { COUNT_UP, COUNT_DOWN } from '../actions';
//reducer
const initialState = {
  clickCount: 0,
  currentValue: 0,
  base: {
    isPlay: false,
    isPlayLabel: 'Stop',
    bpm: 130,
  }
};

export const stateManager= (state = initialState, action) => {
  switch (action.type) {
    case 'BPM':
      return{
        base:{...state.base,bpm:state.base.bpm+action.value}
      }
    case 'PLAY_STOP':
      let label = state.base.isPlay ? 'Stop' : 'Play'
      return{
        base:{...state.base,isPlay:!state.base.isPlay,isPlayLabel:label}
      }
    case 'COUNT_UP':
      return {
        clickCount: state.clickCount + 1,
        currentValue: state.currentValue + action.value
      };
    case 'COUNT_DOWN':
      return {
        clickCount: state.clickCount + 1,
        currentValue: state.currentValue - action.value
      };
    default:
      return state;
  }
}

