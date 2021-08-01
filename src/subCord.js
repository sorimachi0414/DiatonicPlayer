import * as Tone from "tone";

export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const chordTypeNameList=['M','m','5','7']

export const masterChord ={
  'M':[12,24+0,24+7,36+0,36+4,36+7],
  'test':[12,],
  'm':[24+0,24+7,36,36+3,36+7],
  '7':[24+0,24+7,24+10,36+0,36+4,36+7],
  '5':[24+0,24+4,36],
}

export const masterScale = {
  'Major':[0,2,4,5,7,9,11],
  'minor':[0,2,3,5,7,8,10],
  'm5t':  [0,3,5,7,10],
  'Ryukyu':[0,4,5,7,11],
}

export let sampler = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
  attack:0.5,
  release:0.5,
  volume:-12
}).toDestination();

export const guitar = new Tone.Sampler(
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

export const drum = new Tone.Sampler(
  {
    urls:{
      C3: "BD.mp3",
      C4: "SD.mp3",
      C5: "HHC.mp3",
    },
    baseUrl:"./",
  }
).toDestination();

// ---------------------------
// ---Sound Initial Setting
// Set sound
export const test = () => {drum.triggerAttackRelease(['C5'],'4n')}
export const BD = () => {drum.triggerAttackRelease(['C3'],'4n')}
export const SD = () => {drum.triggerAttackRelease(['C4'],'4n')}
export const HHC = () => {drum.triggerAttackRelease(['C5'],'4n')}

let chord1 = () => {sampler.triggerAttackRelease('C2','2n')}
let chord2 = () => {sampler.triggerAttackRelease('C2','2n')}
let chord3 = () => {sampler.triggerAttackRelease('C2','2n')}
let chord4 = () => {sampler.triggerAttackRelease('C2','2n')}

// Make Object
let testPart = new Tone.Part()
let BDPart = new Tone.Part()
let SDPart = new Tone.Part()
let HHCPart = new Tone.Part()

let melodyPart1 = new Tone.Part()
let melodyPart2 = new Tone.Part()
let melodyPart3 = new Tone.Part()
let melodyPart4 = new Tone.Part()

// bpm change methods
export function setPartBD(sched,bpm){
  BDPart=new Tone.Part(BD,sched.map(x=>x*60/bpm))
  BDPart.loop=true
  BDPart.loopEnd=4*4*60/bpm
  BDPart.start()
}

export function setPartSD(sched,bpm){
  SDPart=new Tone.Part(SD,sched.map(x=>x*60/bpm))
  SDPart.loop=true
  SDPart.loopEnd=4*4*60/bpm
  SDPart.start()
}

export function setPartHHC(sched,bpm){
  HHCPart=new Tone.Part(HHC,sched.map(x=>x*60/bpm))
  HHCPart.loop=true
  HHCPart.loopEnd=4*4*60/bpm
  HHCPart.start()
}

export function setMelodyPart1(sched,bpm){
  melodyPart1=new Tone.Part(chord1,sched.map(x=>x*60/bpm))
  melodyPart1.loop=true
  melodyPart1.loopEnd=4*4*60/bpm
  melodyPart1.start()
}

export function setMelodyPart2(sched,bpm){
  melodyPart2=new Tone.Part(chord2,sched.map(x=>x*60/bpm))
  melodyPart2.loop=true
  melodyPart2.loopEnd=4*4*60/bpm
  melodyPart2.start()
}

export function setMelodyPart3(sched,bpm){
  melodyPart3=new Tone.Part(chord3,sched.map(x=>x*60/bpm))
  melodyPart3.loop=true
  melodyPart3.loopEnd=4*4*60/bpm
  melodyPart3.start()
}

export function setMelodyPart4(sched,bpm){
  melodyPart4=new Tone.Part(chord4,sched.map(x=>x*60/bpm))
  melodyPart4.loop=true
  melodyPart4.loopEnd=4*4*60/bpm
  melodyPart4.start()
}

export function startParts(){
  melodyPart1.start()
  melodyPart2.start()
  melodyPart3.start()
  melodyPart4.start()
}

// Chord change methods
export function changeChord1(list){
  chord1 = () => {sampler.triggerAttackRelease(list,'2n')}
}

export function changeChord2(list){
  chord2 = () => {sampler.triggerAttackRelease(list,'2n')}
}

export function changeChord3(list){
  chord3 = () => {sampler.triggerAttackRelease(list,'2n')}
}

export function changeChord4(list){
  chord4 = () => {sampler.triggerAttackRelease(list,'2n')}
}

// Add soume method
export function partClear(){
  testPart.clear()
  BDPart.clear()
  SDPart.clear()
  HHCPart.clear()
  melodyPart1.clear()
  melodyPart2.clear()
  melodyPart3.clear()
  melodyPart4.clear()
}

// ----------------------------------------
/*
F-G-Am
C-Am-F-G
Dm-G-C-A7
A7-D7
 */

// ----------------------------------------
//Resouce
/*
*     //発音部
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
*
* */



//sampler=guitar
//sampler.volume.value = -10;
//drum.volume.value = 5;

/*
Tone.Transport.start();
const test = () => {drum.triggerAttackRelease(['C5'],'4n')}
let testPart = new Tone.Part(test,this.state.hhcSched.map(x=>(x*60/this.state.bpm)))
testPart.clear()
testPart = new Tone.Part(test,this.state.hhcSched.map(x=>(x*60/this.state.bpm)))
//testPart.add(this.state.hhcSched.map(x=>(x*60/this.state.bpm)))
testPart.start()
testPart.loop=true
testPart.loopEnd=4*4*60/this.state.bpm
 */