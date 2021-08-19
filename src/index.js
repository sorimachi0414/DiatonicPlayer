import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Tone from "tone";
import * as Def from "./subCord.js"
import 'bootstrap/dist/css/bootstrap.min.css';
//import MediaQuery from "react-responsive"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container'
import { combineReducers } from 'redux';


////debug
import { createStore, combideReducers } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
//import App from './App';
import { connect } from 'react-redux';
//import Counter_func from './components/Counter_func';
import {stateManager} from "./reducers/counter";

///debug content
const reducer = () => combineReducers({
  stateManager,
});

const store = createStore(reducer());

const bpmChangeType = (value)=>{
  return {
    type:'BPM',
    value
  }
}
const playStopType = ()=>{
  return{
    type:'PLAY_STOP',
  }
}

const countUp = (value) => {
  return {
    type: 'COUNT_UP',
    value
  };
}

const countDown = (value) => {
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
    isPlay: state.stateManager.base.isPlay,
    isPlayLabel: state.stateManager.base.isPlayLabel,
    bpm:state.stateManager.base.bpm,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    bpmChange:function (value){
      return dispatch(bpmChangeType(value))
    },
    countUp: function (value) {
      return dispatch(countUp(value));
    },
    countDown: function (value) {
      return dispatch(countDown(value));
    },
    playStopDispatch: function(){
      return dispatch(playStopType())
    }
  };
};

let Counter_funcs = connect(mapStateToProps, mapDispatchToProps)(Counter);

ReactDOM.render(
  <Provider store={store}>
    <Counter_funcs />
  </Provider>,
  document.getElementById('root')
);


// ----------------------------------------
//スマートフォンでのダブルタップ抑制
document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
const tickTackInterval='24n'
const stepNum=96
let fretNum=15
const strings=6

const soundNameList=Def.soundNameList
const masterChord=Def.masterChord
const masterScale=Def.masterScale
const drum = Def.drum
let instrument=Def.instList['organ']

const BD = (en,time) => {if(en>0)drum.triggerAttackRelease(['C3'],'1m',time)}
const SD = (en,time) => {if(en>0)drum.triggerAttackRelease(['C4'],'1m',time)}
const HHC = (en,time) => {if(en>0)drum.triggerAttackRelease(['C5'],'1m',time)}

function playThisChord(chordList,length,time){
  if(length!=0) instrument.triggerAttackRelease(chordList, length,time)
}

function playStopSwitch(status){
  Def.organ.context.resume();
  Def.drum.context.resume();
  Def.piano.context.resume();
  Def.eGuitar.context.resume();
  Def.aGuitar.context.resume();
  (status==1)?Tone.Transport.start():Tone.Transport.stop();
}

function exPlan16to48(argList){
  let list
  if(argList.length>16){
    list=argList
  }else{
    list=Array(stepNum).fill(0)
    for(let i=0;i<argList.length;i++){
      list[i*6] = argList[i]
    }
  }
  return list
}


