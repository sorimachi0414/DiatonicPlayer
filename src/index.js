import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
const WebAudioScheduler = require("web-audio-scheduler");
//--------------
//General Setting
var bpm=40
var step=60/bpm


// ----------------------------------------
var audioContext = new AudioContext();
var sched = new WebAudioScheduler({ context: audioContext });
var masterGain = null;

sched.on("start", function() {
  masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
});
sched.on("stop", function() {
  masterGain.disconnect();
  masterGain = null;
});

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    sched.aheadTime = 0.1;
  } else {
    sched.aheadTime = 1.0;
    sched.process();
  }
});

// ----------------------------------------
// サウンドの読み込み
const context = new AudioContext()
class BufferLoader {

  constructor(context, urlList) {
    this.context = context;
    this.urlList = urlList;
    this.bufferList = new Array();
  }

  loadBuffer(url, index) {
    const request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      this.context.decodeAudioData(request.response).then(
        (buffer) =>  this.bufferList[index] = buffer
      );
    }
    request.onerror = (e) => {
      console.error(`XHR Request error: ${e}`);
    }
    request.send();
  }

  load() {
    this.urlList.forEach((url, i) => this.loadBuffer(url, i));
  }
};

//loading audio buffers
const bufferLoader = new BufferLoader(
  audioContext,
  [
    'CMajor.wav',
    'GMajor.wav',
    'Aminor.wav',
    'FMajor.wav'
  ]
);
bufferLoader.load();

// ----------------------------------------
class Board extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      blocks:Array(9).fill(0),
      blocksColor:Array(4).fill("chordSelector"),
      color:"chordSelector",
      Scales2:[
        [2,6,7,9,1],
        [4,8,9,11,5],
        [0,4,5,7,11],
        [4,8,9,11,3],
      ],
      Scales:[
        [0,4,5,7,11],
        [0,4,5,7,11],
        [4,8,9,11,3],
        [4,8,9,11,3],
      ],
      halfStep:0,
      step:0,
      nextStep:1
    };
    this.ticktack = this.ticktack.bind(this);
    this.halfStep = this.halfStep.bind(this);
    this.metronome = this.metronome.bind(this);
  }

  //------------------------------------------------
  //CallBack
  ticktack(e) {
    //Display Change
    this.changeColor(e.args.step)
    //this.changeFingerBoard(e.args.step)
    this.setState({
      halfStep:0,
      step:e.args.step,
      nextStep:e.args.nextStep,
    })
    //play wav
    const source = audioContext.createBufferSource();
    source.buffer = bufferLoader.bufferList[this.state.step];
    source.connect(audioContext.destination);
    //source.start(0);

    var t0 = e.playbackTime;
    var t1 = t0 + e.args.duration;
    var osc = audioContext.createOscillator();
    var amp = audioContext.createGain();

    //wave playing
    source.start(t0)
    source.stop(t1)


    /*
    osc.frequency.value = e.args.frequency;
    osc.start(t0);
    osc.stop(t1);
    osc.connect(amp);
    */
    amp.gain.setValueAtTime(0.5, t0);
    amp.gain.exponentialRampToValueAtTime(1e-6, t1);
    amp.connect(masterGain);

    sched.nextTick(t1, function () {
      osc.disconnect();
      amp.disconnect();
    });
  }

  //発音しない、ハーフステップでのコールバック
  halfStep(e){
    this.setState({
      halfStep:1,
    })
  }

  metronome(e) {
    var t0 = e.playbackTime;
    sched.insert(t0 + 0.000, this.ticktack, {frequency: 146.8, duration: 5.0, step: 0, nextStep:1});
    sched.insert(t0 + 0.5*step, this.halfStep, {halfStep:1});
    sched.insert(t0 + 1*step, this.ticktack, {frequency: 164.8, duration: 5.0, step: 1, nextStep:2});
    sched.insert(t0 + 1.5*step, this.halfStep, {halfStep:1});
    sched.insert(t0 + 2*step, this.ticktack, {frequency: 130.8, duration: 5.0, step: 2, nextStep:3});
    sched.insert(t0 + 2.5*step, this.halfStep, {halfStep:1});
    sched.insert(t0 + 3*step, this.ticktack, {frequency: 195.9, duration: 5.0, step: 3, nextStep:0});
    sched.insert(t0 + 3.5*step, this.halfStep, {halfStep:1});
    sched.insert(t0 + 4*step, this.metronome);
  }
  start() {
    sched.start(this.metronome);
  }
  stop() {
    sched.stop(true);
  }
  //------------------------------------------------

  changeChord(i) {
    let blocks = this.state.blocks.slice()
    blocks[i] +=1
    if (blocks[i]>= blocks.length){
      blocks[i]=0
    }
    this.setState({
      blocks:blocks
      }
    )
  }

  //アクティブなステップ（コード）を着色
  changeColor(i){
    let blocksColor = this.state.blocksColor.slice()
    blocksColor=Array(4).fill("chordSelector")
    blocksColor[i]="chordSelectorActive"
    this.setState({
      blocksColor:blocksColor
      }
    )
  }

  //コードブロックを配置
  arrangeBlock(i){
      return (
        <Block
          color={this.state.blocksColor[i]}
          value={this.state.blocks[i]}
          onClick={() => this.changeChord(i)}
        />
      );
  }

  render(){
    let blocks=[]
    const blockLength=4
    for(let i=0;i<blockLength;i++){
      blocks.push(
        this.arrangeBlock(i)
      )
    }
    return(
      <div>
        {blocks}
        <div className="board-row"></div>
        <PlayButton
          onClick={() => this.start()}
        />
        <StopButton
          onClick={() => this.stop()}
        />
        <div className="spacer"></div>
        <FingerBoard
          nowScale={this.state.Scales[this.state.step]}
          nextScale={this.state.Scales[this.state.nextStep]}
          halfStep={this.state.halfStep}
        />
      </div>
    )
  }
}


