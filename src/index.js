import Game from "../src/game.js";
import { createHiDPICanvas, rectCollisionDetection } from "../src/helper.js";

"use strict";

window.onload = function (){
  let canvas = document.getElementById("gameScreen");
  var rect = canvas.getBoundingClientRect();
  canvas = createHiDPICanvas(rect.width, rect.height);
  let ctx = canvas.getContext('2d');
  
  // let ctx = setupCanvas(canvas);
  
  const GAME_WIDTH = rect.width;
  const GAME_HEIGHT = rect.height;
  const difficulty = 1;
  
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

      // ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      // game.draw(ctx)
    
    
}

