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

export const sampler = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
  volume:-12,
}).toDestination();


/*
F-G-Am
C-Am-F-G
Dm-G-C-A7
A7-D7
 */