// ----------------------------------------
class MainClock extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      chordList:[['A2','A3','C#3','E3','G3',],['A2','A3','C#3','E3','G3',],['D2','D3','F#3','A3','C3'],['D2','D3','F#3','A3','C3']],
      chordNotes:[9,9,2,2],
      chordTypes:Array(4).fill('07_7'),
      blocksColor:Array(4).fill("btn btn-outline-primary w-100"),
      bdPlan  :Def.rhythmList["Rock"]["BD"],
      sdPlan  :Def.rhythmList["Rock"]["SD"],
      hhcPlan :Def.rhythmList["Rock"]["HHC"],
      chordPlan:[
        ['1m',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
        [0,0,0,0,'1m',0,0,'4n',0,0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,'1m',0,0,0,0,0,0,0,],
        [0,0,0,0,0,0,0,0,0,0,0,0,'1m',0,0,0,],
      ],
      color:"chordSelector",
      step:stepNum-1,
      nextStep:0,
      bpm:120,
      isPlay:0,
    };
    this.tickTack = this.tickTack.bind(this);
    this.changePlayStatus = this.changePlayStatus.bind(this);

    //発音部
    Tone.Transport.scheduleRepeat((time) => {
      //Call Back
      this.tickTack()
      for(let n=0;n<4;n++){
        playThisChord(this.state.chordList[n],exPlan16to48(this.state.chordPlan[n])[this.state.step],time)
      }
      BD(exPlan16to48(this.state.bdPlan)[this.state.step],time)
      SD(exPlan16to48(this.state.sdPlan)[this.state.step],time)
      HHC(exPlan16to48(this.state.hhcPlan)[this.state.step],time)
    }, tickTackInterval, "0m");
  }
  componentDidMount(){
    document.title = "Solo Jam session Sequencer"
    this.localStorageIO(0)
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    this.localStorageIO(1)
  }

  //CallBack
  tickTack() {
    Tone.Transport.bpm.value = this.state.bpm//*(stepNum/16);
    let step=this.state.step
    step = (step>=stepNum-1) ? 0:step+1
    let nextStep= (step>=stepNum-1) ? 0 : step+1
    //Display Change
    this.changeColor(~~(step/(stepNum/4)))
    this.setState({
      step:step,
      nextStep:nextStep
    })
  }
  localStorageIO(bool){
    let ls=localStorage
    if(bool){
      ls.setItem('chordNotes', JSON.stringify(this.state.chordNotes));
      ls.setItem('chordTypes', JSON.stringify(this.state.chordTypes));
      ls.setItem('chordPlan', JSON.stringify(this.state.chordPlan));
      ls.setItem('chordList', JSON.stringify(this.state.chordList));
      ls.setItem('bpm', JSON.stringify(this.state.bpm));
    }else{
      if ("chordNotes" in ls) this.setState({chordNotes:JSON.parse(ls.getItem('chordNotes'))})
      if ("chordTypes" in ls) this.setState({chordTypes:JSON.parse(ls.getItem('chordTypes'))})
      if ("chordPlan" in ls)  this.setState({chordPlan:JSON.parse(ls.getItem('chordPlan'))})
      if ("chordList" in ls)  this.setState({chordList:JSON.parse(ls.getItem('chordList'))})
      if ("bpm" in ls)  this.setState({bpm:JSON.parse(ls.getItem('bpm'))})
    }
  }

  changePlayStatus(){
    let isPlay = (this.props.isPlay === 1) ? 0 : 1
    //this.setState({isPlay:isPlay,})
    if (isPlay==1) {
      this.props.dispatch({type: 'Play'});
    }else{
      this.props.dispatch({type: 'Stop'});

    }
    playStopSwitch(isPlay)
  }

  makeChordString(i) {
    let chordList=this.state.chordList.slice()
    let shift = this.state.chordNotes[i] //0,1,2,...
    let keyOfSelectedChordType = this.state.chordTypes[i] //M,m,m7,...

    //コード種別を変更
    let chordTones = masterChord[keyOfSelectedChordType]

    //ピッチをシフト
    let chordTonesShifted=chordTones.map(x => (x+shift) %12)

    //convert Number to Alphabet
    chordList[i] = chordTonesShifted.map(x =>soundNameList[x]+'3')

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
      let chordNotes=this.state.chordNotes.slice()
      chordNotes[i]=(chordNotes[i]+val<0) ? 11:(chordNotes[i]+val)%12

      this.setState({
        chordNotes:chordNotes,
      })
      chordTones = masterChord[this.state.chordTypes[i]]
      shift = chordNotes[i] //0,1,2,...
    }else if (typeof val== 'string'){
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
    chordList[i]=chordTonesShifted.map(x =>soundNameList[x]+'3')
    this.setState({
      chordList:chordList
    })
    //this.localStorageIO(1)
  }

  //アクティブなステップ（コード）を着色
  changeColor(i){
    //i=Math.floor(i/4)
    let blocksColor=Array(4).fill("btn btn-outline-primary h-100 w-100")
    blocksColor[i]="btn btn-warning h-100 w-100"
    this.setState({
      blocksColor:blocksColor,
    })
  }

  changeChordChopper(note,bar){
    // You may shrink code
    let chordPlan=this.state.chordPlan.slice()
    let oneBar = chordPlan[bar].slice()

    //1小節毎に処理
    let status =oneBar[note+bar*4] //今の値
    oneBar[note+bar*4]= (status==0)?'4n':0  //クリックした値を更新

    let oneBarThis = oneBar.slice(0+bar*4,4+bar*4)

    function arrayToByte(list){
      let byte=0
      for(let i in list){
        byte = (list[i]!=0) ? byte+2**(3-i):byte
      }
      return byte
    }

    //oneBarを置換
    oneBar.splice(0+bar*4,4,...Def.chordChopLength[arrayToByte(oneBarThis)])

    chordPlan[bar] = oneBar
    this.setState({chordPlan:chordPlan,})
  }

  //コードブロックを配置
  arrangeChordSelector(i){
    let check0=(this.state.chordPlan[i][i*4]!=0)?'checked':''
    let check1=(this.state.chordPlan[i][1+i*4]!=0)?'checked':''
    let check2=(this.state.chordPlan[i][2+i*4]!=0)?'checked':''
    let check3=(this.state.chordPlan[i][3+i*4]!=0)?'checked':''
    return (
     <Col xs={3} key={i}>
       <Row>
         <Col xs={12}  className="mx-0 px-0">
          <ChordChopperCheckBox
            key={'CC1c'+i}
            type="checkbox"
            checked={check0}
            onClick={()=>this.changeChordChopper(0,i)}
            value={this.state.chordPlan[i][i*4]}
          />
          <ChordChopperCheckBox
            key={'CC2c'+i}
            type="checkbox"
            checked={check1}
            onClick={()=>this.changeChordChopper(1,i)}
            value={this.state.chordPlan[i][1+i*4]}
          />
          <ChordChopperCheckBox
            key={'CC3c'+i}
            type="checkbox"
            checked={check2}
            onClick={()=>this.changeChordChopper(2,i)}
            value={this.state.chordPlan[i][2+i*4]}
          />
          <ChordChopperCheckBox
            key={'CC4c'+i}
            type="checkbox"
            checked={check3}
            onClick={()=>this.changeChordChopper(3,i)}
            value={this.state.chordPlan[i][3+i*4]}
          />
         </Col>
         <Col xs={12} sm={12}>
            <ThreeButtonChanger
              key={'cns'+i}
              color={this.state.blocksColor[i]}
              value={soundNameList[this.state.chordNotes[i]]}
              onClick={() => this.changeChord(i,1)}
              onClickP={() => this.changeChord(i,1)}
              onClickN={() => this.changeChord(i,-1)}
            />
            <ListedSelector
              chordOrScale={'Chord'}
              key={'cts'+i}
              initList={this.state.chordTypes}
              optionList={masterChord}
              class={"scaleTypeSelector"}
              boxNum={i}
              value={masterChord[this.state.chordTypes[i]]}
              onChange={(i,e) => this.changeChord(i,String(e))}
            />
         </Col>
       </Row>
    </Col>
    );
  }

  changeBPM(diff){
    this.setState({bpm:this.state.bpm +diff,})
  }

  changeInstP(e){
    instrument=Def.instList[e]
  }

  changeDrum(e){
    this.setState({
      bdPlan  :Def.rhythmList[e]["BD"],
      sdPlan  :Def.rhythmList[e]["SD"],
      hhcPlan :Def.rhythmList[e]["HHC"],
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
        <Container fluid>
          <Row className="justify-content-center mb-5">
            <Col  xs={12} md={10} className="text-center">
              "Solo Jam session" Sequencer
            </Col>
            <Col xs="12" sm={12} md={10} lg={8} xl={6} className="px-0">
              <div className="card my-2">
                <div className="card-header">
                  Chord Selector
                </div>
                <Row className="card-body pt-1">
                  <Col  xs={2} sm={2} className="mx- 0px-0 align-self-center text-center">
                    Tone
                  </Col>
                  <Col xs={4} sm={3} className="p-2">
                    <DropDownSelector
                      change={(e)=>this.changeInstP(e)}
                      optionList={Def.instList}
                      initValue={'organ'}
                    />
                  </Col>

                  <Col  xs={2} sm={2} className="px-0 align-self-center text-center">
                    Drum
                  </Col>
                  <Col xs={4} sm={3} className="p-2">
                    <DropDownSelector
                      change={(e)=>this.changeDrum(e)}
                      optionList={Def.rhythmList}
                      initValue={'Rock'}
                    />
                  </Col>
                </Row>
                <Row className='card-body pt-1'>
                  {chordSelectors}
                </Row>
              </div>
              <div className="card my-2">
                <div className="card-header">
                  Scale Selector
                </div>
                <div className="card-body pt-1">
                  <ScaleSelector
                    key="scaleSelector"
                    blocksColor={this.state.blocksColor}
                    step={this.state.step}
                    nextStep={this.state.nextStep}
                  />
                </div>
                <div className="d-block d-sm-none">xs 576px</div>
                <div className="d-none d-sm-block d-md-none">sm >576px</div>
                <div className="d-none d-md-block d-lg-none">md >768px</div>
                <div className="d-none d-lg-block d-xl-none">lg >992px</div>
                <div className="d-none d-xl-block">xl >1200px</div>
              </div>
            </Col>

          </Row>

        </Container>

        <Container>
          <Row className="navbar navbar-light bg-light fixed-bottom">
            <Col xs={12} sm={10} md={8} lg={6} className="offset-sm-1 offset-md-2 offset-lg-3">
              <Row className="px-1 mx-0">
                <Col xs={3} md={3} className="mx-0 px-0">
                  <Provider store={store}>
                  <PlayStopButton_func
                    //key="pb"
                    //isPlay={this.props.isPlay}
                    //class="btn btn-primary fs-2 w-100 px-0"
                    //onClick={this.changePlayStatus}
                  />
                  </Provider>
                </Col>
                <Col xs={8} md={8} className='align-self-center px-1'>
                  <BPMChanger_func
                    //key="bpmC"
                    //bpm={this.state.bpm}
                    //p10={()=>this.changeBPM(10)}
                    //p1={()=>this.changeBPM(1)}
                    //n1={()=>this.changeBPM(-1)}
                    //n10={()=>this.changeBPM(-10)}
                  />
                </Col>
              </Row>
            </Col>

      </Row>
        </Container>
      </div>
    )
  }
}
MainClock = connect()(MainClock);

