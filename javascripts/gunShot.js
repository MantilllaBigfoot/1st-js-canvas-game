class GunShot {
  constructor(gameLevelInstance, position, speed, direction, dimension) {
    this.game = gameLevelInstance;
    this.position = [position[0], position[1]];
    this.speed = speed;
    this.direction = direction;
    this.dimension = dimension;
  }

  shoot() {
    switch (this.direction) {
      case this.game.directions.up:
        this.position[1] -= this.speed;
        break;
      case this.game.directions.down:
        this.position[1] += this.speed;
        break;
      case this.game.directions.right:
        this.position[0] += this.speed;
        break;
      case this.game.directions.left:
        this.position[0] -= this.speed;
        break;
    }
  }

  draw() {
    this.game.context.fillStyle = 'black';
    this.game.context.fillRect(
      this.position[0],
      this.position[1],
      this.dimension[0],
      this.dimension[1]
    );
  }
}
