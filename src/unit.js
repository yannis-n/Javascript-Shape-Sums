import { circleAndMouseCollissionDetection, createPolygon, pointInsidePolygon, pointsColliding, drawPolygon, circleInsidePolygon } from "../src/helper.js";
import Point from "./point.js";

export default class Unit {
  constructor(game,dots, position, unitMeasurement, rotation, sumUnit = false) {

    this.game = game;
    this.dots = dots;
    this.position = position;
    this.clicked = false;

    this.radius = game.unitMeasurement.radius
    this.pointsRadius = this.radius / 10;
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

    let pathX = this.position.x
    if (game.centeredXMod > 0){
      pathX -= game.centeredXMod
    }

    // this is where the polygon's point are saved should we need to test the unit against some positional statement
    this.path = createPolygon(pathX, this.position.y, this.radius, this.sides , this.rotateAngle)
    this.polygonHeight = Math.abs(this.path[0][1] - this.path[this.sides - 1][1])

    // Assign the designated Points for the Unit
    this.pointPadding = 1
  
    // In order to make sure that the point within the unit are always contained we assign a perimeter,
    // smaller than the actual size of the polygon as the area available for point population
    let pointPerimenets = JSON.parse(JSON.stringify(this.path))

    this.pointPerimenets = pointPerimenets.map(item => {
      if (item[1] < this.position.y) {
        item[1] += this.pointsRadius * 2
      }else if (item[1] > this.position.y){
        item[1] -= this.pointsRadius * 2
      }      
      if (item[0] < this.position.y) {
        item[0] += this.pointsRadius * 2
      }else if (item[0] > this.position.y){
        item[0] -= this.pointsRadius * 2  
      };
      return item
    })

    this.points = []
    for (let i = 0; i < dots; i++) {
      do{
        var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
        var plusOrMinusY = Math.random() < 0.5 ? -1 : 1;

        // this makes sure that the random positioning of the points will only take place with centers with a distance of 2*point_radius
        var x = plusOrMinusX * Math.floor(Math.round(Math.random()) * 2 * this.pointsRadius);
        var y = plusOrMinusY * Math.floor(Math.round(Math.random()) * 2 * this.pointsRadius);
        
        var statement2 = pointsColliding([this.position.x + x, this.position.y + y], this.points)
        // var statement1 = !pointInsidePolygon([this.position.x + x, this.position.y + y],this.pointPerimenets)
      } while(statement2)
      this.points.push(new Point(game, this, {x: this.position.x +  x, y:this.position.y + y}))
      }
  }

  updateSize(position, unitMeasurement) {
    this.position = position;
    console.log(position)
    this.radius = unitMeasurement.radius
    this.pointsRadius = this.radius / 10;
    this.apothem = this.radius * Math.cos(Math.PI/this.sides)
    this.sideWidth = 2 * this.apothem * Math.tan(Math.PI/this.sides)
    let pathX = this.position.x
    if (this.game.centeredXMod > 0){
      pathX -= this.game.centeredXMod
    }
        // this is where the polygon's point are saved should we need to test the unit against some positional statement
        this.path = createPolygon(pathX, this.position.y, this.radius, this.sides , this.rotateAngle)
        this.polygonHeight = Math.abs(this.path[0][1] - this.path[this.sides - 1][1])
        
        // Assign the designated Points for the Unit
        this.pointPadding = 1
      
        // In order to make sure that the point within the unit are always contained we assign a perimeter,
        // smaller than the actual size of the polygon as the area available for point population
        let pointPerimenets = JSON.parse(JSON.stringify(this.path))
    
        this.pointPerimenets = pointPerimenets.map(item => {
          if (item[1] < this.position.y) {
            item[1] += this.pointsRadius * 2
          }else if (item[1] > this.position.y){
            item[1] -= this.pointsRadius * 2
          }      
          if (item[0] < this.position.y) {
            item[0] += this.pointsRadius * 2
          }else if (item[0] > this.position.y){
            item[0] -= this.pointsRadius * 2  
          };
          return item
        })
    
        this.points = []
        for (let i = 0; i < this.dots; i++) {
          do{
            var plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
            var plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
    
            // this makes sure that the random positioning of the points will only take place with centers with a distance of 2*point_radius
            var x = plusOrMinusX * Math.floor(Math.round(Math.random()) * 2 * this.pointsRadius);
            var y = plusOrMinusY * Math.floor(Math.round(Math.random()) * 2 * this.pointsRadius);
            
            var statement2 = pointsColliding([this.position.x + x, this.position.y + y], this.points)
            // var statement1 = !pointInsidePolygon([this.position.x + x, this.position.y + y],this.pointPerimenets)
          } while(statement2)
          this.points.push(new Point(this.game, this, {x: this.position.x +  x, y:this.position.y + y}))
          }
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
    if (this.game.clickedUnits.has(this)){
      if (!this.game.wrongAnswer){
        ctx.fillStyle = "rgba(35,224,27,1)";
      }else{
        ctx.fillStyle = "rgba(224,26,20,1)";

      }

    }else{
      ctx.fillStyle = "rgba(0,114,227,1)";

    }
    ctx.fill()
    ctx.closePath();
    
    ctx.restore();               // Restore original state

    [...this.points].forEach((object) => {
      object.draw(ctx)
    });
  }
}
