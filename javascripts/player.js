class Player {
  constructor(gameLevelInstance) {
    this.game = gameLevelInstance;
    this.tileFrom = [1, 1];
    this.tileDest = [1, 1];
    this.timeMoved = 0;
    this.position = [60, 60];
    this.dimension = [30, 30];
    this.delayMove = 700;
  }
}