class ListedSelector extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      selectedType:this.localStorageIOListed(0),
    }
      //list:this.props.initList  //二重管理になっているが、Selectの初期値をセットしたいため。
  }

  localStorageIOListed(bool) {
    let ls = localStorage
    let key = 'list'+this.props.boxNum+this.props.chordOrScale
    let result = this.props.initList[this.props.boxNum]
    if (bool) {
      //Write to localStorage
      ls.setItem(key, this.state.selectedType);
    } else {
      //Read from localStorage
      if (key in ls){
        result =String(ls.getItem(key))
        this.setState({
          selectedType:result,
        })
      }
      return result
    }
  }

  componentDidMount() {
    console.log('DidMount')
    this.props.onChange(this.props.boxNum,this.localStorageIOListed(0))
    if(this.props.chordOrScale=='Scale') {this.props.readStorage()}
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    this.localStorageIOListed(true)
  }


  changeChordByName(e){
    this.props.onChange(this.props.boxNum,e.target.value)
    this.setState({
      selectedType:String(e.target.value),
    })
  }

  render(){
    let options=[]
    for (let key in this.props.optionList) {
      options.push(
        <option key={key} value={key}>{key.substr(3,key.length)}</option>
      )
    }
    return(
      //valueがSelectの初期値となる。valueが入っていると、他に変更してもValueに戻る。
      <select size={3} defaultValue={this.state.selectedType} className="form-select p-1" onClick={(e)=>this.changeChordByName(e)}>
        {options}
      </select>
    )
  }
}


