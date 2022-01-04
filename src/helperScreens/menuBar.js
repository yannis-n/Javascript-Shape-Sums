const MENULINKS = {
    PLAY : 0,
    TUTORIAL : 1,
  };
  
  export default class Menu {
      constructor(game) {
        this.game = game
        let markup = this.createHTML();
        let canvas = document.getElementById("gameScreen");
        this.canvas = canvas
        this.gameMenuBar = document.createElement("div");
        this.gameMenuBar.id = 'game-menu-bar'
    
        this.gameMenuBar.innerHTML = markup;
        this.gameMenuBar.leftSide = this.gameMenuBar.querySelector('.left-side');
        this.gameMenuBar.rightSide = this.gameMenuBar.querySelector('.right-side');

        this.buttons = {}
        // Create the various buttons neccessary for the menu bar
        this.buttons.undoButton = document.createElement("button");
        this.buttons.undoButton.id = 'undo-button'
        this.buttons.undoButton.innerHTML = '<div class="reloadSingle"></div>'

        this.buttons.pauseButton = document.createElement("button");
        this.buttons.pauseButton.id = 'pause'
        this.buttons.pauseButton.innerHTML = '<div class="play-pause play-pause__pause"></div>'

        // appennd in leftSide
        for (const key in this.buttons) {
            if (Object.hasOwnProperty.call(this.buttons, key)) {
                const element = this.buttons[key];
                this.gameMenuBar.leftSide.append(element)
            }
        }

        this.timer = document.createElement("div");
        this.timer.id = 'timer'
        
        this.gameMenuBar.rightSide.append(this.timer)

  
        canvas.parentNode.insertBefore(this.gameMenuBar, canvas);
        // canvas.parentNode.insertBefore(this.tutorial, canvas);
  
        this.soundToggle = document.getElementById('soundToggle');
        this.fadedout = true;
        this.soundOn = true;
        this.duration = 60 * 4;
        this.timerDown = this.duration

        this.hidden = function(){
          return this.gameMenuBar.style.opacity == 0;
        }

        this.timerMarkUp(this.duration)
        this.startTimer()

        this.eventHandler()
  
      }
  
      createHTML() {
        return `
        
        <div class="left-side"></div>
        <div class="right-side"></div>

        

        `;
      }

      timerMarkUp(countDown){
        let minutes, seconds;
        minutes = parseInt(countDown / 60, 10)
        seconds = parseInt(countDown % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        this.timer.textContent = minutes + ":" + seconds;
      }

      startTimer() {
        this.timerDown = this.duration
        --this.timerDown;
        let countDown = setInterval(function () {
            if (this.game.gamestate == this.game.GAMESTATE.RUNNING){
                this.timerMarkUp(this.timerDown)
                console.log(this.timerDown)
                if (--this.timerDown < 0) {
                    clearInterval(countDown);
                    this.timerDown = this.duration;
                }
            }
        }.bind(this), 1000);
    }
  
      eventHandler(){
        //   this.gameMenu.addEventListener('transitionend', function(event) {
        //       this.fadedout = !this.fadedout;
        //     }.bind(this));
  
        //     // this.gameMenu.querySelectorAll('a').addEventListener('click', function(event) {
        //     //   console.log(this.fadedout)
        //     // }.bind(this));
        //     let anchors = this.gameMenu.getElementsByTagName('a');
        //     for(let z = 0; z < anchors.length; z++) {
        //         let elem = anchors[z];   
        //         elem.onclick = function() {
        //             let action = elem.getAttribute('data-menu-item');
        //             if (MENULINKS.PLAY == action){
        //               console.log('this.game')
        //               if (this.game.GAMESTATE.PAUSED == this.game.gamestate){
        //                 this.unpause()
        //               }else{
        //                 this.hide()
        //               }
        //               this.game.updateGameState(this.game.GAMESTATE.RUNNING)
        //             }else if (MENULINKS.TUTORIAL == action){
        //               this.gameMenu.style.opacity = 0;
        //               this.show(this.tutorial)
        //             }
  
        //         }.bind(this);
        //     }
            this.buttons.pauseButton.onclick = function() {
              this.game.togglePause()
            }.bind(this);

            this.buttons.undoButton.onclick = function() {
                this.game.undoAnswers()
            }.bind(this);

            
        //     this.soundToggle.onchange = function(){
        //       this.soundOn = this.soundToggle.checked
        //     }.bind(this);
  
  
  
      }
  
      show(element = this.gameMenuBar){
          console.log(element)
        element.style.display = "flex";
        // setTimeout(() => {
          element.style.opacity = 1;
  
        // }, 400);
  
      }
  
      hide(element = this.gameMenuBar){ 
        element.style.opacity = 0;
        element.style.display = "none";
  
      }
  
    //   pause(element = this.gameMenu){
    //     console.log('pause')
    //     console.log(element)
    //     if (element.id == 'game-menu'){
    //       element.querySelector('.play').innerHTML = 'Resume'
    //       this.canvas.style.filter = 'brightness(0.5)'
    //     }
    //     element.style.display = "flex";
    //     element.style.opacity = 1;
    //     console.log(this.canvas)
    //   }
  
    //   unpause(element = this.gameMenu){
    //     if (element.id == 'game-menu'){
    //       this.canvas.style.filter = 'unset'
  
    //     }
    //     element.style.display = "none";
    //     element.style.opacity = 0;
  
    //   }
    
    }
    