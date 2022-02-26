//Regions: ctrl+M ctrl+R
let tileset = null,
  tileseturl = '/tileset.png',
  tilesetLoaded = false;

let playerSprite = null,
  playerSpriteUrl = '/src/playerSprites/greenPlayerSprite.png',
  playerSpriteLoaded = false;

let enemySprite = null,
  enemySpriteUrl = '/src/enemySprites/NyanCatEnemy.png',
  enemySpriteLoaded = false;

let keySprite = null,
  keySpriteUrl = '/src/objectSprites/keySprite.png',
  keySpriteLoaded = false;

let gunSprite = null,
  gunSpriteUrl = '/src/gunSprites/revolver.png',
  gunSpriteLoaded = false;

let chestSprite = null,
  chestSpriteUrl = '/src/objectSprites/chest.png',
  chestSpriteLoaded = false;

let nyonCatAudio = new Audio('/src/sounds/nyan-cat_1.mp3');

let floorTypes = {
  solid: 0,
  path: 1,
  water: 2
};

//The sprite section determins the coordinates of the spriten in the picture
let tileTypes = {
  0: {
    //Border
    colour: '#685b48',
    floor: floorTypes.solid,
    sprite: [{ x: 0, y: 0, w: 40, h: 40 }]
  },
  1: {
    //SlowObstacle
    colour: '#5aa457',
    floor: floorTypes.path,
    sprite: [{ x: 40, y: 0, w: 40, h: 40 }]
  },
  2: {
    //Path
    colour: '#e8bd7a',
    floor: floorTypes.path,
    sprite: [{ x: 80, y: 0, w: 40, h: 40 }]
  },
  3: {
    //
    colour: '#286625',
    floor: floorTypes.solid,
    sprite: [{ x: 120, y: 0, w: 40, h: 40 }]
  },
  4: {
    //Water
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

let countdown = 1000;
let isAllowedToShoot = false;
let isAllowedToOpenChest = false;

let gunAmmo = 0;
let playerWidth = 16;
let playerHeight = 18;
let playerLoopIndex = 0;
let playerIsMoving = false;

let enemyLoopIndex = 0;
let keyLoopIndexH = 0;
let keyLoopIndexV = 0;
let keySpriteValues = { x: 0, y: 0, w: 20, h: 20 };
let chestSpriteValues = { x: 8, y: 8, w: 30, h: 20 };
let gunSpriteValues = { x: 0, y: 0, w: 119, h: 81 };

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
    this.slowObstArr = [];
    this.pathObstArr = [];
    this.gunShots = [];
    this.directions = {
      up: 0,
      right: 1,
      down: 2,
      left: 3
    };
    this.originalPlayerSpeed = 5;
    this.playerSpeed = this.originalPlayerSpeed;
    this.slowPlayerSpeed = this.originalPlayerSpeed / 3;
    this.gunShotSpeed = 5;
    this.frameIndex = 0;
    this.lastUpdate = Date.now();
    this.enemyArr = [];
    this.key = this.createKey();
    this.chest = this.createChest();
    this.gun = this.createGun();
    this.generateEnemies();
    this.mapArr = this.createMapArr();
    this.player = new Player(this);
    this.viewport = new ViewPort(this);
    this.viewport.screen = [canvas.width, canvas.height];
    this.handlePlayerSprite();
    this.handleEnemySprite();
    this.handleKeySprite();
    this.runCountdown(this.countdown);
    this.handleImages();
    this.drawLevel();
    this.enableControls();
  }

  //Creates the map with obstacles
  createMapArr() {
    const mapArr = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 1, 1, 1, 1,
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
          case 3:
            this.obstacleArr.push(
              new Border(
                this.game,
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              )
            );
            break;
          case 1:
            this.slowObstArr.push(
              new Obstacle(
                this.game,
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              )
            );
            break;
          case 2:
            this.pathObstArr.push(
              new Obstacle(
                this.game,
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              )
            );
        }
      }
    }

    return mapArr;
  }

  generateEnemies() {
    this.createEnemy(1, [60, 40], [100, 200], [200, 300]);
    this.createEnemy(1, [40, 20], [100, 200], [400, 300]);
  }

  //Generates one Enemy and pushes him to the enemy Array
  createEnemy(speed, dimension, startPos, endPos) {
    const enemySpeed = speed;
    const enemyDimension = dimension;
    const enemyStartingPosition = startPos;
    const enemyEndPosition = endPos;
    const enemyCurrPosition = startPos;
    const enemy = new Enemy(
      this,
      enemyStartingPosition,
      enemyEndPosition,
      enemyCurrPosition,
      enemyDimension,
      enemySpeed,
      'end'
    );
    this.enemyArr.push(enemy);
  }

  //Generates the winning key
  createKey() {
    return new Key(this, [20, 20], [200, 200]);
  }

  createChest() {
    return new Chest(this, [30, 30], [200, 300]);
  }

  //Generates a gun to pick up´
  createGun() {
    return new Gun(this, [20, 20], [70, 200]);
  }

  //Tries to load the images
  handleImages() {
    tileset = new Image();
    tileset.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    tileset.onload = () => (tilesetLoaded = true);
    tileset.src = tileseturl;

    //playerSprite
    playerSprite = new Image();
    playerSprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    playerSprite.onload = () => (playerSpriteLoaded = true);
    playerSprite.src = playerSpriteUrl;

    //enemySprite
    enemySprite = new Image();
    enemySprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    enemySprite.onload = () => (enemySpriteLoaded = true);
    enemySprite.src = enemySpriteUrl;

    //keySprite
    keySprite = new Image();
    keySprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    keySprite.onload = () => (keySpriteLoaded = true);
    keySprite.src = keySpriteUrl;

    //keySprite
    gunSprite = new Image();
    gunSprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    gunSprite.onload = () => (gunSpriteLoaded = true);
    gunSprite.src = gunSpriteUrl;

    chestSprite = new Image();
    chestSprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    chestSprite.onload = () => (chestSpriteLoaded = true);
    chestSprite.src = chestSpriteUrl;
  }

  //Handles the keyboard input
  enableControls() {
    window.addEventListener('keydown', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
        case 'KeyW':
          this.player.direction = this.directions.up;
          if (
            this.player.isAllowedToMove(
              'Up',
              this.player,
              this.obstacleArr,
              this.playerSpeed
            )
          ) {
            this.checkPlayerSpeed();
            playerIsMoving = true;
            this.player.position[1] -= this.playerSpeed;
          }
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.player.direction = this.directions.down;
          if (
            this.player.isAllowedToMove(
              'Down',
              this.player,
              this.obstacleArr,
              this.playerSpeed
            )
          ) {
            this.checkPlayerSpeed();
            playerIsMoving = true;
            this.player.position[1] += this.playerSpeed;
          }
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.player.direction = this.directions.right;
          if (
            this.player.isAllowedToMove(
              'Right',
              this.player,
              this.obstacleArr,
              this.playerSpeed
            )
          ) {
            this.checkPlayerSpeed();
            playerIsMoving = true;
            this.player.position[0] += this.playerSpeed;
          }
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.player.direction = this.directions.left;
          if (
            this.player.isAllowedToMove(
              'Left',
              this.player,
              this.obstacleArr,
              this.playerSpeed
            )
          ) {
            this.checkPlayerSpeed();
            playerIsMoving = true;
            this.player.position[0] -= this.playerSpeed;
          }
          break;
        case 'Space':
          if (isAllowedToShoot && gunAmmo > 0) {
            playerIsMoving = false;
            this.playerFiresGun();
          }
      }
    });

    window.addEventListener('keyup', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
        case 'KeyW':
          playerIsMoving = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          playerIsMoving = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          playerIsMoving = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          playerIsMoving = false;
          break;
      }
    });
  }

  playerFiresGun() {
    const position = [];
    const dimension = [10, 10];

    switch (this.player.direction) {
      case this.directions.up:
        position.push(
          this.player.position[0] +
            this.player.dimension[0] / 2 +
            this.viewport.offset[0] -
            dimension[0] / 2
        );
        position.push(this.player.position[1] + this.viewport.offset[1]);
        break;
      case this.directions.down:
        position.push(
          this.player.position[0] +
            this.player.dimension[0] / 2 +
            this.viewport.offset[0] -
            dimension[0] / 2
        );
        position.push(
          this.player.position[1] + this.player.dimension[1] + this.viewport.offset[1]
        );
        break;
      case this.directions.left:
        position.push(this.player.position[0] + this.viewport.offset[0]);
        position.push(
          this.player.position[1] +
            this.player.dimension[1] / 2 +
            this.viewport.offset[1] -
            dimension[1] / 2
        );
        break;
      case this.directions.right:
        position.push(
          this.player.position[0] + this.player.dimension[0] + this.viewport.offset[0]
        );
        position.push(
          this.player.position[1] +
            this.player.dimension[1] / 2 +
            this.viewport.offset[1] -
            dimension[1] / 2
        );
        break;
    }
    const gunShot = new GunShot(
      this,
      position,
      this.gunShotSpeed,
      this.player.direction,
      [10, 10]
    );
    this.gunShots.push(gunShot);
    gunAmmo--;
  }

  //Slows player when going over slowObstacle
  checkPlayerSpeed() {
    this.slowObstArr.forEach((element) => {
      if (element.checkIntersection(this.player)) {
        this.playerSpeed = this.slowPlayerSpeed;
        return;
      }
    });
    this.pathObstArr.forEach((element) => {
      if (element.checkIntersection(this.player)) {
        this.playerSpeed = this.originalPlayerSpeed;
        return;
      }
    });
  }

  //Continuoulsy decreases the countdown
  runCountdown() {
    setInterval(() => {
      countdown--;
    }, 1000);
  }

  handlePlayerSprite() {
    let cycleLoop = [0, 1, 0, 2];
    setInterval(() => {
      let sprite = this.player.sprites[this.player.direction];
      if (playerIsMoving) {
        sprite[0].x = cycleLoop[playerLoopIndex] * playerWidth;
        playerLoopIndex++;
        if (playerLoopIndex >= cycleLoop.length) {
          playerLoopIndex = 0;
        }
      } else {
        sprite[0].x = 0;
      }
    }, 120);
  }

  handleEnemySprite() {
    setInterval(() => {
      this.enemyArr.forEach((enemy) => {
        let sprite = enemy.sprites[this.directions.right];
        sprite[0].x = enemyLoopIndex * sprite[0].w;
      });
      enemyLoopIndex++;
      if (enemyLoopIndex >= 7) {
        enemyLoopIndex = 0;
      }
    }, 120);
  }

  handleKeySprite() {
    setInterval(() => {
      keySpriteValues.x = keyLoopIndexH * keySpriteValues.w;
      keySpriteValues.y = keyLoopIndexV * keySpriteValues.h;
      keyLoopIndexH++;
      if (keyLoopIndexH >= 3) {
        keyLoopIndexV++;
        keyLoopIndexH = 0;
      }
      if (keyLoopIndexV >= 2) {
        keyLoopIndexV = 0;
      }
    }, 120);
  }

  handleGunShot() {
    this.gunShots.forEach((shot, index) => {
      shot.shoot();
      this.enemyArr.forEach((enemy, index) => {
        if (enemy.checkIntersectionWithOffset(shot)) {
          enemy.isShot = true;
          countdown += 100;
        }
      });
      if (
        shot.position[0] + shot.dimension[0] > this.canvas.width ||
        shot.position[0] < 0 ||
        shot.position[1] + shot.dimension[1] > this.canvas.height ||
        shot.position[1] < 0
      ) {
        this.gunShots.splice(index, 1);
      }
    });
  }

  handlePlayerEnemyIntersection() {
    //Decreases countdown when player hits enemy
    this.enemyArr.forEach((enemy, index) => {
      if (!enemy.isShot) {
        enemy.handleMovement();
        if (enemy.checkIntersection(this.player)) {
          countdown--;
        }
      } else {
        enemy.handleMovementWhenShot();
        if (enemy.currPosition[0] + this.viewport.offset[0] > this.canvas.width) {
          this.enemyArr.splice(index, 1);
          nyonCatAudio.pause();
          nyonCatAudio.load();
        } else {
          nyonCatAudio.play();
        }
      }
    });
  }

  runLogic() {
    //Get framerate
    this.getFrameRate();

    //CameraMovement
    this.viewport.update(
      this.player.position[0] + this.player.dimension[0] / 2,
      this.player.position[1] + this.player.dimension[1] / 2
    );
    this.context.fillStyle = '#000000';
    this.context.fillRect(0, 0, this.viewport.screen[0], this.viewport.screen[1]);

    //Player-Enemy logic
    this.handlePlayerEnemyIntersection();
    this.handleGunShot();

    //Key logic
    if (typeof this.key === 'object') {
      if (this.key.checkIntersection(this.player)) {
        delete this.key;
        isAllowedToOpenChest = true;
        console.log('GOT THE KEY');
      }
    }

    if (typeof this.chest === 'object') {
      if (this.chest.checkIntersection(this.player) && isAllowedToOpenChest) {
        console.log('GOT THE CHEST');
      }
    }

    //Gun logic
    if (typeof this.gun === 'object') {
      if (this.gun.checkIntersection(this.player)) {
        isAllowedToShoot = true;
        gunAmmo += 20;
        delete this.gun;
        console.log('GOT THE GUN');
      }
    }
  }

  //potential Bridge
  // drawBridge(x, y) {
  //   this.mapArr[this.toIndex(x, y)] = this.mapArr[this.toIndex(x, y) === 4 ? 2 : 4];
  // }

  // handleEvents(x, y) {
  //   if (x === 2 && y === 2) {
  //     console.log('moin');
  //     this.drawBridge(4, 2);
  //   }
  // }

  toIndex(x, y) {
    return y * this.mapArrayWidth + x;
  }

  //Recursively draws the map with all elements
  drawLevel() {
    window.requestAnimationFrame(() => {
      this.runLogic();
      //Draw the Map
      for (let y = this.viewport.startTile[1]; y <= this.viewport.endTile[1]; y++) {
        for (let x = this.viewport.startTile[0]; x <= this.viewport.endTile[0]; x++) {
          let tile = tileTypes[this.mapArr[this.toIndex(x, y)]];
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
          /* #region  oldCode */
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
          /* #endregion */
        }
      }

      let sprite = this.player.sprites[this.player.direction];
      this.context.drawImage(
        playerSprite,
        sprite[0].x,
        sprite[0].y,
        sprite[0].w,
        sprite[0].h,
        this.viewport.offset[0] + this.player.position[0],
        this.viewport.offset[1] + this.player.position[1],
        this.player.dimension[0],
        this.player.dimension[1]
      );

      //Draw the enemy
      this.enemyArr.forEach((enemy) => {
        let sprite = enemy.sprites[this.directions.right];
        this.context.save();
        // this.context.translate(sprite[0].x, sprite[0].y);
        this.context.scale(1, 1);
        this.context.drawImage(
          enemySprite,
          sprite[0].x,
          sprite[0].y,
          sprite[0].w,
          sprite[0].h,
          this.viewport.offset[0] + enemy.currPosition[0],
          this.viewport.offset[1] + enemy.currPosition[1],
          enemy.dimension[0],
          enemy.dimension[1]
        );
        this.context.restore();
      });

      /*
            this.enemyArr.forEach((enemy) => {
        let sprite = enemy.sprites[this.directions.right];
        this.context.save();
        this.context.translate(sprite[0].x, sprite[0].y);
        if (enemy.direction === 'end')
		this.context.scale(-1, 1);
        this.context.drawImage(
          enemySprite,
          0,
          0,
          sprite[0].w,
          sprite[0].h,
          this.viewport.offset[0] + enemy.currPosition[0],
          this.viewport.offset[1] + enemy.currPosition[1],
          enemy.dimension[0],
          enemy.dimension[1]
        );
        this.context.restore();
      });
      */

      this.gunShots.forEach((gunShot) => {
        gunShot.draw();
      });

      //Draw the key
      if (typeof this.key === 'object') {
        this.key.draw(this.key, keySprite, keySpriteValues, [
          this.viewport.offset[0] + this.key.position[0],
          this.viewport.offset[1] + this.key.position[1]
        ]);
      }

      //Draw the chest
      if (typeof this.chest === 'object') {
        this.chest.draw(this.chest, chestSprite, chestSpriteValues, [
          this.viewport.offset[0] + this.chest.position[0],
          this.viewport.offset[1] + this.chest.position[1]
        ]);
      }

      //Draw the Gun
      if (typeof this.gun === 'object') {
        this.gun.draw(this.gun, gunSprite, gunSpriteValues, [
          this.viewport.offset[0] + this.gun.position[0],
          this.viewport.offset[1] + this.gun.position[1]
        ]);
      }

      //Draw the FPS counter
      this.context.fillStyle = '#ff0000';
      this.context.fillText(`FPS: ${this.framesLastSec}`, 20, 20);
      this.lastFrameTime = this.currentFrameTime;

      //Draw the countdown
      this.context.fillStyle = '#ffffff';
      this.context.fillText(`Coundown: ${countdown}`, 80, 20);

      //Draw the ammoCounter
      this.context.fillStyle = '#ffffff';
      this.context.fillText(`Ammo: ${gunAmmo}`, 440, 495);

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
