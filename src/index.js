import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";
import * as Def from "./subCord.js"

// ----------------------------------------
//General Setting
const soundNameList=Def.soundNameList
const chordTypeNameList=Def.chordTypeNameList
const masterChord=Def.masterChord
const masterScale = Def.masterScale

const sampler =Def.sampler
const guitar = Def.guitar
const drum = Def.drum

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

Tone.Transport.start();
const test = () => {drum.triggerAttackRelease(['C5'],'4n')}
let testPart = new Tone.Part(test,[0,1,2])
testPart.loop=true
testPart.loopEnd=4*4*60/100
testPart.start()

function partClear(){
  testPart.clear()
}
function setPart(sched,bpm){
  //testPart.add(3)
  testPart=new Tone.Part(test,sched.map(x=>x*60/bpm))
  testPart.loop=true
  testPart.loopEnd=4*4*60/bpm
  testPart.start()
}

// ----------------------------------------
class MainClock extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chordActives:Array(4).fill(0),
      chordList:Array(4).fill(["C3","G3","C4", "E4","G4",]),
      chordNotes:Array(4).fill(36),
      chordTypes:Array(4).fill("M"),
      blocksColor:Array(4).fill("chordSelector"),
      beat:0,
      nextBeat:1,
      bpm:100,
      all8nSched:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      bdSched:[0,4,8,12],
      sdSched:[2,6,10,14],
      hhcSched:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
      chord1Sched:[0,],
      chord2Sched:[4,],
      chord3Sched:[8,],
      chord4Sched:[12,],
    };
    this.every8nCallback = this.every8nCallback.bind(this);

    function settingPart(sound,schedule,bpm){
      let absSchedule = schedule.map(x => x*60/bpm)
      let partObject = new Tone.Part(sound,absSchedule).start()
      partObject.loop=true
      partObject.loopEnd=4*4*60/bpm; //ものによって1mの長さが異なるので、絶対時間で定義する
      return partObject
    }

    Tone.Transport.bpm.value = this.state.bpm;

    const KK = () => {drum.triggerAttackRelease(['C3'],'4n')}
    const SD = () => {drum.triggerAttackRelease(['C4'],'4n')}
    const HHC = () => {drum.triggerAttackRelease(['C5'],'4n')}

    let chord1 = () => {sampler.triggerAttackRelease(this.state.chordList[0],'2n')}
    let chord2 = () => {sampler.triggerAttackRelease(this.state.chordList[1],'2n')}
    let chord3 = () => {sampler.triggerAttackRelease(this.state.chordList[2],'2n')}
    let chord4 = () => {sampler.triggerAttackRelease(this.state.chordList[3],'2n')}

    let RhythmMaster = new Tone.Part(this.every8nCallback,this.state.all8nSched.map(x=>x*60/this.state.bpm)).start()
    RhythmMaster.loop=true
    RhythmMaster.loopEnd=4*4*60/this.state.bpm;

    //let KKPart = settingPart(KK,this.state.bdSched,this.state.bpm)
    //let SDPart = settingPart(SD, this.state.sdSched,this.state.bpm)
    //let HHCPart = this.settingPartNew(HHC, this.state.hhcSched,this.state.bpm)
    //let melodyPart1 = settingPart(chord1, this.state.chord1Sched,this.state.bpm)
    //let melodyPart2 = settingPart(chord2, this.state.chord2Sched,this.state.bpm)
    //let melodyPart3 = settingPart(chord3, this.state.chord3Sched,this.state.bpm)
    //let melodyPart4 = settingPart(chord4, this.state.chord4Sched,this.state.bpm)

    //let HHCPart = new Tone.Part(HHC,[0])
    //HHCPart.add(this.state.bpm/40)
    //HHCPart.start()

    /*
    let part = new Tone.Part(HHC,[0,1])
    //part.add(2)
    //part.add(3)
    part =new Tone.Part(HHC,[3,4])
    //part.at([2,3,4])
    part.start()
     */
  }
  //End of Construnctor

  settingPartNew(sound,schedule,bpm){
    let absSchedule = schedule.map(x => x*60/this.state.bpm)
    //let partObject = new Tone.Part(sound,absSchedule).start()
    let partObject = new Tone.Part(sound).start()
    partObject.loop=true
    partObject.loopEnd=4*4*60/bpm; //ものによって1mの長さが異なるので、絶対時間で定義する
    return partObject
  }

  testy(){
    partClear()
    setPart(this.state.hhcSched,this.state.bpm)
    console.log('testy')

  }

  every8nCallback(){
    let beat = this.state.beat
    let nextBeat = this.state.nextBeat
    function incrementBeat(b){
      b = (b>=15) ? 0:b+1
      return b
    }
    beat= incrementBeat(beat)
    nextBeat= incrementBeat(nextBeat)
    this.setState({
      beat:beat,
      nextBeat:nextBeat,
    })
  }

  //------------------------------------------------
  changeChord(i,val) {
    //val = chordNote or chordType
    // val = 3 => D# , val = 'm7' => minor 7th Chord
    let shift,chordTones
    if (typeof val== 'number'){
      //Chord Note
      let list = this.state.chordNotes.slice()
      let chordNotes=this.state.chordNotes.slice()
      chordNotes[i] = chordNotes[i]+val
      chordNotes[i] = chordNotes[i]<0 ? 0:chordNotes[i]
      this.setState({
        chordNotes:chordNotes,
      })
      chordTones = masterChord[this.state.chordTypes[i]]
      shift = chordNotes[i] //0,1,2,...
      console.log(shift)
    }else if (typeof val== 'string'){
      //Chord Type
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
    chordList[i] = chordTonesShifted
    this.setState({
      chordList:chordList
    })

  }

  //コードブロックを配置
  arrangeBlock(i){
    const chordSelectorClass=['chordSelector','chordSelectorActive']
    let chordForSelect=[]
    for (let key in masterChord) {
      chordForSelect.push(
        <option value={key}>{key}</option>
      )
    }
    let chordSelectorClassIndex=0

    //beatを取得して、アクティブかどうか判定
    if(Math.floor(this.state.beat/4)==i){
      chordSelectorClassIndex=1
    }
    return (
      <div className="scaleBlock">
        <ChordNoteSelector
          class={chordSelectorClass[chordSelectorClassIndex]}
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
    let bpm =this.state.bpm +diff
    this.setState({
      bpm:bpm,
    })
    this.testy()
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
          //onClick={()=>this.testy()}
        />
        <PlayButton
          onClick={()=>this.testy()}
          //onClick={()=>this.testy()}
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
          beat={this.state.beat}
          nextBeat={this.state.nextBeat}
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
    //i=string, j=flet
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
    if(this.props.beat % 4 >1){
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
    let beat = this.props.beat
    let barIndex = Math.floor(this.props.beat /4)
    let nextBarIndex = (barIndex>=3) ? 0:barIndex+1

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
          beat={beat}
          nowScale={scaleProcessor(this.state.selectedScaleNoteList[barIndex],this.state.selectedScaleTypeList[barIndex])}
          nextScale={scaleProcessor(this.state.selectedScaleNoteList[nextBarIndex],this.state.selectedScaleTypeList[nextBarIndex])}
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

  changeScaleByName(e){
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
        <button className={this.props.class} value={this.props.value} onClick={this.props.onClick}>{soundNameList[this.props.value%12]}</button>
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
