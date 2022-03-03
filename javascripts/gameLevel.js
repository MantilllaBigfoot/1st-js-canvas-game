//Regions: ctrl+M ctrl+R

/* #region  Declaration */

let tileset = null,
  tileseturl = '/src/basicSprites/tileset.png',
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

let ammoSprite = null,
  ammoSpriteUrl = '/src/gunSprites/ammobox.png',
  ammoSpriteLoaded = false;

let chestSprite = null,
  chestSpriteUrl = '/src/objectSprites/chest.png',
  chestSpriteLoaded = false;

const nyonCatAudio = new Audio('/src/sounds/nyan-cat_1.mp3');
const shotAudio = new Audio('/src/sounds/laserShot.mp3');
const ammoAudio = new Audio('/src/sounds/ammoPickup.mp3');

let floorTypes = {
  solid: 0,
  path: 1,
  water: 2,
  ice: 3
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
    //Obstacle
    colour: '#286625',
    floor: floorTypes.solid,
    sprite: [{ x: 120, y: 0, w: 40, h: 40 }]
  },
  4: {
    //Water
    colour: '#678fd9',
    floor: floorTypes.water,
    sprite: [{ x: 160, y: 0, w: 40, h: 40 }]
  },
  5: {
    //ICE
    colour: '#eeeeff',
    floor: floorTypes.ice,
    sprite: [{ x: 120, y: 120, w: 40, h: 40 }]
  }
};

let directions = {
  up: 0,
  right: 1,
  down: 2,
  left: 3
};

let playerWidth = 16;
let playerHeight = 18;
let keySpriteValues = { x: 0, y: 0, w: 20, h: 20 };
let chestSpriteValues = { x: 8, y: 8, w: 30, h: 20 };
let gunSpriteValues = { x: 0, y: 0, w: 119, h: 81 };
let ammoSpriteValues = { x: 0, y: 0, w: 181, h: 125 };

/* #endregion */

class GameLevel {
  constructor(canvas, context, displayScreens) {
    this.canvas = canvas;
    this.context = context;
    this.gameIsRunning = false;
    this.screens = displayScreens;
    this.enableControls();
    this.directions = {
      up: 0,
      right: 1,
      down: 2,
      left: 3
    };
  }

  start(countdown) {
    this.gameIsRunning = true;
    this.isAllowedToShoot = false;
    this.isAllowedToOpenChest = false;
    this.playerIsOnIce = false;
    this.playerReset = false;
    this.tileW = 50;
    this.tileH = 50;
    this.mapArrayWidth = 36;
    this.mapArrayHeight = 36;
    this.currentSec = 0;
    this.framesLastSec = 0;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.countdown = countdown;
    this.playerLoopIndex = 0;
    this.playerIsMoving = false;
    this.gunAmmo = 0;
    this.enemyLoopIndex = 0;
    this.keyLoopIndexH = 0;
    this.keyLoopIndexV = 0;
    this.obstacleArr = [];
    this.slowObstArr = [];
    this.pathObstArr = [];
    this.iceObstArr = [];
    this.waterObstArr = [];
    this.gunShots = [];
    this.originalPlayerSpeed = 5;
    this.playerSpeed = this.originalPlayerSpeed;
    this.slowPlayerSpeed = this.originalPlayerSpeed / 3;
    this.gunShotSpeed = 5;
    this.frameIndex = 0;
    this.lastUpdate = Date.now();
    this.enemyArr = [];
    this.ammoBoxes = [];
    this.createAmmoBoxes();
    this.key = this.createKey();
    this.chest = this.createChest();
    this.gun = this.createGun();
    this.generateEnemies();
    this.mapArr = this.createMapArr();
    this.playerStartPosition = [750, 800]; // [x,y]
    //this.playerStartPosition = [60, 60];
    this.player = new Player(this, this.playerStartPosition);
    this.viewport = new ViewPort(this);
    this.viewport.screen = [canvas.width, canvas.height];
    this.handlePlayerSprite(false);
    this.handleEnemySprite(false);
    this.handleKeySprite(false);
    this.countDownTrigger;
    this.runCountdown(this.countdown);
    this.handleImages();
    this.drawLevel();
    this.displayScreen('playing');
    startTitleAudio.pause();
    startTitleAudio.load();
    shotAudio.muted = false;
    gameAudio.muted = false;
    gameAudio.loop = true;
    gameAudio.play();
  }

