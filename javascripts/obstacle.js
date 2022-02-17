class Obstacle {
  constructor(gameLevelInstance, posX, posY, tileW, tileH) {
    this.game = gameLevelInstance;
    this.width = tileW;
    this.height = tileH;
    this.position = [posX, posY];
  }

  checkIntersection(elementWidth, elementHeight, posX, posY) {
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

  checkIntersectionTop(elementWidth, elementHeight, posX, posY) {
    return (
      // is top edge of element above bottom edge of obstaclt
      posY == this.position[1] + this.height &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width &&
      // is bottom edge of element below top edge of enemy
      posY + elementHeight >= this.position[1]
    );
  }

  checkIntersectionBottom(elementWidth, elementHeight, posX, posY) {
    return (
      // is bottom edge of element below top edge of obstaclt
      posY + elementHeight == this.position[1] &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height
    );
  }

  checkIntersectionLeft(elementWidth, elementHeight, posX, posY) {
    console.log(posX + elementWidth);
    console.log(this.position[0]);
    return (
      // is bottom edge of element below top edge of obstaclt
      posY + elementHeight >= this.position[1] &&
      // is right edge of element in front of left edge of enemy
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX == this.position[0] + this.width &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height
    );
  }

  checkIntersectionRight(elementWidth, elementHeight, posX, posY) {
    return (
      // is right edge of element in front of left edge of obstaclt
      posX + elementWidth == this.position[0] &&
      // is left edge of element before of right edge of enemy
      posX <= this.position[0] + this.width &&
      // is bottom edge of element below top edge of enemy
      posY + elementHeight >= this.position[1] &&
      // is top edge of element above bottom edge of enemy
      posY <= this.position[1] + this.height
    );
  }
}
