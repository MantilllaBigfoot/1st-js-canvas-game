class Obstacle {
  constructor(gameLevelInstance, posX, posY, tileW, tileH) {
    this.game = gameLevelInstance;
    this.width = tileW;
    this.height = tileH;
    this.position = [posX, posY];
  }

  checkIntersection(element) {
    // We'll use this to check for intersections between player and enemy and spell and enemy
    return (
      // is right edge of element in front of left edge of key
      element.position[0] + element.dimension[0] > this.position[0] &&
      // is left edge of element before of right edge of key
      element.position[0] < this.position[0] + this.width &&
      // is bottom edge of element below top edge of key
      element.position[1] + element.dimension[1] > this.position[1] &&
      // is top edge of element above bottom edge of key
      element.position[1] < this.position[1] + this.height
    );
  }
}
