import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";

// ----------------------------------------
//General Setting
const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
const chordTypeNameList=['M','m','5','7']
const masterChord ={
  'M':[12,24+0,24+7,36+0,36+4,36+7],
  'test':[12,],
  'm':[24+0,24+7,36,36+3,36+7],
  '7':[24+0,24+7,24+10,36+0,36+4,36+7],
  '5':[24+0,24+4,36],

}
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


let sampler = new Tone.Sampler({
  urls: {
    C1: "SD.mp3",
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
}).toDestination();

const guitar = new Tone.Sampler(
  {
    urls:{
      C1: "SD.mp3",
      B2: "agB2.mp3",
      B3: "agB3.mp3",
      //B4: "agB4.mp3",
      //C4: "guitarC4.mp3",
    },
    baseUrl:"./",
  }
).toDestination();

const drum = new Tone.Sampler(
  {
    urls:{
      C3: "BD.mp3",
      C4: "SD.mp3",
      C5: "HHC.mp3",
    },
    baseUrl:"./",
  }
).toDestination();

//sampler=guitar
//sampler.volume.value = -10;
//drum.volume.value = 5;

function settingTone(){
  console.log("settingTone")
  sampler.context._context.resume()
  drum.context._context.resume()
  guitar.context._context.resume()
  Tone.Transport.start();
}

function stopTone(){
  Tone.Transport.stop();
}

// ----------------------------------------
class MainClock extends React.Component{
  constructor(props) {
    const unit = 60/100
    super(props);
    this.state = {
      blocks:Array(7).fill(0),
      chordList:Array(4).fill(["C3","G3","C4", "E4","G4",]),
      chordNotes:Array(4).fill(36),
      chordTypes:Array(4).fill("M"),
      blocksColor:Array(4).fill("chordSelector"),
      color:"chordSelector",
      halfStep:1,
      step:3,
      nextStep:0,
      bpm:100,
      bdSched:[0,4,8,12].map(x => x*unit),
      sdSched:[2,6,10,14].map(x => x*unit),
      hhcSched:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(x => x*unit),
      chord1Sched:[0,].map(x => x*unit),
      chord2Sched:[4,].map(x => x*unit),
      chord3Sched:[8,].map(x => x*unit),
      chord4Sched:[12,].map(x => x*unit),
    };
    this.ticktack = this.ticktack.bind(this);
    //発音部
    let optsMembrane = {
      pitchDecay: 0.001,
      envelope: {
        attack: 0.001 ,
        decay: 0.75 ,
        sustain: 0.01 ,
        release: 0.01
      },
      volume: 10
    }
    //const membrane = new Tone.MembraneSynth(optsMembrane).toDestination();
    Tone.Transport.bpm.value = this.state.bpm;

    const KK = () => {drum.triggerAttackRelease(['C3'],'4n')}
    const SD = () => {drum.triggerAttackRelease(['C4'],'4n')}
    const HHC = () => {drum.triggerAttackRelease(['C5'],'4n')}

    let chord1 = () => {sampler.triggerAttackRelease(this.state.chordList[0],'2n')}
    let chord2 = () => {sampler.triggerAttackRelease(this.state.chordList[1],'2n')}
    let chord3 = () => {sampler.triggerAttackRelease(this.state.chordList[2],'2n')}
    let chord4 = () => {sampler.triggerAttackRelease(this.state.chordList[3],'2n')}

    let KKPart = new Tone.Part(KK, this.state.bdSched).start()
    let SDPart = new Tone.Part(SD, this.state.sdSched).start()
    let HHCPart = new Tone.Part(HHC, this.state.hhcSched).start()
    let melodyPart1 = new Tone.Part(chord1, this.state.chord1Sched).start()
    let melodyPart2 = new Tone.Part(chord2, this.state.chord2Sched).start()
    let melodyPart3 = new Tone.Part(chord3, this.state.chord3Sched).start()
    let melodyPart4 = new Tone.Part(chord4, this.state.chord4Sched).start()

    KKPart.loop=true
    KKPart.loopEnd='1m'
    SDPart.loop=true
    SDPart.loopEnd='1m'

    HHCPart.loop=true
    HHCPart.loopEnd='1m'

    melodyPart1.loop=true
    melodyPart1.loopEnd='1m'
    melodyPart2.loop=true
    melodyPart2.loopEnd='1m'
    melodyPart3.loop=true
    melodyPart3.loopEnd='1m'
    melodyPart4.loop=true
    melodyPart4.loopEnd='1m'

  }


  //------------------------------------------------
  //CallBack
  ticktack() {

    //Tone.Transport.bpm.value = this.state.bpm;
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

  //------------------------------------------------
  changeChord(i,val) {
    //val = chordNote or chordType
    // val = 3 => D# , val = 'm7' => minor 7th Chord
    let shift,chordTones
    if (typeof val== 'number'){
      let list = this.state.blocks.slice()
      let chordNotes=this.state.chordNotes.slice()
      list[i] = (list[i]+val>=soundNameList.length) ? 0 : (list[i]+val<0) ? soundNameList.length-1 : list[i]+val

      chordNotes[i]=list[i]
      this.setState({
        chordNotes:chordNotes,
        blocks:list
      })
      chordTones = masterChord[this.state.chordTypes[i]]
      shift = chordNotes[i] //0,1,2,...
    }else if (typeof val== 'string'){
      console.log('string')
      let list = this.state.chordTypes.slice()
      list[i]=val
      this.setState({
          chordTypes:list
        }
      )
      chordTones = masterChord[val]
      shift = this.state.chordNotes[i]
    }

    //chordListの変更処理　Stateの更新が非同期なので、ここで行う
    let chordList=this.state.chordList.slice()
    let chordTonesShifted=chordTones.map(x => soundNameList[(x+shift) %12] + Math.floor(x/12))
    //let chordToneABC=chordTonesShifted.map(x =>soundNameList[x]+Math.floor(x))
    //chordToneABC=chordToneABC.concat(chordTonesShifted.map(x =>soundNameList[x]+'2'))
    let chordToneABC = chordTonesShifted
    console.log(chordToneABC)
    chordList[i] = chordToneABC
    this.setState({
      chordList:chordList
    })

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
    let chordForSelect=[]
    for (let key in masterChord) {
      chordForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    return (
      <div className="scaleBlock">
        <ChordNoteSelector
          color={this.state.blocksColor[i]}
          value={this.state.blocks[i]}
          onClick={() => this.changeChord(i,1)}
          onClickP={() => this.changeChord(i,1)}
          onClickN={() => this.changeChord(i,-1)}
        />
        <ChordTypeSelector
          class={"scaleTypeSelector"}
          boxNum={i}
          value={masterChord[this.state.chordTypes[i]]}
          onChangeChord={(i,e) => this.changeChord(i,String(e))}
        />

      </div>
    );
  }

  changeBPM(diff){
    console.log(diff)
    let bpm =this.state.bpm
    bpm +=diff
    console.log(bpm)
    this.setState({
      bpm:bpm,
    })
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

        <BPMChanger
          bpm={this.state.bpm}
          p10={()=>this.changeBPM(10)}
          p1={()=>this.changeBPM(1)}
          n1={()=>this.changeBPM(-1)}
          n10={()=>this.changeBPM(-10)}
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



class ChordTypeSelector extends React.Component{
  constructor(props) {
    super(props);
    //二重管理になっているが、Selectの初期値をセットしたいため。
    this.state={
      list:Array(4).fill("M")
    }
  }
  changeChordByName(e){
    //console.log(e.target.value)
    this.props.onChangeChord(this.props.boxNum,e.target.value)

    //value変更用
    let list=this.state.list.slice()
    list[this.props.boxNum] = e.target.value
    this.setState({
      list:list
    })
  }
  render(){
    let chordForSelect=[]
    for (let key in masterChord) {
      chordForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    return(
      //valueがSelectの初期値となる。valueが入っていると、他に変更してもValueに戻る。
      <select value={this.state.list[this.props.boxNum]} className="scaleTypeSelector" onChange={(e)=>this.changeChordByName(e)}>
        {chordForSelect}
      </select>
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

    let sqWidth = 46 -1*j //34 +2*12= 58

    return(
      <div className={fletClass} style={{'width':sqWidth+'px'}}>
        <div className={noteClass} >{fletLetter}</div>
        {positionMark}
      </div>
    )
  }

  addFletNumber(i){
    let sqWidth = 46 -1*i //34 +2*12= 58
    return(
      <div class="squareFletNumber" style={{'width':sqWidth+'px'}}>{i+1}</div>
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
    this.setState({selectedScaleNoteList:list})
  }

  changeScaleType(num,arg){
    console.log(num,arg)
    let list = this.state.selectedScaleTypeList.slice()
    list[num]=arg

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
          class={"scaleNoteSelector"}
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
        <button className="scaleNoteSelector" value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
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

class ChordNoteSelector extends  React.Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <div>
        <button className="scaleNoteShifter" value={this.props.value} onClick={this.props.onClickN}>{"<"}</button>
        <button className={this.props.color} value={this.props.value} onClick={this.props.onClick}>{soundNameList[this.props.value]}</button>
        <button className="scaleNoteShifter" value={this.props.value} onClick={this.props.onClickP}>{">"}</button>
      </div>
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

function BPMChanger(props){
  return(
    <div>
      <button className="bpmButton" onClick={props.n10}>-10</button>
      <button className="bpmButton" onClick={props.n1}>-1</button>
      <span className="bpmDisplay">bpm:{props.bpm}</span>
      <button className="bpmButton" onClick={props.p1}>+1</button>
      <button className="bpmButton" onClick={props.p10}>+10</button>

    </div>
  )
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
