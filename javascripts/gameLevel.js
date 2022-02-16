class GameLevel {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.tileW = 50;
    this.tileH = 50;
    this.mapArrayWidth = 10;
    this.mapArrayHeight = 10;
    this.currentSec = 0;
    this.framesLastSec = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.keysDown = {
      37: false,
      38: false,
      39: false,
      40: false
    };
    this.mapArr = this.createMapArr();
    this.player = new Player(this);
    this.drawLevel();
  }

  createMapArr() {
    const mapArr = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1,
      0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    return mapArr;
  }

  toIndex(x, y) {
    return y * this.mapArrayWidth + x;
  }

  enableControls(currentFrameTime) {
    window.addEventListener('keydown', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
          //check if the player is allowed to move
          if (
            this.player.tileFrom[1] > 0 &&
            this.mapArr[
              this.toIndex(this.player.tileFrom[0], this.player.tileFrom[1] - 1)
            ] === 1
          ) {
            //move one tile up
            this.player.tileDest[1] -= 1;
          } else {
            console.log('you cant move');
          }
          break;
        case 'ArrowDown':
          if (
            this.player.tileFrom[1] < this.mapArrayHeight - 1 &&
            this.mapArr[
              this.toIndex(this.player.tileFrom[0], this.player.tileFrom[1] + 1)
            ] === 1
          ) {
            this.player.tileDest[1] += 1;
          } else {
            console.log('you cant move');
          }
          break;
        case 'ArrowRight':
          break;
        case 'ArrowLeft':
          break;
        case 'Space':
          break;
      }
      if (
        this.player.tileFrom[0] !== this.player.tileDest[0] ||
        this.player.tileFrom[1] !== this.player.tileDest[1]
      ) {
        this.player.timeMoved = currentFrameTime;
      }
    });
  }

  drawLevel() {
    window.requestAnimationFrame(() => {
      var currentFrameTime = Date.now();
      this.getFrameRate();

      if (!this.player.processMovement(currentFrameTime)) {
        this.enableControls(currentFrameTime);
      }
      // Get each element of the array
      for (let y = 0; y < this.mapArrayHeight; y++) {
        for (let x = 0; x < this.mapArrayWidth; x++) {
          switch (this.mapArr[y * this.mapArrayWidth + x]) {
            case 0:
              this.context.fillStyle = '#999999';
              break;
            case 1:
              this.context.fillStyle = '#eeeeee';
              break;
          }
          this.context.fillRect(
            x * this.tileW,
            y * this.tileH,
            this.tileW,
            this.tileH
          );
        }
      }

      this.context.fillStyle = '#0000ff';
      console.log(this.player.position[0]);
      console.log(this.player.position[1]);
      //this.context.fillRect(50,50,50,50);
      this.context.fillRect(
        this.player.position[0],
        this.player.position[1],
        this.player.dimension[0],
        this.player.dimension[1]
      );

      this.context.fillStyle = '#ff0000';
      this.context.fillText(`FPS: ${this.framesLastSec}`, 10, 20);
      this.lastFrameTime = this.currentFrameTime;
      this.drawLevel();
    });
  }

  getFrameRate() {
    let sec = Math.floor(Date.now() / 1000);
    if (sec != this.currentSec) {
      this.currentSec = sec;
      this.framesLastSec = this.frameCount;
      this.frameCount = 1;
    } else {
      this.frameCount++;
    }
  }
}
