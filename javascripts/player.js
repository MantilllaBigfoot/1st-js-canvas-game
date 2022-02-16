class Player {
  constructor(gameLevelInstance) {
    this.game = gameLevelInstance;
    this.tileFrom = [1, 1];
    this.tileDest = [1, 1];
    this.timeMoved = 0;
    this.position = [50, 50];
    this.dimension = [30, 30];
    this.delayMove = 700;
  }

  placeAt(x, y) {
    let posX = this.game.tileW * x + (this.game.tileW - this.dimension[0]) / 2;
    let posY = this.game.tileH * y + (this.game.tileH - this.dimension[1]) / 2;
    this.tileForm = [x, y];
    this.tileDest = [x, y];
    this.position = [posX, posY];
  }

  processMovement(elapsedTime) {
    if (
      this.tileFrom[0] === this.tileDest[0] &&
      this.tileFrom[1] === this.tileDest[1]
    ) {
      return false;
    }
    if (elapsedTime - this.timeMoved >= this.delayMove) {
      this.placeAt(this.tileDest[0], this.tileDest[1]);
      //console.log(this.tileDest[1]);
    } else {
      this.position[0] =
        this.tileFrom[0] * this.game.tileW +
        (this.game.tileW - this.dimension[0]) / 2;
      this.position[1] =
        this.tileFrom[1] * this.game.tileH +
        (this.game.tileH - this.dimension[1]) / 2;
    }

    if (this.tileDest[0] !== this.tileFrom[0]) {
      let diff =
        (this.game.tileW / this.delayMove) * (elapsedTime - this.timeMoved);
      this.position[0] += this.tileDest[0] < this.tileFrom[0] ? 0 - diff : diff;
    }
    if (this.tileDest[1] !== this.tileFrom[1]) {
      let diff =
        (this.game.tileH / this.delayMove) * (elapsedTime - this.timeMoved);
      // diff =
      //   (this.game.tileH / this.delayMove) * (elapsedTime - this.timeMoved);
      // console.log(diff);
      //console.log(this.position[1]);
      this.position[1] += this.tileDest[1] < this.tileFrom[1] ? 0 - diff : diff;
      //console.log(this.position[1]);
    }

    this.position[0] = Math.round(this.position[0]);
    this.position[1] = Math.round(this.position[1]);

    return true;
  }
}