  lose() {
    this.gameIsRunning = false;
    this.displayScreen('end');
    gameAudio.pause();
    gameAudio.load();
    startTitleAudio.muted = false;
    startTitleAudio.loop = true;
    startTitleAudio.play();
  }

  win() {
    this.gameIsRunning = false;
    this.displayScreen('winner');
    gameAudio.pause();
    gameAudio.load();
    startTitleAudio.muted = false;
    startTitleAudio.loop = true;
    startTitleAudio.play();
  }

  displayScreen(name) {
    for (let screenName in this.screens) {
      this.screens[screenName].style.display = 'none';
    }
    this.screens[name].style.display = '';
  }

  //Creates the map with obstacles
  createMapArr() {
    const mapArr = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1,
      2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
      2, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3,
      3, 1, 2, 2, 5, 5, 5, 2, 5, 5, 5, 5, 2, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 2, 2, 1, 1, 0,
      0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 2, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 5, 3,
      5, 3, 5, 3, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 2, 2, 2, 2, 2, 1,
      1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 5, 3, 5, 3, 5, 3,
      3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3,
      3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1,
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1,
      1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 3, 5, 3,
      5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 4, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
      2, 5, 5, 5, 5, 5, 5, 5, 2, 1, 4, 0, 0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 1, 2,
      1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 3, 5, 3, 5, 3, 5, 3,
      3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0,
      0, 3, 5, 3, 5, 3, 5, 3, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 4, 0, 0, 3, 4, 3, 2, 3, 4, 3, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2,
      2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 3, 4, 3, 2, 3, 4, 3, 3, 1, 1, 1,
      1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 1, 1, 1,
      1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 4, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1,
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0, 0, 1, 1, 1, 1, 1, 1, 3,
      3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1,
      1, 1, 1, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 4, 5, 5,
      5, 5, 5, 5, 5, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 5, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 5, 5, 5, 5, 5, 5, 5, 2, 1, 1, 1, 1, 1, 5,
      1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
      4, 4, 4, 4, 4, 4, 4, 0
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
            break;
          case 4:
            this.waterObstArr.push(
              new Obstacle(
                this.game,
                x * this.tileW,
                y * this.tileH,
                this.tileW,
                this.tileH
              )
            );
            break;
          case 5:
            this.iceObstArr.push(
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

  //Generates the requested Enemy
  generateEnemies() {
    this.createEnemy(1.5, [60, 40], [700, 1200], [1050, 1200]);
    this.createEnemy(1, [40, 20], [700, 1000], [900, 1000]);
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
    return new Key(this, [20, 20], [100, 1650]);
  }

  //Generates the winning chest
  createChest() {
    return new Chest(this, [30, 30], [200, 1400]);
  }

  //Generates a gun to pick up´
  createGun() {
    return new Gun(this, [20, 20], [750, 850]);
  }

  //Generates the ammoBoxes
  createAmmoBoxes() {
    this.ammoBoxes.push(new AmmoBox(this, [30, 30], [100, 300]));
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

    //gunSprite
    gunSprite = new Image();
    gunSprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    gunSprite.onload = () => (gunSpriteLoaded = true);
    gunSprite.src = gunSpriteUrl;

    //gammoSprite
    ammoSprite = new Image();
    ammoSprite.onerror = () => {
      this.canvas = null;
      console.log('Failed loading tileset.');
    };
    ammoSprite.onload = () => (ammoSpriteLoaded = true);
    ammoSprite.src = ammoSpriteUrl;

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
          if (!this.playerIsOnIce) {
            this.player.direction = this.directions.up;
            if (
              this.player.isAllowedToMove(
                'Up',
                this.player,
                this.obstacleArr,
                this.playerSpeed,
                true
              )
            ) {
              this.checkPlayerSpeed();
              this.playerIsMoving = true;
              this.player.position[1] -= this.playerSpeed;
            }
          }

          break;
        case 'ArrowDown':
        case 'KeyS':
          if (!this.playerIsOnIce) {
            this.player.direction = this.directions.down;
            if (
              this.player.isAllowedToMove(
                'Down',
                this.player,
                this.obstacleArr,
                this.playerSpeed,
                true
              )
            ) {
              this.checkPlayerSpeed();
              if (!this.playerIsOnIce) {
                this.playerIsMoving = true;
                this.player.position[1] += this.playerSpeed;
              }
            }
          }
          break;
        case 'ArrowRight':
        case 'KeyD':
          if (!this.playerIsOnIce) {
            this.player.direction = this.directions.right;
            if (
              this.player.isAllowedToMove(
                'Right',
                this.player,
                this.obstacleArr,
                this.playerSpeed,
                true
              )
            ) {
              this.checkPlayerSpeed();
              if (!this.playerIsOnIce) {
                this.playerIsMoving = true;
                this.player.position[0] += this.playerSpeed;
              }
            }
          }
          break;
        case 'ArrowLeft':
        case 'KeyA':
          if (!this.playerIsOnIce) {
            this.player.direction = this.directions.left;
            if (
              this.player.isAllowedToMove(
                'Left',
                this.player,
                this.obstacleArr,
                this.playerSpeed,
                true
              )
            ) {
              this.checkPlayerSpeed();
              if (!this.playerIsOnIce) {
                this.playerIsMoving = true;
                this.player.position[0] -= this.playerSpeed;
              }
            }
          }
          break;
        case 'Space':
          if (this.isAllowedToShoot && this.gunAmmo > 0) {
            this.playerIsMoving = false;
            this.playerFiresGun();
          }
      }
    });

