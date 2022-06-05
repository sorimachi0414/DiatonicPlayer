//General Setting
import * as Tone from "tone";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {store} from "./index";

//variables description
//
// 0,1,2,...11 : note or noteNum.0 = C,1 = C#, 11=B
// C,C#,D,... : noteName
// Cm7,Fdim7 : chordName
// [0,4,7] : notes or chord
// [[0,4,7],[2,6,9]] : chords
// [0,2,4,5,7,9,11] : scale
// [scale,scale,scale] : scales


/////////////////////////////////////
// Definition about Diatonic Chords
/////////////////////////////////////

export const soundNameList=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B',]
export const soundNumList={'C':0, 'C#':1, 'D':2, 'D#':3, 'E':4, 'F':5, 'F#':6, 'G':7, 'G#':8, 'A':9, 'A#':10, 'B':11,}

export const stringFretToNote=(string,fret)=>{
  let stringNotes=[4,11,7,2,9,4]
  let note = soundNameList[(stringNotes[string]+fret)%12]
  return note
}

export const diatonicOfScaleChords = (scale,key=0)=>{
  //[0,2,4,5,7,9,11]
  return scale.map((val,i)=>[scale[(0+i)%7],scale[(2+i)%7],scale[(4+i)%7],scale[(6+i)%7]].map(x=>(x+key)%12))
}

export const passingDimToSecDominantChords = (chords)=>{

  let diminishChords=[]
  for(let notes of chords){
    //notes = like [0,3,5,7]
    let secondRoot = notes[0] //B(11) in Major
    //let secondRoot = (root+12 - 5) %12

    let sameRootChords=[]
    for(let x of [1,4,7,10]){
      sameRootChords.push(
        [0+secondRoot+x,3+secondRoot+x,6+secondRoot+x,9+secondRoot+x].map(y=>y%12)
      )
    }
    diminishChords.push(sameRootChords)
  }

  return diminishChords
}

export const secDominantMajorChords =(key)=>{

  return [
    [0,4,7,10].map(x=>x+11+key).map(x=>x%12),  //B7 to E
    [0,4,7,10].map(x=>x+4+key).map(x=>x%12),   //E7 to A
    [0,4,7,10].map(x=>x+9+key).map(x=>x%12),   //A7 to D
    [0,4,7,10].map(x=>x+0+key).map(x=>x%12),   //C7 to F
    [0,4,7,10].map(x=>x+2+key).map(x=>x%12),   //D7 to G
    //G7 to C
    //F# to B
  ]
}

export const secDominantMinorChords =(key)=>{
  //Natural Minor = 0,2,3,5,7,8,10 :C D D# F G G# A#
  return [
    //[0,4,7,10].map(x=>x+9+key),   //A7 to D
    [0,4,7,10].map(x=>x+10+key).map(x=>x%12),  //A# to D#
    [0,4,7,10].map(x=>x+0+key).map(x=>x%12),   //C7 to F
    [0,4,7,10].map(x=>x+2+key).map(x=>x%12),   //D7 to G
    [0,4,7,10].map(x=>x+3+key).map(x=>x%12),   //D#7 to G#
    [0,4,7,10].map(x=>x+5+key).map(x=>x%12),   //F7 to A#
  ]
}

export const secDominantHarmonicMinorChords =(key)=>{
  //Harmonic Minor 0,2,3,5,7,8,11 :C  	  D  	  Eb  	  F  	  G  	  Ab  	  B
  return [
    //[0,4,7,10].map(x=>x+9+key),   //G7 to C
    //[0,4,7,10].map(x=>x+9+key),   //A7 to D
    //[0,4,7,10].map(x=>x+10+key),  //A# to D#
    [0,4,7,10].map(x=>x+0+key).map(x=>x%12),   //C7 to F
    [0,4,7,10].map(x=>x+2+key).map(x=>x%12),   //D7 to G
    [0,4,7,10].map(x=>x+3+key).map(x=>x%12),   //D#7 to G#
    //[0,4,7,10].map(x=>x+5+key),   //F#7 to B
  ]
}

export const secDominantMelodicMinorChords =(key)=>{
  //Melodic  Minor 0,2,3,5,7,9,11 :  C  	  D  	  Eb  	  F  	  G  	  A  	  B
  return [
    //[0,4,7,10].map(x=>x+9+key),   //G7 to C
    [0,4,7,10].map(x=>x+9+key).map(x=>x%12),   //A7 to D
    //[0,4,7,10].map(x=>x+10+key),  //A# to D#
    [0,4,7,10].map(x=>x+0+key).map(x=>x%12),   //C7 to F
    [0,4,7,10].map(x=>x+2+key).map(x=>x%12),   //D7 to G
    //[0,4,7,10].map(x=>x+3+key),   //E7 to A
    //[0,4,7,10].map(x=>x+5+key),   //F#7 to B
  ]
}