function scaleProcessor(key,type){
  return masterScale[type].map(x => (x+key) % 12)
}

class DropDownSelector extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      selected:this.props.initValue
    }
  }
  change(e){
    this.props.change(e.target.value)
    this.setState({
      selected:e.target.value
    })
  }

  render(){
    let options=[]
    for(let key in this.props.optionList){
      options.push(
        <option key={key} value={key}>{key}</option>
      )
    }
    return(
      <select defaultValue={this.state.selected} className="form-select w-100" onChange={(e)=>this.change(e)}>
        {options}
      </select>
    )
  }
}

class ScaleSelector extends React.Component{
  constructor(props) {
    super(props);
    this.changeScaleType=this.changeScaleType.bind(this)
    this.state={
      displayCircle:1,
      scaleBlocksColor:Array(4).fill("btn btn-outline-primary w-100"),
      selectedScaleNoteList:Array(4).fill(9),
      selectedScaleTypeList:Array(4).fill("04_minorPentatonic"),
    }
    this.changeCircle = this.changeCircle.bind(this);
    this.changeScaleFromStorage = this.changeScaleFromStorage.bind(this);
  };
  componentDidMount(){
    this.localStorageScaleIO(0)
  }
  componentDidUpdate(prevProps, prevState, snapshot){
    this.localStorageScaleIO(1)
  }

