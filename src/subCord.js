//General Setting
import * as Tone from "tone";

export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const masterChord ={
  'M':[0,4,7],
  'm':[0,3,7],
  '7':[0,4,7,10],
  '5':[0,4],

}
export const masterScale = {
  'Major':[0,2,4,5,7,9,11],
  'minor':[0,2,3,5,7,8,10],
  'minorPentatonic':  [0,3,5,7,10],
  'MajorPentatonic':  [0,2,4,7,9],
  'Ryukyu':[0,4,5,7,11],
}

// ----------------------------------------

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

export const piano = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
  volume:-12,
}).toDestination();

export const eGuitar = new Tone.Sampler({
  urls: {
    C3:'GuitarC3.mp3',
    C4:'GuitarC4.mp3',
  },
  baseUrl: "./",
  volume:-10,
}).toDestination();

export const aGuitar = new Tone.Sampler({
  urls: {
    B2: "agB2.mp3",
    B3: "agB3.mp3",
    B4: "agB4.mp3",
  },
  baseUrl: "./",
  volume:-10,
}).toDestination();



export const stringNumToShift=[4,11,7,2,9,4]
export const positionMarkArray=
  [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,],
    [0,0,1,0,1,0,1,0,1,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,],
  ]

/*
F-G-Am
C-Am-F-G
Dm-G-C-A7
A7-D7
 */
