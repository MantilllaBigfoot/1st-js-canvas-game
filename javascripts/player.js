class Player {
  constructor(gameLevelInstance) {
    this.game = gameLevelInstance;
    this.position = [60, 60];
    this.dimension = [30, 30];
    this.direction = gameLevelInstance.directions.down;
    this.sprites = {};
    this.sprites[gameLevelInstance.directions.up] = [{ x: 0, y: 18, w: 16, h: 18 }];
    this.sprites[gameLevelInstance.directions.right] = [{ x: 0, y: 54, w: 16, h: 18 }];
    this.sprites[gameLevelInstance.directions.down] = [{ x: 0, y: 0, w: 16, h: 18 }];
    this.sprites[gameLevelInstance.directions.left] = [{ x: 0, y: 36, w: 16, h: 18 }];
  }

  // //Check if obstacles are colliding
  isAllowedToMove(direction, player, obstacleArr, playerSpeed) {
    let allowedToMove = true;
    switch (direction) {
      case 'Up':
        for (let obstacle of obstacleArr) {
          if (
            !obstacle.checkIntersectionTop(
              player.dimension[0],
              player.dimension[1],
              player.position[0],
              player.position[1],
              playerSpeed
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
      case 'Down':
        for (let obstacle of obstacleArr) {
          if (
            !obstacle.checkIntersectionBottom(
              player.dimension[0],
              player.dimension[1],
              player.position[0],
              player.position[1],
              playerSpeed
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
      case 'Left':
        for (let obstacle of obstacleArr) {
          if (
            !obstacle.checkIntersectionLeft(
              player.dimension[0],
              player.dimension[1],
              player.position[0],
              player.position[1],
              playerSpeed
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
      case 'Right':
        for (let obstacle of obstacleArr) {
          if (
            !obstacle.checkIntersectionRight(
              player.dimension[0],
              player.dimension[1],
              player.position[0],
              player.position[1],
              playerSpeed
            )
          ) {
            allowedToMove = true;
          } else {
            return false;
          }
        }
        break;
    }
    return allowedToMove;
  }


}
