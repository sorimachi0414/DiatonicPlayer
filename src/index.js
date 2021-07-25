import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";

// ----------------------------------------
//General Setting
const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
const chordTypeNameList=['M','m','5',]
const masterScale = {
  'Major':[0,2,4,5,7,9,11],
  'minor':[0,2,3,5,7,8,10],
  'm5t':  [0,3,5,7,10],
  'Ryukyu':[0,4,5,7,11],
}
// ----------------------------------------

/*
F-G-Am
C-Am-F-G
Dm-G-C-A7
A7-D7
 */
//Debug Tone.js
Tone.Transport.bpm.value = 40;

const sampler = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
}).toDestination();

function settingTone(){
  console.log("settingTone")
  sampler.context._context.resume()
  Tone.Transport.start();
}

function stopTone(){
  Tone.Transport.stop();
}


// ----------------------------------------
class MainClock extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      blocks:Array(7).fill(0),
      chordTypes:Array(4).fill(0),

      blocksColor:Array(4).fill("chordSelector"),
      color:"chordSelector",
      halfStep:1,
      step:3,
      nextStep:0
    };
    this.ticktack = this.ticktack.bind(this);
    this.halfStep = this.halfStep.bind(this);
    Tone.Transport.scheduleRepeat((time) => {
      //Call Back
      if(this.state.halfStep==0){
        this.setState({halfStep:1})
      }else{
        this.setState({halfStep:0})
        sampler.triggerAttackRelease(["C3", "E3","G3",], "4n")
        this.ticktack()
      }
    }, "8n", "0m");
  }

  //------------------------------------------------
  //CallBack
  ticktack() {
    let step=this.state.step
    step+=1
    if(step>=4){step=0}
    let nextStep=step+1
    if(nextStep>=4){nextStep=0}
    //Display Change
    this.changeColor(step)
    this.setState({
      halfStep:0,
      step:step,
      nextStep:nextStep
    })
    }

  //発音しない、ハーフステップでのコールバック
  halfStep(e){
    this.setState({halfStep:1,})
  }

  //------------------------------------------------

  changeChord(i) {
    //コードブロックの数字をインクリメント
    let blocks = this.state.blocks.slice()
    blocks[i] = (blocks[i] < soundNameList.length) ? blocks[i]+1 : 0
    this.setState({
      blocks:blocks
      }
    )
  }

  changeChordType(i) {
    //コードブロックの数字をインクリメント
    let list = this.state.chordTypes.slice()
    list[i] = (list[i] < chordTypeNameList.length) ?list[i]+1 : 0
    this.setState({
      chordTypes:list
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
        <div>
          <ChordNoteSelector
            color={this.state.blocksColor[i]}
            value={this.state.blocks[i]}
            onClick={() => this.changeChord(i)}
          />
          <ChordTypeSelector
            color={this.state.blocksColor[i]}
            value={this.state.chordTypes[i]}
            onClick={() => this.changeChordType(i)}
          />
        </div>
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
          onClick={()=>settingTone()}
        />
        <StopButton
          onClick={()=>stopTone()}
        />
        <PlayButton
          onClick={() => this.start()}
        />
        <StopButton
          onClick={() => this.stop()}
        />
        <div className="spacer"></div>
        <ScaleSelector
        step={this.state.step}
        hstep={this.state.halfStep}
        nextStep={this.state.nextStep}
        />
        <div className="spacer"></div>
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
    let fletLetter=""
    let stringShift=0
    let noteClass=""

    //ポジションマーク
    let positionMark = (i===2&&(j===2||j===4||j===6||j===8)||((i===1||i===3)&&j===11)) ? <div className="circle"></div> : ""
    let fletClass = j===0 ? "square nut" : "square"

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
      if(noteClass==="noteNext"){noteClass="noteNextTrans"}
      else if(noteClass==="noteBaseNext"){noteClass="noteBaseNextTrans"}
      else if(noteClass==="noteTrans"){noteClass="note"}
      else if(noteClass==="noteBaseTrans"){noteClass="noteBase"}
      else if(noteClass==="noteBaseNextTrans"){noteClass="noteBaseNext"} //bug
      else if(noteClass==="noteNextTrans"){noteClass="noteNext"} //There is bug
    }

    return(
      <div className={fletClass}>
        <div className={noteClass}>{fletLetter}</div>
        {positionMark}
      </div>
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


function scaleProcessor(key,type){
  //console.log("ScaleProcessor")
  //console.log(type)
  let myScale=masterScale[type].map(x => (x+key) % 12)
  return myScale
}


class ScaleSelector extends React.Component{
  constructor(props) {
    super(props);
    this.changeScaleType=this.changeScaleType.bind(this)
    this.state={
      selectedScaleNoteList:Array(4).fill(0),
      selectedScaleTypeList:Array(4).fill("Major"),
      Scales:[
        [0,4,5,7,11],
        [0,4,5,7,11],
        [0,4,5,7,11],
        [0,4,5,7,11],
      ],
    }
  }

  changeScaleTone(i,val){
    //コードブロックの数字をインクリメント
    let list = this.state.selectedScaleNoteList.slice()
    list[i] = (list[i]+val>=12) ? 0 : (list[i]+val<0) ? 11 : list[i]+val
    console.log(list[i])
    /*
    list[i] +=val
    if (list[i]>= 12){
      list[i]=0
    }

     */
    this.setState({
      selectedScaleNoteList:list
      }
    )
  }

  changeScaleType(num,arg){
    console.log(num,arg)
    let list = this.state.selectedScaleTypeList.slice()
    list[num]=arg
    /*
    //コードブロックの数字をインクリメント
    let list = this.state.selectedScaleTypeList.slice()
    list[i] +=1
    if (list[i]>= masterScale.length){
      list[i]=0
    }

     */
    this.setState({
      selectedScaleTypeList:list
      //selectedScaleTypeList:masterScale[arg]
      }
    )

  }

  repeatSelector(i){
    return(
      <div className="scaleBlock">
        <ScaleToneSelector
          class={"scaleNoteSelecotr"}
          value={soundNameList[this.state.selectedScaleNoteList[i]]}
          onClickP={() => this.changeScaleTone(i,1)}
          onClickN={() => this.changeScaleTone(i,-1)}

        />
        <ScaleTypeSelector
          class={"scaleTypeSelector"}
          boxNum={i}
          //value={scaleTypeNameList[this.state.selectedScaleTypeList[i]]}
          value={masterScale[this.state.selectedScaleTypeList[i]]}
          onChangeScale={(e,i) => this.changeScaleType(e,i)}
        />
      </div>
    )
  }

  render(){
    //definition
    let step=this.props.step
    let hstep=this.props.hstep
    let nextStep = this.props.nextStep
    let selectors=[]
    const selectorLength=4
    for(let i=0;i<selectorLength;i++){
      selectors.push(
        this.repeatSelector(i)
      )
    }
    return(
      <div>
        {selectors}
        <div className="spacer"></div>
        <FingerBoard
          nowScale={scaleProcessor(this.state.selectedScaleNoteList[step],this.state.selectedScaleTypeList[step])}
          nextScale={scaleProcessor(this.state.selectedScaleNoteList[nextStep],this.state.selectedScaleTypeList[nextStep])}
          halfStep={hstep}
        />
      </div>
    )
  }
}

class ScaleToneSelector extends  React.Component {
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <div>
        <button className="scaleNoteShifter" value={this.props.value} onClick={this.props.onClickN}>{"<"}</button>
        <button className="scaleNoteSelecotr" value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
        <button className="scaleNoteShifter" value={this.props.value} onClick={this.props.onClickP}>{">"}</button>
      </div>
    )
  }
}

class ScaleTypeSelector extends  React.Component {
  constructor(props) {
    super(props);
  }

  //props.onClick
  changeScaleByName(e){
    //console.log(e.target.value)
    this.props.onChangeScale(this.props.boxNum,e.target.value)
  }

  render(){
    let scaleForSelect=[]
    for (let key in masterScale) {
      scaleForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    return(
      <select className="scaleTypeSelector" onChange={(e)=>this.changeScaleByName(e)}>
        {scaleForSelect}
      </select>
      //<button className={this.props.class} value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
    )
  }
}

class ChordTypeSelector extends  React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <button className={this.props.color} value={this.props.value} onClick={this.props.onClick}>{chordTypeNameList[this.props.value]}</button>
    )
  }
}

class ChordNoteSelector extends  React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <button className={this.props.color} value={this.props.value} onClick={this.props.onClick}>{soundNameList[this.props.value]}</button>
    )
  }
}

function PlayButton(props){
  return (
    //<button onClick={startTone()}>
    //<button onClick={()=>startTone("e")}>
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
  <MainClock />,
  document.getElementById('root')
);


// ----------------------------------------
// ----------------------------------------
