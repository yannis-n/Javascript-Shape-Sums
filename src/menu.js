import { circleAndMouseCollissionDetection } from "../src/helper.js";

const MENULINKS = {
  PLAY: 0,
};

export default class Menu {
    constructor(game) {
      this.game = game
      let markup = this.createHTML();
      let canvas = document.getElementById("gameScreen");
     
      this.gameMenu = document.createElement("div");
      this.gameMenu.id = 'game-menu'
  
      this.gameMenu.innerHTML = markup;

  
      canvas.parentNode.insertBefore(this.gameMenu, canvas);


      this.fadedout = true

      this.hidden = function(){
        return this.gameMenu.style.display != "flex";
      }

      this.eventHandler()

    }

    createHTML() {
      return `
        <span class="menu-title">Main Menu</span>
        <a href="#" data-menu-item="${MENULINKS.PLAY}" class="active">Play</a>
        <a href="#" data-menu-item="tutorial">How To Play</a>
        <a href="#" data-menu-item="setting">Settings</a>
        <div>
          <label for="soundToggle">Sound</label>
          <label class="switch">
            <input id="soundToggle" name="soundToggle" type="checkbox" checked>
            <span class="slider round"></span>
          </label>
        </div>
      `;
    }

    eventHandler(){
        this.gameMenu.addEventListener('transitionend', function(event) {
            this.fadedout = !this.fadedout;
            console.log(this.fadedout)
          }.bind(this));

          // this.gameMenu.querySelectorAll('a').addEventListener('click', function(event) {
          //   console.log(this.fadedout)
          // }.bind(this));
          let anchors = this.gameMenu.getElementsByTagName('a');
          for(let z = 0; z < anchors.length; z++) {
              let elem = anchors[z];   
              elem.onclick = function() {
                  let action = elem.getAttribute('data-menu-item');
                  console.log(elem)
                  console.log(action)
                  if (MENULINKS.PLAY == action){
                    this.game.updateGameState(this.game.GAMESTATE.RUNNING)
                    console.log(this.game)

                  }

              }.bind(this);
          }

    }

    show(){
      this.gameMenu.style.display = "flex";
      setTimeout(() => {
        this.gameMenu.style.opacity = 1;

      }, 400);
    }

    hide(){ 

        if (myProgress.style.opacity !== 0){
            myProgress.style.opacity = 0
        }
    }
  
  }
  