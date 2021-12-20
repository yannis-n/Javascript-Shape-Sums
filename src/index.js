import Game from "../src/game.js";
import { createHiDPICanvas, rectCollisionDetection } from "../src/helper.js";

"use strict";

window.onload = function (){
  let canvas = document.getElementById("gameScreen");
  var rect = canvas.getBoundingClientRect();
  canvas = createHiDPICanvas(rect.width, rect.height);
  let ctx = canvas.getContext('2d');
  
  // let ctx = setupCanvas(canvas);
  
  let GAME_WIDTH = rect.width;
  let GAME_HEIGHT = rect.height;
  let difficulty = 1;
  
  let game = new Game(GAME_WIDTH, GAME_HEIGHT, difficulty, canvas);
  
  let lastTime = 0;
  
  function gameLoop(timestamp) {
      let deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      game.update(deltaTime)
      game.draw(ctx)
    
      requestAnimationFrame(gameLoop);
    }
    
    requestAnimationFrame(gameLoop);

    window.addEventListener('resize', function(){
      let screenContainer = document.getElementById("screen-container");
      canvas = createHiDPICanvas(screenContainer.offsetWidth, screenContainer.offsetHeight);
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx = canvas.getContext('2d');

      GAME_WIDTH = screenContainer.offsetWidth;
      GAME_HEIGHT = screenContainer.offsetHeight;

      game.updateGameSize(GAME_WIDTH, GAME_HEIGHT)

    });
    
    
}