class FingerBoard extends React.Component{
  constructor(props) {
    super(props);
  }

  //各弦の各フレットを配置
  arrangeFingerElements(i,j) {
    let settingClass="square"
    let fletLetter=""
    let stringShift=0
    let positionMark=""
    let fletClass="square"
    let noteClass=""

    //ポジションマーク
    if(i===2&&(j===2||j===4||j===6||j===8)||((i===1||i===3)&&j===11)){
      positionMark=<div class="circle"></div>
    }

    //ナット表示
    if(j===0){fletClass="square nut"}

    //各フレットを音名に変換、スケールと照合
    if(i===0){stringShift=4}
    if(i===1){stringShift=11}
    if(i===2){stringShift=7}
    if(i===3){stringShift=2}
    if(i===4){stringShift=9}
    if(i===5){stringShift=4}

    //各フレットを音階に変換　C=0
    let fletSound=(stringShift+j+1) % 12

    //スケール構成音に色付け
    if(this.props.nowScale.indexOf(fletSound)>0){
      //構成音の場合
      noteClass="note"
      fletLetter="●"
    }else if(this.props.nowScale.indexOf(fletSound)===0){
      fletLetter="●"
      noteClass="noteBase"
    }else if(this.props.nextScale.indexOf(fletSound)===0){
      //次のスケールの音の場合、予告
      noteClass="noteBaseNextTrans"
      fletLetter="○"
    }else if(this.props.nextScale.indexOf(fletSound)>0){
      //次のスケールの音の場合、予告
      noteClass="noteNextTrans"
      fletLetter="○"
    }else{
      noteClass=""
    }

    //次の音に向け、ステップの半分で見た目変化を開始
    if(this.props.halfStep>0){
      //if(noteClass=="note"){noteClass="noteTrans"}
      //else if(noteClass=="noteBase"){noteClass="noteBaseTrans"}
      if(noteClass==="noteNext"){noteClass="noteNextTrans"}
      else if(noteClass==="noteBaseNext"){noteClass="noteBaseNextTrans"}
      else if(noteClass==="noteTrans"){noteClass="note"}
      else if(noteClass==="noteBaseTrans"){noteClass="noteBase"}
      else if(noteClass==="noteNextTrans"){noteClass="noteNext"}
      else if(noteClass==="noteBaseNextTrans"){noteClass="noteBaseNext"}
    }

    return(
      <div className={fletClass}>
        <div className={noteClass}>{fletLetter}</div>
        {positionMark}
      </div>
      //<button className={settingClass}>{fletLetter}</button>
    )
  }

  addFletNumber(i){
    return(
      <div class="squareFletNumber">{i+1}</div>
    )
  }


  render(){
    let eachStrings=[]
    let fingerElements=[]
    const fingerFlets=12
    const strings=6

    //各弦のフレットを表示
    for(let i=0;i<strings;i++) {
      let fingerElements=[]
      //１フレット毎、配列にプールしていく
      for (let j = 0; j < fingerFlets; j++) {
        fingerElements.push(
          this.arrangeFingerElements(i,j)
        )
      }
      eachStrings.push(fingerElements)
    }

    //フレット番号表示
    fingerElements=[]
    for(let n=0;n<fingerFlets;n++){
      fingerElements.push(
        this.addFletNumber(n)
      )
    }
    eachStrings.push(fingerElements)
    return(
      <div>
        <div className="spacer"></div>

        <div className="next-row">{eachStrings[0]}</div>
        <div className="next-row">{eachStrings[1]}</div>
        <div className="next-row">{eachStrings[2]}</div>
        <div className="next-row">{eachStrings[3]}</div>
        <div className="next-row">{eachStrings[4]}</div>
        <div className="next-row">{eachStrings[5]}</div>
        <div className="next-row">{eachStrings[6]}</div>
      </div>
    )
  }
}

class Block extends  React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <button className={this.props.color} value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
    )
  }
}

function PlayButton(props){
  return (
    <button onClick={props.onClick}>
      Play
    </button>
  );
}

function StopButton(props){
  return (
    <button onClick={props.onClick}>
      Stop
    </button>
  );
}

// ----------------------------------------
ReactDOM.render(
  <Board />,
  document.getElementById('root')
);