  localStorageScaleIO(bool){
    let ls = localStorage
    let key='selectedScaleNoteList'
    if(bool){
      //1 Write
      ls.setItem(key,JSON.stringify(this.state.selectedScaleNoteList))
    }else{
      //0 Read
      if ("selectedScaleNoteList" in ls) this.setState({selectedScaleNoteList:JSON.parse(ls.getItem('selectedScaleNoteList'))})
    }
  }


  changeCircle(){
    let displayCircle=this.state.displayCircle
    displayCircle = (displayCircle>0) ? 0 :1
    this.setState({
      displayCircle:displayCircle,
    })
  }

  changeScaleTone(i,val){
    //コードブロックの数字をインクリメント
    let list = this.state.selectedScaleNoteList.slice()
    list[i] = (list[i]+val>=12) ? 0 : (list[i]+val<0) ? 11 : list[i]+val
    this.setState({selectedScaleNoteList:list})
  }

  changeScaleFromStorage(){
    let ls=localStorage
    if('list0Scale' in ls){
      let list=[
        ls.getItem('list0Scale'),
        ls.getItem('list1Scale'),
        ls.getItem('list2Scale'),
        ls.getItem('list3Scale'),
      ]
      this.setState({
          selectedScaleTypeList:list,
        }
      )
    }


  }

  changeScaleType(num,arg){
    let list = this.state.selectedScaleTypeList.slice()
    list[num]=arg
    console.dir(list)
    this.setState({
      selectedScaleTypeList:list
      }
    )
  }

  repeatSelector(i){
    return(
        <Col key={i} xs={3}>
          <ThreeButtonChanger

            class={"scaleNoteSelector"}
            color={'btn btn-outline-primary w-100'}
            color={this.props.blocksColor[i]}

            value={soundNameList[this.state.selectedScaleNoteList[i]]}
            onClickP={() => this.changeScaleTone(i,1)}
            onClickN={() => this.changeScaleTone(i,-1)}
          />
          <ListedSelector
            chordOrScale={'Scale'}
            initList={Array(4).fill("04_minorPentatonic")}
            optionList={masterScale}
            class={"scaleTypeSelector"}
            boxNum={i}
            //value={scaleTypeNameList[this.state.selectedScaleTypeList[i]]}
            value={masterScale[this.state.selectedScaleTypeList[i]]}
            onChange={(i,e) => this.changeScaleType(i,e)}
            readStorage={this.changeScaleFromStorage}
          />

        </Col>

    )
  }

