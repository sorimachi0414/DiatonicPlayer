//General Setting
import * as Tone from "tone";

export const tickTackInterval='24n'
export const stepNum=96
export const fretNum=15
export const strings=6
export const chordTabList={
  "CM7":[0,0,0,2,3,-1],
  "Dm7":[1,1,2,0,-1,-1],
  "Em7":[0,0,1,0,2,0],
  "FM7":[0,1,2,3,-1,-1],
  "G7":[1,0,0,0,2,3],
  "Am7":[0,1,0,2,0,-1],
  "Bm7-5":[0,3,2,3,2,-1]
}

export const chordTabListH={
  "Cdim7"   :[8,10,8,10,9,8],
  "C#dim7"  :[8+1,10+1,8+1,10+1,9+1,8+1],
  "Ddim7"   :[4,6,4,-1,5,-1],
  "D#dim7"  :[4+1,6+1,4+1,-1,5+1,-1],
  "Edim7"   :[4+2,6+2,4+2,-1,5+2,-1],
  "Fdim7"   :[4+3,6+3,4+3,-1,5+3,-1],
  "F#dim7"  :[8-6,10-6,8-6,10-6,9-6,8-6],
  "Gdim7"   :[8-5,10-5,8-5,10-5,9-5,8-5],
  "G#dim7"  :[8-4,10-4,8-4,10-4,9-4,8-4],
  "Adim7"   :[8-3,10-3,8-3,10-3,9-3,8-3],
  "A#dim7"  :[8-2,10-2,8-2,10-2,9-2,8-2],
  "Bdim7"   :[8-1,10-1,8-1,10-1,9-1,8-1],

  "CM7"   :[3,5,4,5,3,3],
  "C#M7"  :[3+1,5+1,4+1,5+1,3+1,3+1],
  "DM7"   :[3+2,5+2,4+2,5+2,3+2,3+2],
  "D#M7"  :[3+3,5+3,4+3,5+3,3+3,3+3],
  "EM7"   :[3+4,5+4,4+4,5+4,3+4,3+4],
  "FM7"   :[3+5,5+5,4+5,5+5,3+5,3+5],
  "F#M7"  :[3+6,5+6,4+6,5+6,3+6,3+6],
  "GM7"   :[3+7,5+7,4+7,5+7,3+7,3+7],
  "G#M7"  :[3+8,5+8,4+8,5+8,3+8,3+8],
  "AM7"   :[3-3,5-3,4-3,5-3,3-3,3-3],
  "A#M7"  :[3-2,5-2,4-2,5-2,3-2,3-2],
  "BM7"   :[3-1,5-1,4-1,5-1,3-1,3-1],

  "C7"    :[3,5,3,5,3,3],
  "C#7"   :[3+1,5+1,3+1,5+1,3+1,3+1],
  "D7"    :[3+2,5+2,3+2,5+2,3+2,3+2],
  "D#7"   :[3+3,5+3,3+3,5+3,3+3,3+3],
  "E7"    :[3+4,5+4,3+4,5+4,3+4,3+4],
  "F7"    :[3+5,5+5,3+5,5+5,3+5,3+5],
  "F#7"   :[3+6,5+6,3+6,5+6,3+6,3+6],
  "G7"    :[3,3,4,3,5,3],
  "G#7"   :[3+1,3+1,4+1,3+1,5+1,3+1],
  "A7"    :[3+2,3+2,4+2,3+2,5+2,3+2],
  "A#7"   :[3+3,3+3,4+3,3+3,5+3,3+3],
  "B7"    :[3+4,3+4,4+4,3+4,5+4,3+4],

  "CM7(#5)"    :[-1,5+0,3+0,4+0,3+0,-1,],
  "C#M7(#5)"   :[-1,5+1,3+1,4+1,3+1,-1,],
  "DM7(#5)"    :[-1,5+2,3+2,4+2,3+2,-1,],
  "D#M7(#5)"   :[-1,5+3,3+3,4+3,3+3,-1,],
  "EM7(#5)"    :[-1,5+4,3+4,4+4,3+4,-1,],
  "FM7(#5)"    :[5+0,4+0,4+0,3+0,-1,-1],
  "F#M7(#5)"   :[5+1,4+1,4+1,3+1,-1,-1],
  "GM7(#5)"    :[5+2,4+2,4+2,3+2,-1,-1],
  "G#M7(#5)"   :[5+3,4+3,4+3,3+3,-1,-1],
  "AM7(#5)"    :[5+4,4+4,4+4,3+4,-1,-1],
  "A#M7(#5)"   :[-1,3,1,2,3,-1],
  "BM7(#5)"    :[-1,4,2,3,4,-1],

  "Cm7"   :[3,4,3,5,3,3],
  "C#m7"  :[3+1,4+1,3+1,5+1,3+1,3+1],
  "Dm7"   :[3+2,4+2,3+2,5+2,3+2,3+2],
  "D#m7"  :[3+3,4+3,3+3,5+3,3+3,3+3],
  "Em7"   :[3+4,4+4,3+4,5+4,3+4,3+4],
  "Fm7"   :[3+5,4+5,3+5,5+5,3+5,3+5],
  "F#m7"  :[3+6,4+6,3+6,5+6,3+6,3+6],
  "Gm7"   :[3+7,4+7,3+7,5+7,3+7,3+7],
  "G#m7"  :[4,4,4,4,6,4],
  "Am7"   :[5,5,5,5,7,5,],
  "A#m7"  :[6,6,6,6,8,6],
  "Bm7"   :[7,7,7,7,9,7],

  "CmM7"   :[3+0,4+0,4+0,5+0,3+0,-1],
  "C#mM7"  :[3+1,4+1,4+1,5+1,3+1,-1],
  "DmM7"   :[3+2,4+2,4+2,5+2,3+2,-1],
  "D#mM7"  :[3+3,4+3,4+3,5+3,3+3,-1],
  "EmM7"   :[3+4,4+4,4+4,5+4,3+4,-1],
  "FmM7"   :[3+5,4+5,4+5,5+5,3+5,-1],
  "F#mM7"  :[3+6,4+6,4+6,5+6,3+6,-1],
  "GmM7"   :[3+0,3+0,3+0,4+0,5+0,3+0,],
  "G#mM7"  :[3+1,3+1,3+1,4+1,5+1,3+1,],
  "AmM7"   :[3+2,3+2,3+2,4+2,5+2,3+2,],
  "A#mM7"  :[3+3,3+3,3+3,4+3,5+3,3+3,],
  "BmM7"   :[3+4,3+4,3+4,4+4,5+4,3+4,],

  "Cm7b5"   :[8,7,8,8,-1,-1],
  "C#m7b5"  :[8+1,7+1,8+1,8+1,-1,-1],
  "Dm7b5"   :[1,1,1,2,-1,-1],
  "D#m7b5"  :[1+1,1+1,1+1,0+1,-1,-1],
  "Em7b5"   :[1+2,1+2,1+2,0+2,-1,-1],
  "Fm7b5"   :[1+3,1+3,1+3,0+3,-1,-1],
  "F#m7b5"  :[1+4,1+4,1+4,0+4,-1,-1],
  "Gm7b5"  :[1+5,1+5,1+5,0+5,-1,-1],
  "G#m7b5"   :[7,7,7,6,-1,-1],
  "Am7b5"  :[8-3,7-3,8-3,8-3,-1,-1],
  "A#m7b5"   :[8-2,7-2,8-2,8-2,-1,-1],
  "Bm7b5"   :[8-1,7-1,8-1,8-1,-1,-1],
}

