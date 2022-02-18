class Player {
  constructor(gameLevelInstance) {
    this.game = gameLevelInstance;
    this.position = [60, 60];
    this.dimension = [30, 30];
    this.direction = gameLevelInstance.directions.down;
    this.sprites = {};
    this.sprites[gameLevelInstance.directions.up] = [{ x: 0, y: 120, w: 30, h: 30 }];
    this.sprites[gameLevelInstance.directions.right] = [{ x: 0, y: 150, w: 30, h: 30 }];
    this.sprites[gameLevelInstance.directions.down] = [{ x: 0, y: 180, w: 30, h: 30 }];
    this.sprites[gameLevelInstance.directions.left] = [{ x: 0, y: 210, w: 30, h: 30 }];
  }
}