  render(){
    //definition
    //let beat1m=Math.floor(this.props.step/4)
    let beat1m=~~(this.props.step/(stepNum/4))
    let nextBeat1m=(beat1m>=3) ? 0 : beat1m+1
    let selectors=[]
    const selectorLength=4
    for(let i=0;i<selectorLength;i++){
      selectors.push(
        this.repeatSelector(i)
      )
    }
    return(
      <Row>
        {selectors}
        <FingerBoard
          fretNum={fretNum}
          step={this.props.step}
          nowScale={scaleProcessor(this.state.selectedScaleNoteList[beat1m],this.state.selectedScaleTypeList[beat1m])}
          nextScale={scaleProcessor(this.state.selectedScaleNoteList[nextBeat1m],this.state.selectedScaleTypeList[nextBeat1m])}
          displayCircle={this.state.displayCircle}
        />
        <Col xs={12} sm={6}>
          <button
            className="btn btn-outline-success"
            onClick={this.changeCircle}
          >
            change Circle to Number
          </button>
        </Col>
        <Col xs={12} sm={6}>
          <button
            className="btn btn-outline-warning"
            onClick={()=>localStorage.clear()}
          >
            Reset save data
          </button>
        </Col>
      </Row>
    )
  }
}

class ChordChopperCheckBox extends React.Component{
  //  constructor(props) {
  //    super(props);
  //  }
  render(){
    return(
      <input className="form-check-input m-05 p-sm-2 mx-sm-1" type="checkbox" checked={this.props.checked} value={this.props.value} onChange={this.props.onClick} />
    )
  }
}

class ThreeButtonChanger extends  React.Component{
  //  constructor(props) {
  //    super(props);
  //  }

  render(){
    return(
      <Row className="p-2 ">
        <Col sm={3} md={3} className="p-0 m-0">
          <button className="btn btn-outline-primary p-0 w-100 h-100" value={this.props.value} onClick={this.props.onClickN}>{"<"}</button>
        </Col>
        <Col sm={6} md={6} className="p-0 m-0 ">
          <button className={this.props.color} value={this.props.value} onClick={this.props.onClickP}><span className="fs-2"> {this.props.value}</span></button>
        </Col>
        <Col sm={3} md={3} className="p-0 m-0">
          <button className="btn btn-outline-primary p-0 w-100 h-100" value={this.props.value} onClick={this.props.onClickP}>{">"}</button>
        </Col>
      </Row>
    )
  }
}

const PlayStopButton = (props)=>{
  const { isPlayLabel} = props;
  const playStopSwitch=()=>{
    props.playStopDispatch()
  }

  return (
    <button onClick={(e) => { playStopSwitch(); }} className={''}>
      {isPlayLabel}
    </button>
  )
}
const PlayStopButton_func=　connect(mapStateToProps, mapDispatchToProps)(PlayStopButton);



const BPMChanger=(props)=>{
  return(
    <Row className="mx-0">
      <Col className="col-2 px-1">
        <button className="btn btn-outline-success border-1 p-0 w-100 h-100" onClick={()=>props.bpmChange(-10)}>-10</button>
      </Col>
      <Col className="col-2  px-1">
      <button className="btn btn-outline-success border-1  p-0 w-100 h-100" onClick={()=>{props.bpmChange(-1)}}>-1</button>
      </Col>
      <Col className="col-4 px-1 text-center">
      <span className="fw-bolder fs-4">bpm</span>
      <span className="text-info fw-bolder fs-4">{props.bpm}</span>
      </Col>
      <Col className="col-2  px-1">
      <button className="btn btn-outline-success border-1  p-0 w-100 h-100" onClick={()=>{props.bpmChange(1)}}>+1</button>
      </Col>
      <Col className="col-2  px-1">
      <button className="btn btn-outline-success border-1 p-0 w-100 h-100" onClick={()=>{props.bpmChange(10)}}>+10</button>
      </Col>
    </Row>
  )
}

const BPMChanger_func=　connect(mapStateToProps, mapDispatchToProps)(BPMChanger);

class FingerBoard extends React.Component{
  constructor(props) {
    super(props);
 }

