//General Setting
import * as Tone from "tone";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {store} from "./index";
import {chordTabList,chordTabListH,quadChordList,threeChordList} from "./musicDefinition";

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

export const checkChordName =(notes)=>{
  //noteArray = [0,4,7,10] or [0,4,7]
  //console.log("notes",notes)
  //let arr = notes.slice(0,4)
  if(!Array.isArray(notes)) return "Error"
  let root = notes[0]
  let arrNorm = notes.map(x=>(x-root+12)%12)

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

export const instList={
  'piano':piano,
  'eGuitar':eGuitar,
  'aGuitar':aGuitar,
  'organ':organ,
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