export const parallelScaleChords=(scale)=>{
  //0,2,3,5,7,9,11
  let parallelElem = [2,5,6] //[3,7,9]
  return parallelElem.map((val,i)=>[
    scale[(0+val)%7],
    scale[(2+val)%7],
    scale[(4+val)%7],
    scale[(6+val)%7]
  ])
}


export const subDominantMinorChord=(key)=>{
  //Enable in Major key
  return [5,8,0,3].map(x=>(x+key)%12)
}

export const parallelKeyOfMajorChords=(key)=>{
  //D#7 G#7 A#7 in Major key
  return [
    [0,3,7,10].map(x=>x+3+key),  //D#7
    [0,3,7,10].map(x=>x+8+key),  //G#7
    [0,3,7,10].map(x=>x+10+key),  //A#7
  ]
}

export const parallelKeyOfMinorChords=(key)=>{
  //D#m7 G#m7 A#m7 in Natural Minor key
  return [
    [0,4,7,10].map(x=>x+3+key),  //D#7
    [0,4,7,10].map(x=>x+8+key),  //G#7
    [0,4,7,10].map(x=>x+10+key),  //A#7
  ]
}


export const convertSoundNameNum = (arg)=>{
  //arg =
  let argArray = JSON.parse(JSON.stringify(arg))
  argArray.forEach((each,i)=>{
    if(Array.isArray(each)){
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

export const checkChordName =(notes)=>{
  //noteArray = [0,4,7,10] or [0,4,7]
  //console.log("notes",notes)
  //let arr = notes.slice(0,4)
  if(!Array.isArray(notes)) return "Error"
  let root = notes[0]
  let arrNorm = notes.map(x=>(x-root+12)%12)
  let quadChordList = {
    "7" : [0,4,7,10],
    "M7" : [0,4,7,11],
    "m7" : [0,3,7,10],
    "m7b5" : [0,3,6,10],
    "mM7":[0,3,7,11],
    "M7(#5)":[0,4,8,11],
    "dim7":[0,3,6,9],
  }

  let threeChordList={
    "M" : [0,4,7],
    "m" : [0,3,7],
    "dim":[0,3,6],
    "aug":[0,4,8],
  }

  let chordNameString
  if(notes.length>3){
    for(let key in quadChordList){
      let word = JSON.stringify(arrNorm)
      let comp = JSON.stringify(quadChordList[key])
      if(word == comp){
        chordNameString = soundNameList[root]+key
      }

    }
  }else{
    for(let key in threeChordList){
      let word = JSON.stringify(arrNorm)
      let comp = JSON.stringify(threeChordList[key])
      if(word == comp){
        chordNameString = soundNameList[root]+key
      }
    }
  }

  return chordNameString
}

export const calcDiatonicChords=(scale)=>{
  let chords=[]
  for(let i=0;i<scale.length;i++){
    let val = scale[i]
    chords.push([i+val+0,i+val+2,i+val+4,i+val+6].map(x=>x%12))
  }
  return chords
}

export const calcSecDominantChords=(scale)=>{
  let chords=[]

  return chords

}

export const scaleToDiatonicChords=(arg)=>{
  //arg = note of array = [0,2,4,5,...]
  let diatonicChords=[
    [arg[0],arg[2],arg[4],arg[6]].map(x =>soundNameList[x]+'3'),
    [arg[1],arg[3],arg[5],arg[0]].map(x =>soundNameList[x]+'3'),
    [arg[2],arg[4],arg[6],arg[1]].map(x =>soundNameList[x]+'3'),
    [arg[3],arg[5],arg[0],arg[2]].map(x =>soundNameList[x]+'3'),
    [arg[4],arg[6],arg[1],arg[3]].map(x =>soundNameList[x]+'3'),
    [arg[5],arg[0],arg[2],arg[4]].map(x =>soundNameList[x]+'3'),
    [arg[6],arg[1],arg[3],arg[5]].map(x =>soundNameList[x]+'3'),
  ]

  return diatonicChords // [[C3,E3,G3],[],[],]
}


export const drawTab=(chordName,flgHighChord,comment="")=>{

  if(Array.isArray(chordName)){
    chordName = checkChordName(chordName)
  }
  //chordName likes "CM7",etc
  //settings
  let tabWidth = 100
  let tabHeight =110

  // A---------B
  // | a------b
  // | |
  // | c-----d
  // C---------D

  let aX = 12
  let aY = 25
  let xNum = 5
  let xInt = 13
  let yInt = 12
  let bX = aX+xNum*xInt
  let cY = aY+5*yInt
  let fretNumInitialX = 10
  let soundNameX = 17 //Max width - soundNamex


  let bgColor = '#eee'
  let natWidth = 2
  let natColor = "#000"
  let lineWidth = 1
  let pointSize = 4.5
  let openCircleSize = 4
  let barreWidth = 9

  let fretNumFont = "11px sans-serif"
  let ChordNameLabelFont ="14px sans-serif"
  let muteStringMarkFont = "14px sans-serif"
  let stringNoteFont = "10px sans-serif"

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
  let stringIndex=0
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
        //Mute String
        ctx.font = muteStringMarkFont
        ctx.fillText("x", aX-xInt/1.3, stringIndex*yInt+aY+4);

      }else　if(val==0) {
        //Open String
        ctx.arc( aX+val*xInt - xInt/2, stringIndex*yInt+aY,openCircleSize , 0, 2 * Math.PI, false ) ;
        ctx.stroke()
        //depict sound name
        let thisStringNote = stringFretToNote(stringIndex,val+pictFirstFret-1)
        ctx.fillText(thisStringNote, tabWidth-20, stringIndex*yInt+aY+4);

      }else{
        //Normal string
        ctx.arc( aX+val*xInt - xInt/2, stringIndex*yInt+aY, pointSize, 0, 2 * Math.PI, false ) ;
        ctx.fill()

        //depict sound name
        let thisStringNote = stringFretToNote(stringIndex,val+pictFirstFret-1)
        ctx.font = stringNoteFont
        ctx.fillText(thisStringNote, tabWidth-soundNameX, stringIndex*yInt+aY+4);


      }
      stringIndex+=1
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
      let textWidth = ctx.measureText( i+pictFirstFret ).width ;

      //ctx.fillText(i+pictFirstFret, 20+i*xInt+5, cY+yInt+5)
      ctx.fillText(i+pictFirstFret, fretNumInitialX+i*xInt+8-textWidth/2, cY+yInt+5)
    }
  }

  //ChordLabel
  ctx.font = ChordNameLabelFont
  ctx.fillText(chordName+ " " + comment, 5, 15);

  let testPng = canvasElem.toDataURL()

  return testPng
}


export const drawSecDominant=(scaleNotes,flgHighChord)=>{
  let subDominants=[] //[[0,7],[2,9],...]
  let subDominantsNames=[] //[[C,G],]
  let displayOrder = [3,6,2,4,5,7].map(x=>x-1) //2,5,1,3,4,6
  let subDominantNotes=[]
  let diminish = []

  //calc secoundary dominant
  if(Array.isArray(scaleNotes)){
    for(let index of displayOrder){
      let root = scaleNotes[index] //scaleNote[2] = E(4) in Major
      let secondRoot = (root+12 - 5) %12 // E -5 = 16 -5 = 11 => B
      //rid non-scale note or Key like C
      if (scaleNotes.indexOf(secondRoot)>=0 ){
        subDominants.push([root,secondRoot])
        subDominantsNames.push([soundNameList[root],soundNameList[secondRoot]+"7"])
        subDominantNotes.push(secondRoot)

        //Diminish Chords
        let dim0 = soundNameList[(secondRoot+1)%12] +"dim7"
        let dim1 = soundNameList[(secondRoot+4)%12] +"dim7"
        let dim2 = soundNameList[(secondRoot+7)%12] +"dim7"
        let dim3 = soundNameList[(secondRoot+10)%12] +"dim7"
        diminish.push(
          <>
            <Col xs={2}>{<img alt="icon" src={drawTab(dim0,1,)} />}</Col>
            <Col xs={2}>{<img alt="icon" src={drawTab(dim1,1,)} />}</Col>
            <Col xs={2}>{<img alt="icon" src={drawTab(dim2,1,)} />}</Col>
            <Col xs={2}>{<img alt="icon" src={drawTab(dim3,1,)} />}</Col>
          </>
        )
      }

    }

    //generate html
    let resultArray =[]
    for(let [index,val] of subDominantsNames.entries()){
      resultArray.push(
        <Row>
          <Col xs={4} className={"py-2"}>
            <img alt="icon" src={drawTab(val[1],1,"( => "+val[0]+")")} />
          </Col>
          {diminish[index]}
        </Row>
      )
      if(index%2 ==1){
        //resultArray.push(<Col xs={6}></Col>)
      }
    }

    return resultArray
  }

  return 0

}

/////////////////////////////////////
// Definition about Sound play in Diatonic Chords
/////////////////////////////////////
export const notesToTonejsChord =(notes)=>{
  //notes = [0,4,7,10]
  let tonejsChord=[]
  let suffix=3
  let lastNote=0
  let lastVal=0
  let currentOctave=2
  let currentVal

  notes.forEach((val,index)=>{
    currentVal = val+12*currentOctave
    switch(1){
      case 1:
        //Good for Piano.Bad for Acoustic Guitar
        if(currentVal<lastVal) currentOctave+=1
        tonejsChord.push(soundNameList[val]+currentOctave)
        lastVal=currentVal
        break;
      case 2 :
        if(index==0){

        }else if (index==1){
          currentOctave+=1
        }else {
          currentVal = val+12*currentOctave
          console.log(currentVal,lastVal)
          if (currentVal < lastVal) currentOctave += 1
          //if(index==3) currentOctave+=1
        }
        currentVal = val+12*currentOctave
        tonejsChord.push(soundNameList[val]+currentOctave)
        lastVal=currentVal
        break;
      case 3:
        //Not use.has Sound separation. Good for acoustic guitar, but is bit strange.
        if(index==0){
          suffix=2
          if(val>5) suffix=1

        }else if(index==1){

          suffix+=1

          //suffix=3
        }else{
          suffix=3
          // if(val<lastNote){
          //   suffix+=1
          // }
          // lastNote=val
        }
        tonejsChord.push(soundNameList[val]+suffix)
        break;
    }
    console.log(tonejsChord)
    })

  //debug
  // suffix+=1
  // tonejsChord.push(soundNameList[notes[0]]+3)
  // tonejsChord.push(soundNameList[notes[0]]+1)

  return tonejsChord
}



/////////////////////////////////////
// Definition about Loop Player
/////////////////////////////////////

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
  "rawScaleNoteList":[[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7],[9,0,2,4,7]],
  "activeScale":"01_Major",
}

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
  '03_Harmonic minor':[0,2,3,5,7,8,11],
  '04_Melodic minor':[0,2,3,5,7,9,11],
  //'04_minorPentatonic':  [0,3,5,7,10],
}



