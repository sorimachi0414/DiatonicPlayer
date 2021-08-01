import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";
import * as Def from "./subCord.js"
// ----------------------------------------
const soundNameList=Def.soundNameList
const masterChord=Def.masterChord
const masterScale=Def.masterScale

const drum = Def.drum
const sampler = Def.sampler

const BD = (en,time) => {if(en>0)drum.triggerAttackRelease(['C3'],'4n',time)}
const SD = (en,time) => {if(en>0)drum.triggerAttackRelease(['C4'],'4n',time)}
const HHC = (en,time) => {if(en>0)drum.triggerAttackRelease(['C5'],'4n',time)}

function playThisChord(chordList,en,time){
  if(en>0) sampler.triggerAttackRelease(chordList, '4n',time)
}

function settingTone(){
  //sampler.context._context.resume()
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
      chordList:[['A2','A3','C#3','E3','G3',],['A2','A3','C#3','E3','G3',],['D2','D3','F#3','A3','C3'],['D2','D3','F#3','A3','C3']],
      chordNotes:[9,9,2,2],
      chordTypes:Array(4).fill('7'),
      blocksColor:Array(4).fill("chordSelector"),
      bdPlan:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,],
      sdPlan:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,],
      hhcPlan:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
      chordPlan:[
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,],
      ],
      color:"chordSelector",
      step:15,
      nextStep:0,
      bpm:100,
    };
    this.ticktack = this.ticktack.bind(this);

    //発音部
    Tone.Transport.scheduleRepeat((time) => {
      //Call Back
      this.ticktack()
      playThisChord(this.state.chordList[0],this.state.chordPlan[0][this.state.step],time)
      playThisChord(this.state.chordList[1],this.state.chordPlan[1][this.state.step],time)
      playThisChord(this.state.chordList[2],this.state.chordPlan[2][this.state.step],time)
      playThisChord(this.state.chordList[3],this.state.chordPlan[3][this.state.step],time)
      BD(this.state.bdPlan[this.state.step],time)
      SD(this.state.sdPlan[this.state.step],time)
      HHC(this.state.hhcPlan[this.state.step],time)
    }, "8n", "0m");
  }

  //------------------------------------------------
  //CallBack
  ticktack() {
    Tone.Transport.bpm.value = this.state.bpm;
    let step=this.state.step
    step = (step>=15) ? 0:step+1
    let nextStep= (step>=15) ? 0 : step+1
    //Display Change
    this.changeColor(step)
    this.setState({
      step:step,
      nextStep:nextStep
    })
  }

  makeChordString(i) {
    let chordList=this.state.chordList.slice()
    let shift = this.state.chordNotes[i] //0,1,2,...
    let chordKey = this.state.chordTypes[i] //M,m,m7,...

    //コード種別を変更
    let chordTones = masterChord[chordKey]

    //ピッチをシフト
    let chordTonesShifted=chordTones.map(x => (x+shift) %12)

    //convert Number to Alphabet
    let chordToneABC=chordTonesShifted.map(x =>soundNameList[x]+'3')
    chordList[i] = chordToneABC
    console.log(chordToneABC)
    console.log(chordList[i])

    this.setState({
      chordList:chordList
    })

  }

  //------------------------------------------------
  changeChord(i,val) {
    //val = chordNote or chordType
    // val = 3 => D# , val = 'm7' => minor 7th Chord
    let shift,chordTones
    if (typeof val== 'number'){
      //let list = this.state.chordNotes.slice()
      let chordNotes=this.state.chordNotes.slice()
      //list[i] = (list[i]+val>=soundNameList.length) ? 0 : (list[i]+val<0) ? soundNameList.length-1 : list[i]+val

      chordNotes[i]=(chordNotes[i]+val<0) ? 11:(chordNotes[i]+val)%12

      this.setState({
        chordNotes:chordNotes,
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
    let chordTonesShifted=chordTones.map(x => (x+shift) %12)
    let chordToneABC=chordTonesShifted.map(x =>soundNameList[x]+'3')
    chordList[i] = chordToneABC
    this.setState({
      chordList:chordList
    })
  }

  //アクティブなステップ（コード）を着色
  changeColor(i){
    i=Math.floor(i/4)
    let blocksColor = this.state.blocksColor.slice()
    blocksColor=Array(4).fill("chordSelector")
    blocksColor[i]="chordSelectorActive"
    this.setState({
      blocksColor:blocksColor
      }
    )
  }

  changeChordChopper(note,bar){
    // You may shrink code
    let chordPlan=this.state.chordPlan.slice()
    let chordPlanOneBar = chordPlan[bar].slice()
    let status =chordPlanOneBar[note+bar*4]
    chordPlanOneBar[note+bar*4] = (status>0)?0:1
    chordPlan[bar] = chordPlanOneBar

    this.setState({
      chordPlan:chordPlan,
      }
    )
  }

  //コードブロックを配置
  arrangeChordSelector(i){
    let chordForSelect=[]
    for (let key in masterChord) {
      chordForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    let check0=(this.state.chordPlan[i][0+i*4]>0)?'checked':''
    let check1=(this.state.chordPlan[i][1+i*4]>0)?'checked':''
    let check2=(this.state.chordPlan[i][2+i*4]>0)?'checked':''
    let check3=(this.state.chordPlan[i][3+i*4]>0)?'checked':''
    return (
      <div className="scaleBlock">
        <ChordChopperCheckBox
          type="checkbox"
          checked={check0}
          onClick={()=>this.changeChordChopper(0,i)}
          value={this.state.chordPlan[i][0+i*4]}
        />
        <ChordChopperCheckBox
          type="checkbox"
          checked={check1}
          onClick={()=>this.changeChordChopper(1,i)}
          value={this.state.chordPlan[i][1+i*4]}
        />
        <ChordChopperCheckBox
          type="checkbox"
          checked={check2}
          onClick={()=>this.changeChordChopper(2,i)}
          value={this.state.chordPlan[i][2+i*4]}
        />
        <ChordChopperCheckBox
          type="checkbox"
          checked={check3}
          onClick={()=>this.changeChordChopper(3,i)}
          value={this.state.chordPlan[i][3+i*4]}
        />
        <ChordNoteSelector
          color={this.state.blocksColor[i]}
          value={this.state.chordNotes[i]}
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
    let chordSelectors=[]
    const blockLength=4
    for(let i=0;i<blockLength;i++){
      chordSelectors.push(
        this.arrangeChordSelector(i)
      )
    }

    return(
      <div>
        {chordSelectors}
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
      list:Array(4).fill("7")
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

    //スケール構成音の情報を整理
    let noteInfo=[0,0,0,0]//'ActiveBaseNote','ActiveNote','NextBaseNote','NextNote',
    if(this.props.nowScale.indexOf(fletSound)===0){noteInfo[0]=1}
    if(this.props.nowScale.indexOf(fletSound)>0){noteInfo[1]=1}
    if(this.props.nextScale.indexOf(fletSound)===0){noteInfo[2]=1}
    if(this.props.nextScale.indexOf(fletSound)>0){noteInfo[3]=1}

    //スケール構成音に色付け
    if(noteInfo[0]>0){
      //構成音の場合
      fletLetter="●"
      noteClass="note noteBase"
    }else if(noteInfo[1]>0){
      noteClass="note"
      fletLetter="●"
    }else if(noteInfo[2]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteBase noteNext noteTrans"
      fletLetter="○"
    }else if(noteInfo[3]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteNext noteTrans"
      fletLetter="○"
    }else{
      noteClass="note noteTrans"
    }

    //次の音に向け、ステップの半分で見た目変化を開始
    if(this.props.step % 4 >1){
      console.log('change')
      if(noteInfo[0]+noteInfo[1]>0){
        //今Active
        if(noteInfo[2]>0){
          console.log()
        }else if(noteInfo[3]>0){
          console.log()
        }else{
          //次invalid
          if(noteInfo[0]>0){
            noteClass="note noteBase noteGone"
          }else if(noteInfo[1]>0){
            noteClass="note noteGone"
          }
        }
      }else{
        //今invalid
        if(noteInfo[2]>0){
          noteClass="note noteBase noteNext noteSlope"
        }else if(noteInfo[3]>0){
          noteClass="note noteNext noteSlope"
        }else{
          console.log()
        }
      }
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
      selectedScaleNoteList:Array(4).fill(9),
      selectedScaleTypeList:Array(4).fill("minorPentatonic"),
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
    let beat1m=Math.floor(this.props.step/4)
    let nextBeat1m=(beat1m>=3) ? 0 : beat1m+1
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
          step={this.props.step}
          nowScale={scaleProcessor(this.state.selectedScaleNoteList[beat1m],this.state.selectedScaleTypeList[beat1m])}
          nextScale={scaleProcessor(this.state.selectedScaleNoteList[nextBeat1m],this.state.selectedScaleTypeList[nextBeat1m])}
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
    //二重管理になっているが、Selectの初期値をセットしたいため。
    this.state={
      list:Array(4).fill("minorPentatonic")
    }
  }

  //props.onClick
  changeScaleByName(e){
    //console.log(e.target.value)
    this.props.onChangeScale(this.props.boxNum,e.target.value)

    //value変更用
    let list=this.state.list.slice()
    list[this.props.boxNum] = e.target.value
    this.setState({
      list:list
    })
  }



  render(){
    let scaleForSelect=[]
    for (let key in masterScale) {
      scaleForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    return(
      <select value={this.state.list[this.props.boxNum]} className="scaleTypeSelector" onChange={(e)=>this.changeScaleByName(e)}>
        {scaleForSelect}
      </select>
      //<button className={this.props.class} value={this.props.value} onClick={this.props.onClick}>{this.props.value}</button>
    )
  }
}

class ChordChopperCheckBox extends React.Component{
  constructor(props) {
    super(props);
  }
  render(){
    return(
      <input type="checkbox" checked={this.props.checked} value={this.props.value} onClick={this.props.onClick}></input>
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
