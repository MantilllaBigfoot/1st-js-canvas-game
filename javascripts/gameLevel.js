class GameLevel {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.tileW = 50;
    this.tileH = 50;
    this.mapArrayWidth = 20;
    this.mapArrayHeight = 20;
    this.currentSec = 0;
    this.framesLastSec = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.obstacleArr = [];
    this.speed = 5;
    this.mapArr = this.createMapArr();
    console.log(this.mapArr);
    this.player = new Player(this);
    this.viewport = new ViewPort(this);
    this.drawLevel();
    this.enableControls();
    this.viewport.screen = [canvas.width, canvas.height];
  }

  //Creates the map with obstacles
  createMapArr() {
    const mapArr = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0,
      1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1,
      0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1,
      1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1,
      0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1,
      0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1,
      1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0
    ];

    // Get each element of the array and push it into an obstacle array
    for (let y = 0; y < this.mapArrayHeight; y++) {
      for (let x = 0; x < this.mapArrayWidth; x++) {
        switch (mapArr[y * this.mapArrayWidth + x]) {
          case 0:
            this.obstacleArr.push(
              new Obstacle(
                this.game,
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              )
            );
            break;
        }
      }
    }
    return mapArr;
  }

  //Check if obstacles are colliding
  isAllowedToMove(direction) {
    let allowedToMove = true;
    switch (direction) {
      case 'Up':
        for (let element of this.obstacleArr) {
          if (
            !element.checkIntersectionTop(
              this.player.dimension[0],
              this.player.dimension[1],
              this.player.position[0],
              this.player.position[1],
              this.speed
            )
          ) {
            console.log('true');
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
      case 'Down':
        for (let element of this.obstacleArr) {
          if (
            !element.checkIntersectionBottom(
              this.player.dimension[0],
              this.player.dimension[1],
              this.player.position[0],
              this.player.position[1],
              this.speed
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
      case 'Left':
        for (let element of this.obstacleArr) {
          if (
            !element.checkIntersectionLeft(
              this.player.dimension[0],
              this.player.dimension[1],
              this.player.position[0],
              this.player.position[1],
              this.speed
            )
          ) {
            allowedToMove = true;
            console.log('true');
          } else {
            return false;
          }
        }
        break;
      case 'Right':
        for (let element of this.obstacleArr) {
          if (
            !element.checkIntersectionRight(
              this.player.dimension[0],
              this.player.dimension[1],
              this.player.position[0],
              this.player.position[1],
              this.speed
            )
          ) {
            console.log('true');
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
    }
    return allowedToMove;
  }

  enableControls() {
    window.addEventListener('keydown', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
          if (this.isAllowedToMove('Up')) {
            this.player.position[1] -= this.speed;
          }
          break;
        case 'ArrowDown':
          if (this.isAllowedToMove('Down')) {
            this.player.position[1] += this.speed;
          }
          break;
        case 'ArrowRight':
          if (this.isAllowedToMove('Right')) {
            this.player.position[0] += this.speed;
          }
          break;
        case 'ArrowLeft':
          if (this.isAllowedToMove('Left')) {
            this.player.position[0] -= this.speed;
          }
          break;
      }
    });
  }

  drawLevel() {
    window.requestAnimationFrame(() => {
      this.getFrameRate();

      this.viewport.update(
        this.player.position[0] + this.player.dimension[0] / 2,
        this.player.position[1] + this.player.dimension[1] / 2
      );
      this.context.fillStyle = '#000000';
      this.context.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);

      for (let y = this.viewport.startTile[1]; y <= this.viewport.endTile[1]; y++) {
        for (let x = this.viewport.startTile[0]; x <= this.viewport.endTile[0]; x++) {
          switch (this.mapArr[y * this.mapArrayWidth + x]) {
            case 0:
              this.context.fillStyle = '#aff9e3';

              break;
            case 1:
              this.context.fillStyle = '#012355';
              break;
          }
          this.context.fillRect(
            this.viewport.offset[0] + x * this.tileW,
            this.viewport.offset[1] + y * this.tileH,
            this.tileW,
            this.tileH
          );
        }
      }

      //Draw the player
      this.context.fillStyle = '#0000ff';
      this.context.fillRect(
        this.viewport.offset[0] + this.player.position[0],
        this.viewport.offset[1] + this.player.position[1],
        this.player.dimension[0],
        this.player.dimension[1]
      );

      //Draw the FPS counter
      this.context.fillStyle = '#ff0000';
      this.context.fillText(`FPS: ${this.framesLastSec}`, 20, 20);
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
