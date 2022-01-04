import InputHandler from "../src/input.js";
import { drawBoard } from "./boardBuilder.js";
import { updateGameStateForHelperScreens, createMenu, createLoadingBar, createMenuBar } from "../src/helperScreens/helperScreens.js";
import { createHiDPICanvas, circleAndMouseCollissionDetection, shuffle, pointInsidePolygon  } from "../src/helper.js";


const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4,
  LEVELDONE: 5,
  LOADING: 6,
  ASSESSINGLEVEL: 7,
};

const unitMeasurement = {
  unitWidth : 50,
  unitHeight : 50
};


const sequences = [
  ['1', '4', '23', '45', '78', '92'],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['2', '7', '8', '23', '54', '67', '87', '88', '95', '122', '155', '197' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '132', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '167', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '167', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
  ['1', '4', '23', '45', '78', '92', '111', '122', '123', '124', '125', '167' ],
]

const shapeSums = [
  {
    sum: 4,
    choices: [1,3,5]
  },
  {
    sum: 8,
    choices: [3,5,4,2]
  },
  {
    sum: 9,
    choices: [4,2,5,6,1]
  },
  {
    sum: 9,
    choices: [4,2,5,6,1,3]
  }
]


export default class ShapeSums {
  constructor(gameWidth, gameHeight, difficulty, canvas) {
    this.tutorial = 'This is a tutorial. For now you have to try playing';
    this.counter = 0;
    this.GAMESTATE = GAMESTATE;
    this.canvas = canvas
    this.rect = canvas.getBoundingClientRect()
    this.wrongAnswer = false

    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    //padding between the units
    this.gap = 10
    // here making sure that the sequences are in the right order
    this.shapeSums = shapeSums
    // set the current sequence to the first one
    this.updateCurrentSequence(0)
    // This is where the candidate sequence answer will be stored

    this.updateUnitMeasurement()
    this.dx = 0
    this.mouse = {
      x:0,
      y:0,
    }

    this.clicked = {
      x:0,
      y:0,
    }
    
    this.difficulty = difficulty


    

    this.elements = drawBoard(this)
    this.InputHandler = new InputHandler(this, GAMESTATE);
    this.updateGameState(GAMESTATE.LOADING)
    this.InputHandler.init()

    this.unitErrors = {}
    this.step = 11
    this.clickedUnits = new Set()

    // this is where all the helper screens will be loaled #helperScreensCode

    this.helperScreens = {
      menu : createMenu(this, gameWidth, gameHeight),    
      loadingBar : createLoadingBar(this),
      menuBar : createMenuBar(this),
    }

  }

  undoAnswers(){
    console.log('eee')
    this.clickedUnits.clear()
  }

  updateGameSize(GAME_WIDTH, GAME_HEIGHT){
    this.gameWidth = GAME_WIDTH;
    this.gameHeight = GAME_HEIGHT;
    this.updateUnitMeasurement();
    this.units = drawBoard(this, this.elements)
    this.rect = this.canvas.getBoundingClientRect()

  }

  // here we update the current sequence and also shuffled it
  updateCurrentSequence(i){
    this.currentSequence = i
    this.currentBoard = this.shapeSums[i]
    this.currentBoard['choices'] = shuffle(this.currentBoard['choices'])
    this.currentDimensions = this.currentBoard['choices'].length

    // determine the necessary rotation for the polygons surrounding the main one
    let step = this.currentDimensions % 2;
    this.rotationStep =  Math.PI / this.currentDimensions
  }

  updateUnitMeasurement(){
    // When fixing the unit dimensions always take into account the padding and the unit gap
    // this.unitMeasurement = {
    //   unitWidth : (this.gameWidth - this.gap * (size-1)) / (size),
    //   unitHeight : (this.gameWidth - this.gap * (size-1)) / (size)
    // };


      if (this.gameWidth < 400){
        this.unitMeasurement = {
          radius : 60,

        };
      } else if (this.gameWidth > 1200){
        this.unitMeasurement = {
          radius : 100,

        };
      }else{
        this.unitMeasurement = {
          radius : this.gameWidth/12,
        };
      }
  }

  start() {
  }

  // That is used to move a level out of frame. You have to move explicitly all the seperable units
  moveLevelOutsideFrame(){
    let unitsAreOutsideTheCanvas = true;
    [...this.elements['units']].forEach((object) => {
        object.changeXCenter(this.dx)
        object.points.forEach((point) => {
          point.changeXCenter(this.dx);
        });
        if (object.position.x + object.radius > this.rect.left){
          unitsAreOutsideTheCanvas = false;
        }
      });

      this.elements['centeredSum'].changeXCenter(this.dx)
      this.elements['centeredSum'].points.forEach((point) => {
        point.changeXCenter(this.dx);
      });

      if (this.elements['centeredSum'].position.x + this.elements['centeredSum'].radius > this.rect.left){
        unitsAreOutsideTheCanvas = false;
      }
      return unitsAreOutsideTheCanvas  
  }

  // That is used to move a level inside the frame. You have to move explicitly all the seperable units
  moveLevelInsideFrame(){
    [...this.elements['units']].forEach((object) => {
      object.changeXCenter(-this.dx);
      object.points.forEach((point) => {
        point.changeXCenter(-this.dx);
      });
    });
    this.elements['centeredSum'].changeXCenter(-this.dx);
    this.elements['centeredSum'].points.forEach((point) => {
      point.changeXCenter(-this.dx);
    });
  }

  // For now this is where the level assessement happens.
  // It will probably become more complicared in the future
  correctAssessement(){
    let sum =  Array.from(this.clickedUnits).reduce(function (sum, item) {
      console.log(item)
      return item.dots + sum;
    }, 0);
    let correctSum = this.elements['centeredSum'].dots 
    return correctSum == sum
  }

  update(deltaTime) {

    // this is were the transition between levels is handled
    if (this.clickedUnits.size == 2 ) {
      // this is where we should check if the sum is correcct
      if (this.gamestate === GAMESTATE.RUNNING) {
        // this.updateGameState(GAMESTATE.LEVELDONE)
        // this.clickedUnits.clear()
          this.updateGameState(GAMESTATE.ASSESSINGLEVEL)

          // this determines how long the crossmark or checkmark will remain in frame
          this.counter = 50;
          
          if (this.correctAssessement()){
            let checkmark = document.getElementById("screen-checkmark")
            checkmark.style.display = 'block';
            setTimeout(() => {
              checkmark.style.zIndex = '2';
              checkmark.classList.add("grow-checkmark");
            }, 5);
          } else{
            let crossmark = document.getElementById("screen-crossmark")
            crossmark.style.display = 'block';
            setTimeout(() => {
              crossmark.style.zIndex = '2';
              crossmark.classList.add("grow-crossmark");
            }, 5);
            this.wrongAnswer = true;
          }
         
      if (this.helperScreens.menu.soundOn){
        setTimeout(() => {
          var audio = new Audio('media/audio/frouts.wav');
          audio.play(); 
        }, 1000); 
      }
      

      }
    }

    if (this.gamestate === GAMESTATE.ASSESSINGLEVEL) {

      if (this.counter == 0){
        this.updateGameState(GAMESTATE.LEVELDONE)
        this.clickedUnits.clear()

        // expicitly reset the checkmark or crossmark
        if (this.wrongAnswer){
          let crossmark = document.getElementById("screen-crossmark")
          crossmark.style.display = 'none';
          crossmark.classList.remove("grow-crossmark");
        }else{
          let checkmark = document.getElementById("screen-checkmark")
          checkmark.style.display = 'none';
          checkmark.classList.remove("grow-checkmark");
        }       
      }
      this.counter -= 1;

    }

    if (this.gamestate === GAMESTATE.LEVELDONE){
      this.dx = - 2 * this.rect.right / this.step;

      if (this.moveLevelOutsideFrame()){
        this.centeredXMod = 2 * this.rect.right;
        this.dx = this.centeredXMod / this.step;
        this.updateGameState(GAMESTATE.NEWLEVEL)
        this.updateCurrentSequence(this.currentSequence + 1)
        this.elements = drawBoard(this)
      }
    }

    if (this.gamestate === GAMESTATE.NEWLEVEL){
      if (Math.floor(this.centeredXMod) <= 0 ){
        this.dx = 0
        this.centeredXMod = 0
        this.updateGameState(GAMESTATE.RUNNING)

      }else{
        this.moveLevelInsideFrame()
      }
      this.centeredXMod = this.centeredXMod - this.dx;     
      this.wrongAnswer = false

    }
    
    updateGameStateForHelperScreens(this, GAMESTATE)


  }

  draw(ctx) {
    if (this.gamestate === GAMESTATE.RUNNING || this.gamestate === GAMESTATE.LEVELDONE || this.gamestate === GAMESTATE.NEWLEVEL || this.gamestate === GAMESTATE.ASSESSINGLEVEL) {
      this.elements['centeredSum'].draw(ctx);
        [...this.elements['units']].forEach((object) => {
            object.draw(ctx)
          });
      }

    
  }

  updateGameState(state){
    this.gamestate = state;
  }

  // checkPlayButtonClick(clientX, clientY){
  //   if (circleAndMouseCollissionDetection(this.gameWidth/2, this.gameHeight/2, this.helperScreens.menu.buttonRadius, this.mouse)){
  //     this.updateGameState(GAMESTATE.RUNNING)
  //   }
  // }

  handleUnitClick(clientX, clientY){
    this.clicked = {
      x:clientX,
      y:clientY
    };
    
    // this way it will never check the middle unit
    [...this.elements['units']].forEach((object) => {
      // find the Grid Unit that was actually clicked
      if (pointInsidePolygon([this.clicked.x, this.clicked.y],object.path)){
        object.clicked = true;
        this.clickedUnits.add(object)
      }
    });
  }


  togglePause() {
    console.log('TEST')
    if (this.gamestate == GAMESTATE.PAUSED) {
      this.gamestate = GAMESTATE.RUNNING;
    } else {
      this.gamestate = GAMESTATE.PAUSED;
    }
  }
}
