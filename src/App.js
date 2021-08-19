import React, { Component } from 'react';
import { connect } from 'react-redux';
//import Img from './Img';
//import './App.css';


// ステートのマッピング
function mappingState(state) {
  return state;
}

// Appコンポーネント
class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-images">

          </div>
          <h1>羊は何匹？</h1>
          <Message />
          <Button />
        </header>
      </div>
    );
  }
}
// ストアのコネクト
App = connect()(App);


// メッセージのコンポーネント
class Message extends React.Component {
  render() {
    return (
      <div>
        <p>羊が{this.props.counter}匹</p>
      </div>
    );
  }
}
// ストアのコネクト
Message = connect(mappingState)(Message);


// ボタンのコンポーネント
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.ButtonClickDispatch = this.ButtonClickDispatch.bind(this);
  }

  // ボタンクリック
  ButtonClickDispatch(e) {
    if (e.shiftKey) {
      this.props.dispatch({ type: 'Minus' });
    } else {
      this.props.dispatch({ type:  'Plus' });
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.ButtonClickDispatch}>
          数える！
        </button>
      </div>
    );
  }
}
// ストアのコネクト
Button = connect()(Button);

export default App;