  //各弦の各フレットを配置
  arrangeFingerElements(i,j) {
    let stringShift
    let noteClass
    let fretLetter

    //ポジションマーク
    let positionMark = (Def.positionMarkArray[i][j]>0) ? <div className="circle" /> : ""
    let fretClass = j===0 ? "square nut" : "square"

    //各フレットを音名に変換、スケールと照合
    stringShift=Def.stringNumToShift[i]

    //各フレットを音階に変換　C=0
    let fretSound=(stringShift+j+1) % 12

    //スケール構成音の情報を整理
    let noteInfo=[0,0,0,0]//'ActiveBaseNote','ActiveNote','NextBaseNote','NextNote',
    if(this.props.nowScale.indexOf(fretSound)===0)  noteInfo[0]=1
    if(this.props.nowScale.indexOf(fretSound)>0){
      //noteInfo[1]=Def.noteColorList[fretSound]
      noteInfo[1]=1
    }
    if(this.props.nextScale.indexOf(fretSound)===0) noteInfo[2]=1
    if(this.props.nextScale.indexOf(fretSound)>0)   noteInfo[3]=1

    //スケール構成音に色付け
    if(noteInfo[0]>0){
      //構成音の場合
      noteClass="note noteBase"
      fretLetter="●"
    }else if(noteInfo[1]!=0){
      noteClass="note "
      noteClass+=noteInfo[1]
      fretLetter="●"
    }else if(noteInfo[2]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteBase noteNext noteTrans"
      fretLetter="○"
    }else if(noteInfo[3]>0){
      //次のスケールの音の場合、予告
      noteClass="note noteNext noteTrans"
      fretLetter="○"
    }else{
      noteClass="note noteTrans"
    }

    //次の音に向け、ステップの半分で見た目変化を開始
    let beat1m=~~(this.props.step/(stepNum/(4*4)))
    if(beat1m % 4 >1){
      if(noteInfo[0]!=0 || noteInfo[1]!=0){
        //今Active
        if(noteInfo[2]>0){
          ;
        }else if(noteInfo[3]>0){
          ;
        }else{
          //次invalid
          if(noteInfo[0]>0){
            noteClass="note noteBase noteGone"
          }else if(noteInfo[1]!=0){
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
          ;
        }
      }
    }
    fretClass +=' wd-'+j

    //fretLetterを数字に変更
    if (this.props.displayCircle!=1){
      let keyNote=this.props.nowScale[0]
      fretLetter=(fretSound-keyNote+12 )%12
    }
    return(
        <div key={'p'+i+'and'+j} className={fretClass} >
          <div key={i*100} className={noteClass}>{fretLetter}</div>
          {positionMark}
        </div>
    )
  }

  addFretNumber(i){
    let tempClass ='squareFretNumber fs-6'
    tempClass +=' wd-'+i
    return(
      <div key={i} className={tempClass} >{i+1}</div>
    )
  }

  render() {
    let eachStrings = []
    let fingerElements

    //各弦のフレットを表示
    for (let i = 0; i < strings; i++) {
      let fingerElements = []
      //１フレット毎、配列にプールしていく
      for (let j = 0; j < fretNum; j++) {
        fingerElements.push(
          this.arrangeFingerElements(i, j)
        )
      }
      eachStrings.push(fingerElements)
    }

    //フレット番号表示
    fingerElements = []

    for (let n = 0; n < fretNum; n++) {
      fingerElements.push(
        this.addFretNumber(n)
      )
    }
    eachStrings.push(fingerElements)

    return(
    /**/
      <div className="pt-4">
        <div className="next-row">{eachStrings[0]}</div>
        <div className="next-row">{eachStrings[1]}</div>
        <div className="next-row">{eachStrings[2]}</div>
        <div className="next-row">{eachStrings[3]}</div>
        <div className="next-row">{eachStrings[4]}</div>
        <div className="next-row">{eachStrings[5]}</div>
        <div className="next-row">{eachStrings[6]}</div>
      </div>
    /**/
  )
  }
}

// ----------------------------------------

ReactDOM.render(
  <Provider store={store}>
    <MainClock />
  </Provider>,
  document.getElementById('root')
);
//<MainClock />,
