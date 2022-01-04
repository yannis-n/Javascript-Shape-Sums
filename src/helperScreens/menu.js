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
      this.gameMenu = document.createElement("div");
      this.gameMenu.id = 'game-menu'
  
      this.gameMenu.innerHTML = markup;

      this.tutorial = document.createElement("div");
      this.tutorial.id = 'tutorial'
      this.tutorialBackButton = document.createElement("div");
      this.tutorialBackButton.id = 'tutorial-back'
      this.tutorialBackButton.innerHTML = '<span> Back </span>'
      this.tutorial.append(this.tutorialBackButton)
      this.tutorial.append(game.tutorial)

      canvas.parentNode.insertBefore(this.gameMenu, canvas);
      canvas.parentNode.insertBefore(this.tutorial, canvas);

      this.soundToggle = document.getElementById('soundToggle');
      this.fadedout = true;
      this.soundOn = true;
      this.hidden = function(){
        return this.gameMenu.style.display != "flex";
      }

      this.eventHandler()

    }

    createHTML() {
      return `
        <span class="menu-title">Main Menu</span>
        <a href="#" data-menu-item="${MENULINKS.PLAY}" class="play active">Play</a>
        <a href="#" data-menu-item="${MENULINKS.TUTORIAL}">How To Play</a>
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
          }.bind(this));

          // this.gameMenu.querySelectorAll('a').addEventListener('click', function(event) {
          //   console.log(this.fadedout)
          // }.bind(this));
          let anchors = this.gameMenu.getElementsByTagName('a');
          for(let z = 0; z < anchors.length; z++) {
              let elem = anchors[z];   
              elem.onclick = function() {
                  let action = elem.getAttribute('data-menu-item');
                  if (MENULINKS.PLAY == action){
                    console.log('this.game')

                    if (this.game.GAMESTATE.PAUSED == this.game.gamestate){
                      this.unpause()

                    }else{
                      this.hide()
                    }
                    this.game.updateGameState(this.game.GAMESTATE.RUNNING)
                  }else if (MENULINKS.TUTORIAL == action){
                    this.gameMenu.style.opacity = 0;
                    this.show(this.tutorial)
                  }

              }.bind(this);
          }
          this.tutorialBackButton.onclick = function() {
            this.tutorial.style.opacity = 0;
            this.gameMenu.style.opacity = 1;
            this.tutorial.style.display = "none";
          }.bind(this);

          this.soundToggle.onchange = function(){
            this.soundOn = this.soundToggle.checked
          }.bind(this);



    }

    show(element = this.gameMenu){
      element.style.display = "flex";
      setTimeout(() => {
        element.style.opacity = 1;

      }, 400);

    }

    hide(element = this.gameMenu){ 
      element.style.opacity = 0;
      element.style.display = "none";

    }

    pause(element = this.gameMenu){
      console.log('pause')
      console.log(element)
      if (element.id == 'game-menu'){
        element.querySelector('.play').innerHTML = 'Resume'
        this.canvas.style.filter = 'brightness(0.5)'
      }
      element.style.display = "flex";
      element.style.opacity = 1;
      console.log(this.canvas)


    }

    unpause(element = this.gameMenu){
      if (element.id == 'game-menu'){
        this.canvas.style.filter = 'unset'

      }
      element.style.display = "none";
      element.style.opacity = 0;



    }
  
  }
  