import { circleAndMouseCollissionDetection, createPolygon, pointInsidePolygon, drawPolygon, circleInsidePolygon } from "../src/helper.js";
import Point from "./point.js";

export default class Unit {
  constructor(game,dots, position, unitMeasurement, rotation, sumUnit = false) {

    this.game = game;
    this.dots = dots;
    this.pointsRadius = 5;
    this.position = position;

    this.radius = game.unitMeasurement.radius
    this.sides = game.currentDimensions;
    // this.sides = game.currentDimensions;
    if (sumUnit){
      if (this.sides % 2 != 0){
        this.rotateAngle =  0;
  
      }else{
        this.rotateAngle =  rotation;
      }
    }else{
      this.rotateAngle =  rotation;

    }
    this.apothem = this.radius * Math.cos(Math.PI/this.sides)
    this.sideWidth = 2 * this.apothem * Math.tan(Math.PI/this.sides)
    this.outerAngle = 2 * Math.PI / this.sides
    this.path = createPolygon(this.position.x, this.position.y, this.radius, this.sides , this.rotateAngle)
    console.log(this.path)
    this.polygonHeight = Math.abs(this.path[0][1] - this.path[this.sides - 1][1])
    // Assign the designated Points for the Unit

  
    this.points = []

    for (var i = 0; i < dots; i++) {
      do{
        var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
        var plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
        var x = plusOrMinusX * Math.floor(Math.round(Math.random()*2) * this.radius/this.pointsRadius);
        var y = plusOrMinusY * Math.floor(Math.round(Math.random()*2) * this.radius/this.pointsRadius);
        console.log(this.position.y + y)
        
        // console.log( (this.polygonHeight - this.pointsRadius) / 2)
      // } while(!circleInsidePolygon([this.position.x + x, this.position.y + y],this.path , this.pointsRadius))
      } while(y > (this.polygonHeight - this.pointsRadius) / 2)
      
      this.points.push(new Point(game, {x: this.position.x +  x, y:this.position.y + y}, {x: this.position.x + x, y: this.position.y + y}))

      }
  }

  randomPoints(ctx, count, color){
   
  }

  // draw the unit circle with different border widths
  changeXCenter(dx){
    this.position.x = this.position.x + dx;
  }

  draw(ctx) {
    ctx.save();                  // Save the default state
    ctx.translate(this.position.x,this.position.y);
    ctx.rotate(this.rotateAngle);

    const row = this.row;
    let currentValue =this.game.currentBoard['choices'] 

    let pathRadius = this.pathRadius   
    // draw the unit perimeter
    drawPolygon(ctx, this.position.x, this.position.y, this.radius, this.sides , this.rotateAngle)
        if (pointInsidePolygon([this.game.clicked.x, this.game.clicked.y],this.path)){
          ctx.fillStyle = "rgba(255,114,2,1)";

        }else{
          ctx.fillStyle = "rgba(0,114,227,1)";

        }
        ctx.fill()
      ctx.closePath();


  
    


    

    
    // ctx.beginPath();
    ctx.restore();               // Restore original state

    [...this.points].forEach((object) => {
      object.draw(ctx)
    });
  }
}
