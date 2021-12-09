import { circleAndMouseCollissionDetection, createPolygon, pointInsidePolygon } from "../src/helper.js";

export default class Point {
  constructor(game, position, centeredPosition) {

    this.game = game;

    this.position = position;    
    this.centeredPosition = centeredPosition;
  }

  

  // draw the unit circle with different border widths
  changeXCenter(dx){
    this.position.x = this.position.x + dx;
  }

  draw(ctx) {
    ctx.beginPath() // begin drawing
    ctx.arc(this.position.x, this.position.y, 4, 0, 2 * Math.PI, false) // specify that it's an arc
    ctx.fillStyle = 'red';

    ctx.fill() // fill it in
  
  }
}
