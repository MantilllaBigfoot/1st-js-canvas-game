class ViewPort {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.screen = [0, 0];
    this.startTile = [0, 0];
    this.endTile = [0, 0];
    this.offset = [0, 0];
  }

  update(px, py) {
    this.offset[0] = Math.floor(this.screen[0] / 2 - px);
    this.offset[1] = Math.floor(this.screen[1] / 2 - py);

    let tile = [
      Math.floor(px / this.game.tileW),
      Math.floor(py / this.game.tileH)
    ];
    this.startTile[0] =
      tile[0] - 1 - Math.ceil(this.screen[0] / 2 / this.game.tileW);
    this.startTile[1] =
      tile[1] - 1 - Math.ceil(this.screen[1] / 2 / this.game.tileH);

    if (this.startTile[0] < 0) {
      this.startTile[0] = 0;
    }
    if (this.startTile[1] < 0) {
      this.startTile[1] = 0;
    }

    this.endTile[0] = tile[0] + 1 + Math.ceil(this.screen[0] / this.game.tileW);
    this.endTile[1] = tile[1] + 1 + Math.ceil(this.screen[1] / this.game.tileH);

    if (this.endTile[0] >= this.game.mapArrayWidth) {
      this.endTile[0] = this.game.mapArrayWidth - 1;
    }
    if (this.endTile[1] >= this.game.mapArrayHeight) {
      this.endTile[1] = this.game.mapArrayHeight - 1;
    }
  }
}