//"CM7":[0,0,0,2,3,-1],

export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const soundNumList={
  'C':0,
  'C#':1,
  'D':2,
  'D#':3,
  'E':4,
  'F':5,
  'F#':6,
  'G':7,
  'G#':8,
  'A':9,
  'A#':10,
  'B':11,
}

export const convertSoundNameNum = (arg)=>{
  let argArray = JSON.parse(JSON.stringify(arg))
  argArray.forEach((each,i)=>{
    if(Array.isArray(each)){
      console.log("isArray")
      //二次元配列
      each.forEach((elem,j)=>{
        if(Number.isInteger(elem)){
          //Number
          argArray[i][j]=soundNameList[elem]
        }else{
          //Letter
          argArray[i][j]=soundNumList[elem.slice(0,-1)]
        }
      })

    }else{
      //１次元配列
      if(isNaN(each)){
        //Number
        //argArray[i]=soundNameList[each]
      }else{
        //Letter
        //argArray[i]=soundNumList[each[0]]
      }
    }

  })
  return argArray
}

export const checkChordName =(arg)=>{
  //arg = [0,4,7,10]
  let out
  let arr = arg.slice(0,4)
  let root = arr[0]
  let arrNorm = arr.map(x=>(x-root+12)%12)
  let quadChordList = {
    "7" : [0,4,7,10],
    "M7" : [0,4,7,11],
    "m7" : [0,3,7,10],
    "m7b5" : [0,3,6,10],
    "mM7":[0,3,7,11],
    "M7(#5)":[0,4,8,11],
    "dim7":[0,3,6,9],

  }

  for(let key in quadChordList){
    let word = JSON.stringify(arrNorm)
    let comp = JSON.stringify(quadChordList[key])
    if(word == comp){
      out = soundNameList[root]+key
    }

  }

  return out
}

