//General Setting
import * as Tone from "tone";

export const tickTackInterval='24n'
export const stepNum=96
export const fretNum=15
export const strings=6

export const defaultState={
  "isPlay":false,"isPlayLabel":"Play","bpm":130,"inst":"organ","drum":"Rock","step":0,"nextStep":1,"beat1m":0,"nextBeat1m":1,
  "bdPlan":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
  "sdPlan":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
  "hhcPlan":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  "chordList":[["A3","C#3","E3","G3","A2"],["A3","C#3","E3","G3","A2"],["D3","F#3","A3","C3","D2"],["D3","F#3","A3","C3","D2"]],
  "chordPlan":[["1m",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,"1m",0,0,"4n",0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,"1m",0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,"1m",0,0,0]],
  "blocksColor":["btn btn-warning h-100 w-100","btn btn-outline-primary h-100 w-100","btn btn-outline-primary h-100 w-100","btn btn-outline-primary h-100 w-100"],"typesOfChords":["07_7","07_7","07_7","07_7"],"rootNoteOfChords":[9,9,2,2],"displayCircle":true,"scaleBlocksColor":["btn btn-outline-primary w-100","btn btn-outline-primary w-100","btn btn-outline-primary w-100","btn btn-outline-primary w-100"],"rootNoteOfScale":[9,9,9,9],"typeOfScale":["04_minorPentatonic","04_minorPentatonic","04_minorPentatonic","04_minorPentatonic"],
  "rawScaleNoteList":[[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7]]}

export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const masterChord ={
  '01_M':[0,4,7],
  '02_M7':[0,4,7,11],
  '03_m':[0,3,7],
  '04_m7':[0,3,7,10],
  '05_5':[0,4],
  '06_6':[0,4,7,9],
  '07_7':[0,4,7,10],
  '08_sus4':[0,5,7],
  '09_add9':[0,2,7],
}

export const masterScale = {
  '01_Ryukyu':[0,4,5,7,11],
  '02_Major':[0,2,4,5,7,9,11],
  '03_minor':[0,2,3,5,7,8,10],
  '04_minorPentatonic':  [0,3,5,7,10],
  '05_MajorPentatonic':  [0,2,4,7,9],
  '06_Blues':[0,2,3,4,7,9],
  '07_minorBlues':[0,3,5,6,7,10],
  '08_HarmonicMinor':[0,2,3,5,7,8,11],
  '09_MelodicMinor':[0,2,3,5,7,9,11],
  '10_Dorian':[0,2,3,5,7,9,10],
  '11_Lydian':[0,2,4,6,7,9,11],
  '12_MixoLydian':[0,2,4,5,7,9,10],
  '13_Alterd':[0,1,3,4,6,8,10],
}

// ----------------------------------------
export const organ = new Tone.Sampler(
  {
    urls:{
      C2: "organNeoVC3.mp3",
      C3: "organNeoVC4.mp3",
      C4: "organNeoVC5.mp3",
    },
    baseUrl:"./",
    volume:-15,
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


export const piano = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
  volume:-15,
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
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,],
    [0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,],
    [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
  ]

export const rockDrum={
  "BD"  :[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,],
  "SD"  :[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,],
  "HHC" :[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
}
export const jazzDrum={
  "BD"  :[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  "SD"  :[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  "HHC" :[
    1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
    1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
    1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
    1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,
  ],
}
export const silentDrum={
  "BD"  :[0,0,0,0,  1,0,0,0,  1,0,0,0,  0,0,0,0,],
  "SD"  :[0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,],
  "HHC" :[1,0,0,0,  1,0,0,0,  1,0,0,0,  1,0,0,0,],
}

export const noneDrum={
  "BD"  :[0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,],
  "SD"  :[0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,],
  "HHC" :[0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0,],
}

export const blueDrum={
  "BD"  :[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  "SD"  :[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
  "HHC" :[
    1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0,
    1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0,
  ],
}

export const instList={
  'piano':piano,
  'eGuitar':eGuitar,
  'aGuitar':aGuitar,
  'organ':organ,
}

export const rhythmList={
  'Rock':rockDrum,
  'jazz':jazzDrum,
  'silent':silentDrum,
  'blue':blueDrum,
  'mute':noneDrum,
}

//0,1,3,0,5,0,7,0
export const noteDisplayArray=[
  [],
  [],
]

export const chordChopLength=[
    [0,0,0,0],
    [0,0,0,'4n'],
    [0,0,'2n',0],
    [0,0,'4n','4n'],
    [0,'2n',0,0],
    [0,'2n',0,'4n'],
    [0,'4n','2n',0],
    [0,'4n','4n','2n'],
    ['1m',0,0,0],
    ['1m',0,0,'4n'],
    ['2n',0,'2n',0],
    ['2n',0,'4n','4n'],
    ['4n','2n',0,0],
    ['4n','2n',0,'4n'],
    ['4n','4n','2n',0],
    ['4n','4n','4n','4n'],
]

export const noteColorList=[
  'note1',
  'note2',
  'note3',
  'note4',
  'note5',
  'note6',
  'note7',
  'note8',
  'note9',
  'note10',
  'note11',
]
/*
F-G-Am
C-Am-F-G
Dm-G-C-A7
A7-D7
 */
