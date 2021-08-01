import * as Tone from "tone";

export const masterChord ={
  'M':[12,24+0,24+7,36+0,36+4,36+7],
  'test':[12,],
  'm':[24+0,24+7,36,36+3,36+7],
  '7':[24+0,24+7,24+10,36+0,36+4,36+7],
  '5':[24+0,24+4,36],
}
export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const chordTypeNameList=['M','m','5','7']
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