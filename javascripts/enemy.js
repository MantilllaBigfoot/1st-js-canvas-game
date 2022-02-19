class Enemy {
  constructor(gameLevelInstance, startPos, endPos, currPos, dim, speed, direction) {
    this.game = gameLevelInstance;
    this.startPosition = [startPos[0], startPos[1]];
    this.endPosition = [endPos[0], endPos[1]];
    this.currPosition = [currPos[0], currPos[1]];
    this.dimension = [dim[0], dim[1]];
    this.speed = speed;
    this.direction = direction;
    //this.direction = gameLevelInstance.directions.down;
    //this.sprites = {};
  }

  checkIntersection(element) {
    // console.log("check");
    // console.log(element.position[0] + element.dimension[0]);
    // console.log(this.currPosition[0]);
    // console.log(element.position[0]);
    // console.log(this.currPosition[0] + this.dimension[0]);
    // console.log(element.position[1] + element.dimension[1]);
    // console.log(this.currPosition[1]);
    // console.log(element.position[1]);
    // console.log(this.currPosition[1] + this.dimension[1]);
    // We'll use this to check for intersections between player and enemy and spell and enemy
    return (
      // is right edge of element in front of left edge of enemy
      element.position[0] + element.dimension[0] > this.currPosition[0] &&
      // is left edge of element before of right edge of enemy
      element.position[0] < this.currPosition[0] + this.dimension[0] &&
      // is bottom edge of element below top edge of enemy
      element.position[1] + element.dimension[1] > this.currPosition[1] &&
      // is top edge of element above bottom edge of enemy
      element.position[1] < this.currPosition[1] + this.dimension[1]
    );
  }
  handleMovement() {
    //If enemy direction is towards the endPosition (right)
    if (this.direction === 'end') {
      // If enemy right edge of enemy before the endPosition => go right
      if (this.currPosition[0] + this.dimension[0] < this.endPosition[0]) {
        this.currPosition[0] += this.speed;
      }
      //If enemy right edge is at the endPosition (right), but the top edge is not  => go up
      else if (
        this.currPosition[0] + this.dimension[0] >= this.endPosition[0] &&
        this.currPosition[1] > this.endPosition[1] - this.speed
      ) {
        this.currPosition[1] -= this.speed;
      }
      //If enemy right edge is at the endPosition (right), but the bottom edge is not  => go down
      else if (
        this.currPosition[0] + this.dimension[0] >= this.endPosition[0] &&
        this.currPosition[1] + this.dimension[1] < this.endPosition[1]
      ) {
        this.currPosition[1] += this.speed;
      }
      //If enemy right edge is at the endPosition => change direction
      else if (
        this.currPosition[0] + this.dimension[0] >= this.endPosition[0] &&
        this.currPosition[1] <= this.endPosition[1] - this.speed
      ) {
        this.direction = 'start';
      }
    } else if (this.direction === 'start') {
      //If enemy left edge is at the startPosition (left), but the top edge is not  => go up
      if (
        this.currPosition[0] >= this.startPosition[0] &&
        this.currPosition[1] > this.startPosition[1] - this.speed
      ) {
        this.currPosition[1] -= this.speed;
      }
      // If enemy left edge of enemy before the startPosition => go left
      else if (this.currPosition[0] > this.startPosition[0]) {
        this.currPosition[0] -= this.speed;
      }
      //If enemy left edge is at the startPosition (left), but the bottom edge is not  => go down
      else if (
        this.currPosition[0] > this.startPosition[0] &&
        this.currPosition[1] + this.dimension[1] < this.endPosition[1]
      ) {
        this.currPosition[1] += this.speed;
        console.log('down');
      }
      //If enemy right edge is at the endPosition => change direction
      else if (this.currPosition[0] <= this.startPosition[0]) {
        this.direction = 'end';
      }
    }
  }
}