    window.addEventListener('keyup', (event) => {
      const code = event.code;
      switch (code) {
        case 'ArrowUp':
        case 'KeyW':
          this.playerIsMoving = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.playerIsMoving = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.playerIsMoving = false;
          break;
        case 'ArrowLeft':
        case 'KeyA':
          this.playerIsMoving = false;
          break;
      }
    });
  }

  //Logic when Player fires a gunShot
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
    shotAudio.load();
    shotAudio.play();
    this.gunAmmo--;
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
    this.countDownTrigger = setInterval(() => {
      if (!this.gameIsRunning) {
        clearInterval(this.countDownTrigger);
        return;
      }
      if (this.countdown > 0) {
        this.countdown--;
      }
    }, 1000);
  }

  /* #region  Handle Sprites */
  handlePlayerSprite(interrupt) {
    let cycleLoop = [0, 1, 0, 2];
    this.playerIntervall = setInterval(() => {
      if (!this.gameIsRunning || interrupt) {
        clearInterval(this.playerIntervall);
        return;
      }
      let sprite = this.player.sprites[this.player.direction];
      if (this.playerIsMoving) {
        sprite[0].x = cycleLoop[this.playerLoopIndex] * playerWidth;
        this.playerLoopIndex++;
        if (this.playerLoopIndex >= cycleLoop.length) {
          this.playerLoopIndex = 0;
        }
      } else {
        sprite[0].x = 0;
      }
    }, 120);
  }

  handleEnemySprite(interrupt) {
    this.enemyLoop = setInterval(() => {
      if (!this.gameIsRunning || interrupt) {
        clearInterval(this.enemyLoop);
        return;
      }
      this.enemyArr.forEach((enemy) => {
        let sprite = enemy.sprites[this.directions.right];
        sprite[0].x = this.enemyLoopIndex * sprite[0].w;
      });
      this.enemyLoopIndex++;
      if (this.enemyLoopIndex >= 7) {
        this.enemyLoopIndex = 0;
      }
    }, 120);
  }

  handleKeySprite(interrupt) {
    this.keyLoop = setInterval(() => {
      if (!this.gameIsRunning || interrupt) {
        clearInterval(this.keyLoop);
        return;
      }
      keySpriteValues.x = this.keyLoopIndexH * keySpriteValues.w;
      keySpriteValues.y = this.keyLoopIndexV * keySpriteValues.h;
      this.keyLoopIndexH++;
      if (this.keyLoopIndexH >= 3) {
        this.keyLoopIndexV++;
        this.keyLoopIndexH = 0;
      }
      if (this.keyLoopIndexV >= 2) {
        this.keyLoopIndexV = 0;
      }
    }, 120);
  }

  handleGunShot() {
    this.gunShots.forEach((shot, index) => {
      shot.shoot();
      this.enemyArr.forEach((enemy) => {
        if (enemy.checkIntersectionWithOffset(shot)) {
          enemy.isShot = true;
          this.gunShots.splice(index, 1);
          this.countdown += 100;
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

  /* #endregion */

  //Logic when Player collides with enemy
  handlePlayerEnemyIntersection() {
    //Decreases countdown when player hits enemy
    this.enemyArr.forEach((enemy, index) => {
      if (!enemy.isShot) {
        enemy.handleMovement();
        if (enemy.checkIntersection(this.player)) {
          this.countdown--;
        }
      } else {
        enemy.handleMovementWhenShot();
        if (enemy.currPosition[0] + this.viewport.offset[0] > this.canvas.width) {
          this.enemyArr.splice(index, 1);
          nyonCatAudio.pause();
          nyonCatAudio.load();
        } else {
          nyonCatAudio.volume = 0.2;
          nyonCatAudio.play();
        }
      }
    });
  }

  checkObstacleIntersections() {
    this.iceObstArr.forEach((ice) => {
      if (ice.checkIntersection(this.player)) {
        this.playerIsOnIce = true;
        switch (this.player.direction) {
          case this.directions.up:
            this.player.position[1] -= 1;
            break;
          case this.directions.down:
            this.player.position[1] += 1;
            break;
          case this.directions.right:
            this.player.position[0] += 1;
            break;
          case this.directions.left:
            this.player.position[0] -= 1;
            break;
        }
      }
    });

    this.waterObstArr.forEach((water) => {
      if (water.checkIntersection(this.player)) {
        switch (this.player.direction) {
          case this.directions.up:
            if (water.checkIntersectionTop(this.player)) {
              console.log('check');
              this.playerReset = true;
            }

            break;
          case this.directions.down:
            if (water.checkIntersectionBottom(this.player)) {
              console.log('check');
              this.playerReset = true;
            }
            break;
          case this.directions.right:
            if (water.checkIntersectionRight(this.player)) {
              console.log('check');
              this.playerReset = true;
            }
            break;
          case this.directions.left:
            if (water.checkIntersectionLeft(this.player)) {
              console.log('check');
              this.playerReset = true;
            }
            break;
        }
      }
    });

    if (this.playerIsOnIce) {
      this.slowObstArr.forEach((slowObst) => {
        if (slowObst.checkIntersection(this.player)) {
          switch (this.player.direction) {
            case this.directions.up:
              this.playerIsOnIce = !slowObst.checkIntersectionTop(this.player);
              break;
            case this.directions.down:
              this.playerIsOnIce = !slowObst.checkIntersectionBottom(this.player);
              break;
            case this.directions.right:
              this.playerIsOnIce = !slowObst.checkIntersectionRight(this.player);
              break;
            case this.directions.left:
              this.playerIsOnIce = !slowObst.checkIntersectionLeft(this.player);
              break;
          }
        }
      });
      this.pathObstArr.forEach((path) => {
        if (path.checkIntersection(this.player)) {
          switch (this.player.direction) {
            case this.directions.up:
              this.playerIsOnIce = !path.checkIntersectionTop(this.player);
              break;
            case this.directions.down:
              this.playerIsOnIce = !path.checkIntersectionBottom(this.player);
              break;
            case this.directions.right:
              this.playerIsOnIce = !path.checkIntersectionRight(this.player);
              break;
            case this.directions.left:
              this.playerIsOnIce = !path.checkIntersectionLeft(this.player);
              break;
          }
        }
      });
    }
  }

  runLogic() {
    //Get framerate
    this.getFrameRate();

    this.checkObstacleIntersections();

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
        this.isAllowedToOpenChest = true;
        console.log('GOT THE KEY');
      }
    }

    //AmmoBox logic
    this.ammoBoxes.forEach((ammoBox, index) => {
      if (ammoBox.checkIntersection(this.player)) {
        this.ammoBoxes.splice(index, 1);
        if (this.isAllowedToShoot) {
          this.gunAmmo += 10;
          ammoAudio.load();
          ammoAudio.play();
        }
      }
    });

    //Chest logic
    if (typeof this.chest === 'object') {
      if (this.chest.checkIntersection(this.player) && this.isAllowedToOpenChest) {
        console.log('GOT THE CHEST');
        this.win();
      }
    }

    //Gun logic
    if (typeof this.gun === 'object') {
      if (this.gun.checkIntersection(this.player)) {
        this.isAllowedToShoot = true;
        this.gunAmmo += 10;
        delete this.gun;
        ammoAudio.load();
        ammoAudio.play();
      }
    }

    //Loose Game
    if (this.countdown <= 0) {
      this.lose();
    }
  }

  //Moves to the requestred Index in the array
  toIndex(x, y) {
    return y * this.mapArrayWidth + x;
  }

  //Recursively draws the map with all elements
  drawLevel() {
    window.requestAnimationFrame(() => {
      if (this.playerReset) {
        this.handlePlayerSprite(true);
        this.handleEnemySprite(true);
        this.handleKeySprite(true);
        this.start(this.countdown);
        return;
      }
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
        enemy.draw(enemy, sprite, enemySprite);
      });

      /* #region TODO */
      //         this.enemyArr.forEach((enemy) => {
      //     let sprite = enemy.sprites[this.directions.right];
      //     this.context.save();
      //     this.context.translate(sprite[0].x, sprite[0].y);
      //     if (enemy.direction === 'end')
      // this.context.scale(-1, 1);
      //     this.context.drawImage(
      //       enemySprite,
      //       0,
      //       0,
      //       sprite[0].w,
      //       sprite[0].h,
      //       this.viewport.offset[0] + enemy.currPosition[0],
      //       this.viewport.offset[1] + enemy.currPosition[1],
      //       enemy.dimension[0],
      //       enemy.dimension[1]
      //     );
      //     this.context.restore();
      //   });
      /* #endregion */

      //Draw the gunshots
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

      //Draw the AmmoBox
      this.ammoBoxes.forEach((ammoBox) => {
        ammoBox.draw(ammoBox, ammoSprite, ammoSpriteValues, [
          this.viewport.offset[0] + ammoBox.position[0],
          this.viewport.offset[1] + ammoBox.position[1]
        ]);
      });

      //Draw the FPS counter
      this.context.fillStyle = '#ff0000';
      this.context.fillText(`FPS: ${this.framesLastSec}`, 20, 20);
      this.lastFrameTime = this.currentFrameTime;

      //Draw the countdown
      this.context.fillStyle = '#ffffff';
      this.context.fillText(`Coundown: ${this.countdown}`, 80, 20);

      //Draw the ammoCounter
      this.context.fillStyle = '#ffffff';
      this.context.fillText(`Ammo: ${this.gunAmmo}`, 440, 495);

      if (this.gameIsRunning) {
        //Recursion
        this.drawLevel();
      } else {
        // this.start();
      }
      // if (this.playerReset) {
      //   this.playerReset = false;
      //   this.displayScreen('playing');
      //   this.start(this.countdown);
      // }
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
