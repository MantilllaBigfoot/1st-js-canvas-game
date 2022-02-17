class Obstacle {
  constructor(gameLevelInstance, posX, posY, tileW, tileH) {
    this.game = gameLevelInstance;
    this.width = tileW;
    this.height = tileH;
    this.position = [posX, posY];
  }

  checkIntersection(elementWidth, elementHeight, posX, posY, speed) {
    // We'll use this to check for intersections between player and enemy and spell and enemy

    return (
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width &&
      // is bottom edge of element below top edge of enemy
      posY + elementHeight >= this.position[1] &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height
    );
  }
  //offset als übergaeparameter
  checkIntersectionTop(elementWidth, elementHeight, posX, posY, speed) {
    console.log(posY);
    console.log(this.position[1] + this.height);
    return (
      // is top edge of element above bottom edge of obstaclt
      posY <= this.position[1] + this.height &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width - speed &&
      // is bottom edge of element below top edge of enemy
      posY + elementHeight >= this.position[1] + speed //speed
    );
  }

  checkIntersectionBottom(elementWidth, elementHeight, posX, posY, speed) {
    console.log(posY + elementHeight);
    console.log(this.position[1]);
    console.log(posY + elementHeight >= this.position[1]);
    return (
      // is bottom edge of element below top edge of obstacle
      posY + elementHeight >= this.position[1] &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width - speed &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height - speed
    );
  }

  checkIntersectionLeft(elementWidth, elementHeight, posX, posY, speed) {
    console.log(posX + elementWidth);
    console.log(this.position[0]);
    return (
      // is bottom edge of element below top edge of obstaclt
      posY + elementHeight >= this.position[1] + speed &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height + speed
    );
  }

  checkIntersectionRight(elementWidth, elementHeight, posX, posY, speed) {
    return (
      // is right edge of element in front of left edge of obstaclt
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width - speed &&
      // is bottom edge of element below top edge of enemy
      posY + elementHeight >= this.position[1] + speed &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height - speed
    );
  }
}
