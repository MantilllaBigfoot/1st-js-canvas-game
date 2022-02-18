//Regions: ctrl+M ctrl+R
let tileset = null,
  tileseturl = '/tileset.png',
  tilesetLoaded = false;

let floorTypes = {
  solid: 0,
  path: 1,
  water: 2
};
let tileTypes = {
  0: {
    colour: '#685b48',
    floor: floorTypes.solid,
    sprite: [{ x: 0, y: 0, w: 40, h: 40 }]
  },
  1: {
    colour: '#5aa457',
    floor: floorTypes.path,
    sprite: [{ x: 40, y: 0, w: 40, h: 40 }]
  },
  2: {
    colour: '#e8bd7a',
    floor: floorTypes.path,
    sprite: [{ x: 80, y: 0, w: 40, h: 40 }]
  },
  3: {
    colour: '#286625',
    floor: floorTypes.solid,
    sprite: [{ x: 120, y: 0, w: 40, h: 40 }]
  },
  4: {
    colour: '#678fd9',
    floor: floorTypes.water,
    sprite: [{ x: 160, y: 0, w: 40, h: 40 }]
  }
};

let directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
};

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
    this.directions = {
      up: 0,
      right: 1,
      down: 2,
      left: 3
    };
    this.player = new Player(this);
    this.viewport = new ViewPort(this);
    this.drawLevel();
    this.enableControls();
    this.viewport.screen = [canvas.width, canvas.height];

    tileset = new Image();
    tileset.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    tileset.onload = () => (tilesetLoaded = true);
    tileset.src = tileseturl;
    console.log(tileset);
  }

  //Creates the map with obstacles
  createMapArr() {
    const mapArr = [
      0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0, 0, 2, 3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      0, 2, 2, 0, 0, 2, 3, 1, 4, 4, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 0, 0, 2, 3, 1,
      1, 4, 4, 1, 2, 3, 3, 2, 1, 1, 2, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2,
      2, 2, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 2, 4, 4,
      4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 1, 0, 0, 1, 1, 1, 1, 2, 3, 2, 1, 1, 4, 1, 1, 1, 1, 3,
      3, 2, 1, 0, 0, 1, 2, 2, 2, 2, 1, 2, 1, 1, 4, 1, 1, 1, 1, 1, 3, 2, 1, 0, 0, 1, 2, 3,
      3, 2, 1, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 0, 1, 2, 3, 3, 2, 1, 2, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 2, 3, 4, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0,
      0, 3, 2, 3, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 1, 0, 0, 3, 2, 3, 4, 4, 3, 2,
      1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 0, 0, 3, 2, 3, 4, 1, 3, 2, 1, 3, 1, 1, 1, 2, 1, 1,
      1, 2, 3, 0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 3, 0, 0, 1, 1, 1,
      1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
          this.player.direction = this.directions.up;
          if (this.isAllowedToMove('Up')) {
            this.player.position[1] -= this.speed;
          }
          break;
        case 'ArrowDown':
          this.player.direction = this.directions.down;
          if (this.isAllowedToMove('Down')) {
            this.player.position[1] += this.speed;
          }
          break;
        case 'ArrowRight':
          this.player.direction = this.directions.right;
          if (this.isAllowedToMove('Right')) {
            this.player.position[0] += this.speed;
          }
          break;
        case 'ArrowLeft':
          this.player.direction = this.directions.left;
          if (this.isAllowedToMove('Left')) {
            this.player.position[0] -= this.speed;
          }
          break;
      }
    });
  }

  toIndex(x, y) {
    return y * this.mapArrayWidth + x;
  }

  drawLevel() {
    window.requestAnimationFrame(() => {
      this.getFrameRate();

      //CameraMovement
      this.viewport.update(
        this.player.position[0] + this.player.dimension[0] / 2,
        this.player.position[1] + this.player.dimension[1] / 2
      );
      this.context.fillStyle = '#000000';
      this.context.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);

      //Fill the Map
      for (let y = this.viewport.startTile[1]; y <= this.viewport.endTile[1]; y++) {
        for (let x = this.viewport.startTile[0]; x <= this.viewport.endTile[0]; x++) {
          let tile = tileTypes[this.mapArr[this.toIndex(x, y)]];
          console.dir(this.viewport.offset[0] + x * this.tileW);
          this.context.drawImage(
            tileset,
            tile.sprite[0].x,
            tile.sprite[0].y,
            tile.sprite[0].w,
            tile.sprite[0].h,
            this.viewport.offset[0] + x * this.tileW,
            this.viewport.offset[1] + y * this.tileH,
            this.tileW,
            this.tileH
          );
          // this.context.drawImage(
          //   tileset,
          //   tile.sprite[0].x,
          //   tile.sprite[0].y,
          //   tile.sprite[0].w,
          //   tile.sprite[0].h,
          //   this.viewport.offset[0] + x * this.tileW,
          //   this.viewport.offset[1] + y * this.tileH
          // );
          // this.context.fillStyle =
          //   tileTypes[this.mapArr[y * this.mapArrayWidth + x]].colour;
          // switch (this.mapArr[y * this.mapArrayWidth + x]) {
          //   case 0:
          //     this.context.fillStyle = '#aff9e3';

          //     break;
          //   case 1:
          //     this.context.fillStyle = '#012355';
          //     break;
          // }
          // this.context.fillRect(
          //   this.viewport.offset[0] + x * this.tileW,
          //   this.viewport.offset[1] + y * this.tileH,
          //   this.tileW,
          //   this.tileH
          // );
        }
      }

      //Draw the player
      let sprite = this.player.sprites[this.player.direction];
      this.context.drawImage(
        tileset,
        sprite[0].x,
        sprite[0].y,
        sprite[0].w,
        sprite[0].h,
        this.viewport.offset[0] + this.player.position[0],
        this.viewport.offset[1] + this.player.position[1],
        this.player.dimension[0],
        this.player.dimension[1]
      );
      // this.context.fillStyle = '#0000ff';
      // this.context.fillRect(
      //   this.viewport.offset[0] + this.player.position[0],
      //   this.viewport.offset[1] + this.player.position[1],
      //   this.player.dimension[0],
      //   this.player.dimension[1]
      // );

      //Draw the FPS counter
      this.context.fillStyle = '#ff0000';
      this.context.fillText(`FPS: ${this.framesLastSec}`, 20, 20);
      this.lastFrameTime = this.currentFrameTime;

      //Recursion
      this.drawLevel();
    });
  }

  /* #region  FrameRate */
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
  /* #endregion */
}
