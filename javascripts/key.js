class Key {
  constructor(gameLevelInstance, dimension, position) {
    this.game = gameLevelInstance;
    this.dimension = [dimension[0], dimension[1]];
    this.position = [position[0], position[1]];
  }

  checkIntersection(element) {

    // We'll use this to check for intersections between player and enemy and spell and enemy
    return (
      // is right edge of element in front of left edge of key
      element.position[0] + element.dimension[0] > this.position[0] &&
      // is left edge of element before of right edge of key
      element.position[0] < this.position[0] + this.dimension[0] &&
      // is bottom edge of element below top edge of key
      element.position[1] + element.dimension[1] > this.position[1] &&
      // is top edge of element above bottom edge of key
      element.position[1] < this.position[1] + this.dimension[1]
    );
  }
}