export const makeDiatonicChords=(arg)=>{
  let diatonicChords=[
    [arg[0],arg[2],arg[4],arg[6]].map(x =>soundNameList[x]+'3'),
    [arg[1],arg[3],arg[5],arg[0]].map(x =>soundNameList[x]+'3'),
    [arg[2],arg[4],arg[6],arg[1]].map(x =>soundNameList[x]+'3'),
    [arg[3],arg[5],arg[0],arg[2]].map(x =>soundNameList[x]+'3'),
    [arg[4],arg[6],arg[1],arg[3]].map(x =>soundNameList[x]+'3'),
    [arg[5],arg[0],arg[2],arg[4]].map(x =>soundNameList[x]+'3'),
    [arg[6],arg[1],arg[3],arg[5]].map(x =>soundNameList[x]+'3'),
  ]

  return diatonicChords
}

export const defaultState={
  "isPlay":false,"isPlayLabel":"Play","bpm":130,"inst":"organ","drum":"Rock","step":0,"nextStep":1,"beat1m":0,"nextBeat1m":1,
  "bdPlan":[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
  "sdPlan":[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
  "hhcPlan":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  "chordList":[["A3","C#3","E3","G3","A2"],["A3","C#3","E3","G3","A2"],["D3","F#3","A3","C3","D2"],["D3","F#3","A3","C3","D2"]],
  "chordPlan":[["1m",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,"1m",0,0,"4n",0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,"1m",0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,"1m",0,0,0]],
  "blocksColor":["btn btn-warning h-100 w-100","btn btn-outline-primary h-100 w-100","btn btn-outline-primary h-100 w-100","btn btn-outline-primary h-100 w-100"],"typesOfChords":["07_7","07_7","07_7","07_7"],"rootNoteOfChords":[9,9,2,2],"displayCircle":true,"scaleBlocksColor":["btn btn-outline-primary w-100","btn btn-outline-primary w-100","btn btn-outline-primary w-100","btn btn-outline-primary w-100"],"rootNoteOfScale":[9,9,9,9],"typeOfScale":["04_minorPentatonic","04_minorPentatonic","04_minorPentatonic","04_minorPentatonic"],
  "rawScaleNoteList":[[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7]]}

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

export const baseScale = {
  '01_Major':[0,2,4,5,7,9,11],
  '02_minor':[0,2,3,5,7,8,10],
  '03_Harmonic Minor':[0,2,3,5,7,8,11],
  '04_Melodic Minor':[0,2,3,5,7,9,11],
  '04_minorPentatonic':  [0,3,5,7,10],
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
  '10_Alterd':[0,1,3,4,6,8,10],
  '11_Ionian':[0,2,4,5,7,9,11],
  '12_Dorian':[0,2,3,5,7,9,10],
  '13_Phrygian':[0,1,3,5,7,8,10],
  '14_Lydian':[0,2,4,6,7,9,11],
  '15_Mixolydian':[0,2,4,5,7,9,10],
  '16_Aeolian':[0,2,3,5,7,8,10],
  '17_Locrian':[0,1,3,5,6,8,10],
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

export const drawTab=(chordName,flgHighChord)=>{
  //settings
  let tabWidth = 100
  let tabHeight =110

  // A---------B
  // | a------b
  // | |
  // | c-----d
  // C---------D

  let aX = 20
  let aY = 25
  let xNum = 5
  let xInt = 15
  let yInt = 12
  let bX = aX+xNum*xInt
  let cY = aY+5*yInt


  let bgColor = '#eee'
  let natWidth = 2
  let natColor = "#000"
  let lineWidth = 1
  let pointSize = 4
  let openCircleSize = 5
  let barreWidth = 10


  let fretNumFont = "12px sans-serif"
  let ChordNameLabelFont ="14px sans-serif"
  let muteStringMarkFont = "14px sans-serif"


  //Initial

  let barreFret=0
  let barreLength=0
  let chordTabs=chordTabList
  if (flgHighChord) chordTabs = chordTabListH

  //Analysis
  let pictFirstFret = 0


  if(chordName in chordTabs){
    let tabWithoutN=[]
    for(let arg in chordTabs[chordName]){
      if(chordTabs[chordName][arg] >= 0) tabWithoutN.push(chordTabs[chordName][arg])
    }

    let minFret = Math.min(...tabWithoutN)
    let maxFret=Math.max(...chordTabs[chordName])

    if (minFret>0) {
      pictFirstFret = minFret-1
    }

    //Barre chord
    let firstStFret=chordTabs[chordName][0]
    let fifthStFret=chordTabs[chordName][4]
    let sixthStFret=chordTabs[chordName][5]

    barreFret=0
    if(firstStFret>0){
      if(firstStFret == sixthStFret ){
        barreFret=firstStFret
        barreLength=6
      }else if(firstStFret == fifthStFret){
        barreFret=firstStFret
        barreLength=5
      }
    }

  }

  //design layout
  //View

  const canvasElem = document.createElement('canvas')
  canvasElem.width = tabWidth
  canvasElem.height = tabHeight
  const ctx = canvasElem.getContext('2d')

  // draw
  ctx.clearRect(0, 0, tabWidth, tabHeight)
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, tabWidth, tabHeight)

  //horizontal
  ctx.beginPath () ;
  ctx.strokeStyle = natColor
  ctx.moveTo( aX, aY )
  ctx.lineTo( aX, cY )
  ctx.lineWidth = natWidth ;
  ctx.stroke() ;

  let yPoints = [aY,aY+yInt*1,aY+yInt*2,aY+yInt*3,aY+yInt*4,aY+yInt*5,]
  for(let arg of yPoints){
    ctx.beginPath () ;
    ctx.moveTo( aX, arg )
    ctx.lineTo( bX, arg )
    ctx.lineWidth = lineWidth ;
    ctx.stroke() ;
  }

  //Vertical
  for(let i =0;i<=xNum;i++){
    ctx.beginPath () ;
    ctx.moveTo( aX+xInt*i, aY )
    ctx.lineTo( aX+xInt*i, cY )
    ctx.lineWidth = lineWidth ;
    ctx.stroke() ;
  }

  //Position Mark
  let index=0
  let pictTab=[]
  if(chordName in chordTabs){
    if(pictFirstFret>0){
      pictTab = chordTabs[chordName].map(x=>x-pictFirstFret+1)
    }else{
      pictTab = chordTabs[chordName]
    }
    for(let val of pictTab){
      ctx.beginPath () ;
      ctx.fillStyle = "rgba(0,0,0,1)" ;
      if(val<0){
        //Open String
        ctx.font = muteStringMarkFont
        ctx.fillText("x", aX-xInt/1.3, index*yInt+aY+4);
      }else　if(val==0) {
        //push Fret String
        ctx.arc( aX+val*xInt - xInt/2, index*yInt+aY, pointSize, 0, 2 * Math.PI, false ) ;
        ctx.stroke()
      }else{
        //Mute String
        ctx.arc( aX+val*xInt - xInt/2, index*yInt+aY, openCircleSize, 0, 2 * Math.PI, false ) ;
        ctx.fill()
      }
      index+=1
    }

    //depict barre
    if(barreFret>0){
      barreFret = barreFret - pictFirstFret+1
      ctx.beginPath () ;
      ctx.moveTo( aX+xInt*barreFret-xInt/2, aY+yInt*0 )
      ctx.lineTo( aX+xInt*barreFret-xInt/2, aY+yInt*barreLength-yInt )
      ctx.lineWidth = barreWidth
      ctx.stroke() ;
    }

  }

  //Fet Number
  if(pictFirstFret>0){
    for(let i =0;i<xNum;i++){
      ctx.font = fretNumFont
      ctx.fillText(i+pictFirstFret, 20+i*xInt+5, cY+yInt+5)
    }
  }

  //ChordLabel
  ctx.font = ChordNameLabelFont
  ctx.fillText(chordName, 5, 15);

  let testPng = canvasElem.toDataURL()
  return testPng
}