// ----------------------------------------
//Note:Guitar strings are E2,A3,D3,G3,B3,E4
export const organ = new Tone.Sampler(
  {
    urls:{
      C2: "organNeoVC3.mp3",
      C3: "organNeoVC4.mp3",
      C4: "organNeoVC5.mp3",
    },
    baseUrl:"./",
    volume:-15,
    onload:()=>{
      store.dispatch(
        {type:'TONEJS_LOADED',load:true}
      )
    },
  }
).toDestination();

export const piano = new Tone.Sampler({
  urls: {
    C2: "C2single.mp3",
    C3: "C3single.mp3",
  },
  baseUrl: "./",
  volume:-15,
  onload:()=>{
    store.dispatch(
      {type:'TONEJS_LOADED',load:true}
    )
  },
}).toDestination();

export const eGuitar = new Tone.Sampler({
  urls: {
    C2:'GuitarC2.mp3',
    C3:'GuitarC3.mp3',
    C4:'GuitarC4.mp3',
  },
  baseUrl: "./",
  volume:-10,
  onload:()=>{
    store.dispatch(
      {type:'TONEJS_LOADED',load:true}
    )
  },
}).toDestination();

export const aGuitar = new Tone.Sampler({
  urls: {
    //mp3 is 1 octave higher than file name
    B2: "agB2.mp3",
    B3: "agB3.mp3",
    B4: "agB4.mp3",
  },
  baseUrl: "./",
  volume:-10,
  onload:()=>{
    store.dispatch(
          {type:'TONEJS_LOADED',load:true}
        )
  },

}).toDestination();

