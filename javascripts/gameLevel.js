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
    this.obstacleArr = [];
    this.mapArr = this.createMapArr();
    this.player = new Player(this);
    this.drawLevel();
    this.enableControls();
  }

  createMapArr() {
    const mapArr = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
      0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1,
      0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    // Get each element of the array
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
              this.player.position[1]
            )
          ) {
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
              this.player.position[1]
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
              this.player.position[1]
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
              this.player.position[1]
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
    }

    // for (let element of this.obstacleArr) {
    // if (
    //   !element.checkIntersection(
    //     this.player.dimension[0],
    //     this.player.dimension[1],
    //     this.player.position[0],
    //     this.player.position[1]
    //   )
    //   ) {
    //     allowedToMove = true;
    //   } else {
    //     return false;
    //   }
    // }
    return allowedToMove;
  }

  enableControls() {
    window.addEventListener('keydown', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
          if (this.isAllowedToMove('Up')) {
            this.player.position[1] -= 1;
          } else {
            console.log('NOT MOVE');
          }
          break;
        case 'ArrowDown':
          if (this.isAllowedToMove('Down')) {
            this.player.position[1] += 1;
          } else {
            console.log('NOT MOVE');
          }
          break;
        case 'ArrowRight':
          if (this.isAllowedToMove('Right')) {
            this.player.position[0] += 1;
          } else {
            console.log('NOT MOVE');
          }
          break;
        case 'ArrowLeft':
          if (this.isAllowedToMove('Left')) {
            this.player.position[0] -= 1;
          } else {
            console.log('NOT MOVE');
          }
          break;
      }
    });
  }

  drawLevel() {
    window.requestAnimationFrame(() => {
      var currentFrameTime = Date.now();
      this.getFrameRate();

      for (let y = 0; y < this.mapArrayHeight; y++) {
        for (let x = 0; x < this.mapArrayWidth; x++) {
          switch (this.mapArr[y * this.mapArrayWidth + x]) {
            case 0:
              this.context.fillStyle = '#999999';
              this.context.fillRect(
                x * this.tileW,
                y * this.tileH,
                this.tileWw,
                this.tileH
              );
              break;
            case 1:
              this.context.fillStyle = '#eeeeee';
              this.context.fillRect(
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              );
              break;
          }
        }
      }

      console.log(this.obstacleArr.length);
      this.context.fillStyle = '#0000ff';
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