// export const drum = new Tone.Sampler(
//   {
//     urls:{
//       C3: "BD.mp3",
//       C4: "SD.mp3",
//       C5: "HHC.mp3",
//     },
//     baseUrl:"./",
//   }
// ).toDestination();

export const instList={
  'piano':piano,
  'eGuitar':eGuitar,
  'aGuitar':aGuitar,
  'organ':organ,
}




/////////////////////////////////////
// Definition about guitar chord
/////////////////////////////////////

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

  "Cdim"   :[8+0,7+0,8+0,7+0,-1,-1],
  "C#dim"  :[8+1,7+1,8+1,7+1,-1,-1],
  "Ddim"   :[8+2,7+2,8+2,7+2,-1,-1],
  "D#dim"  :[3+0,1+0,2+0,1+0,-1,-1],
  "Edim"   :[3+1,1+1,2+1,1+1,-1,-1],
  "Fdim"   :[3+2,1+2,2+2,1+2,-1,-1],
  "F#dim"  :[3+3,1+3,2+3,1+3,-1,-1],
  "Gdim"   :[3+4,1+4,2+4,1+4,-1,-1],
  "G#dim"  :[3+5,1+5,2+5,1+5,-1,-1],
  "Adim"   :[3+6,1+6,2+6,1+6,-1,-1],
  "A#dim"  :[3+7,1+7,2+7,1+7,-1,-1],
  "Bdim"   :[3+8,1+8,2+8,1+8,-1,-1],

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

  "Caug"    :[-1, 1+0  ,1+0,   2+0,  3+0,  -1,-1],
  "C#aug"   :[-1, 1+1  ,1+1,   2+1,  3+1,  -1,-1],
  "Daug"    :[-1, 1+2  ,1+2,   2+2,  3+2,  -1,-1],
  "D#aug"   :[-1, 1+3  ,1+3,   2+3,  3+3,  -1,-1],
  "Eaug"    :[-1, 1+4  ,1+4,   2+4,  3+4,  -1,-1],
  "Faug"    :[-1, 1+5  ,1+5,   2+5,  3+5,  -1,-1],
  "F#aug"   :[-1, 1+6  ,1+6,   2+6,  3+6,  -1,-1],
  "Gaug"    :[-1, 1+7  ,1+7,   2+7,  3+7,  -1,-1],
  "G#aug"   :[-1, 1+8  ,1+8,   2+8,  3+8,  -1,-1],
  "Aaug"    :[-1, 1+9  ,1+9,   2+9,  3+9,  -1,-1],
  "A#aug"   :[-1, 1+10 ,1+10,  2+10, 3+10, -1,-1],
  "Baug"    :[-1, 1+11 ,1+11,  2+11, 3+11, -1,-1],

  "CM"   :[3,5,5,5,3,-1],
  "C#M"  :[3+1,5+1,5+1,5+1,3+1,3+1],
  "DM"   :[3+2,5+2,5+2,5+2,3+2,3+2],
  "D#M"  :[3+3,5+3,5+3,5+3,3+3,3+3],
  "EM"   :[3+4,5+4,5+4,5+4,3+4,3+4],
  "FM"   :[3+5,5+5,5+5,5+5,3+5,3+5],
  "F#M"  :[3+6,5+6,5+6,5+6,3+6,3+6],
  "GM"   :[3+7,5+7,5+7,5+7,3+7,3+7],
  "G#M"  :[3+8,5+8,5+8,5+8,3+8,3+8],
  "AM"   :[3-3,5-3,5-3,5-3,3-3,3-3],
  "A#M"  :[3-2,5-2,5-2,5-2,3-2,3-2],
  "BM"   :[3-1,5-1,5-1,5-1,3-1,3-1],

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

  "Cm"   :[3,4,5,5,3,3],
  "C#m"  :[3+1,4+1,5+1,5+1,3+1,3+1],
  "Dm"   :[3+2,4+2,5+2,5+2,3+2,3+2],
  "D#m"  :[3+3,4+3,5+3,5+3,3+3,3+3],
  "Em"   :[3+4,4+4,5+4,5+4,3+4,3+4],
  "Fm"   :[3+5,4+5,5+5,5+5,3+5,3+5],
  "F#m"  :[3+6,4+6,5+6,5+6,3+6,3+6],
  "Gm"   :[3+7,4+7,5+7,5+7,3+7,3+7],
  "G#m"  :[4,4,6,4,6,4],
  "Am"   :[5,5,7,5,7,5,],
  "A#m"  :[6,6,8,6,8,6],
  "Bm"   :[7,7,9,7,9,7],

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



/////////////////////////////////////
// Not use now
/////////////////////////////////////
//0,1,3,0,5,0,7,0

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

export const rhythmList={
  'Rock':rockDrum,
  'jazz':jazzDrum,
  'silent':silentDrum,
  'blue':blueDrum,
  'mute':noneDrum,
}