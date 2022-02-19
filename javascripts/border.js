//Borders of the Map
class Border {
  constructor(gameLevelInstance, posX, posY, tileW, tileH) {
    this.game = gameLevelInstance;
    this.width = tileW;
    this.height = tileH;
    this.position = [posX, posY];
  }

  /* #region  checkIntersection */

  //Checks if the player collides with the surrounding borders
  //Takes speed as a parameter, because otherwise the player hops over the borders)

  //Default
  // checkIntersection(elementWidth, elementHeight, posX, posY, speed) {
  //   return (
  //     // is right edge of element in front of left edge of enemy
  //     posX + elementWidth >= this.position[0] &&
  //     // is left edge of element before of right edge of enemy
  //     posX <= this.position[0] + this.width &&
  //     // is bottom edge of element below top edge of enemy
  //     posY + elementHeight >= this.position[1] &&
  //     // is top edge of element above bottom edge of enemy
  //     posY <= this.position[1] + this.height
  //   );
  // }

  checkIntersectionTop(elementWidth, elementHeight, posX, posY, speed) {
    return (
      // is top edge of element above bottom edge of border
      posY <= this.position[1] + this.height &&
      // is right edge of element in front of left edge of border
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of border
      posX <= this.position[0] + this.width - speed &&
      // is bottom edge of element below top edge of border
      posY + elementHeight >= this.position[1] + speed //speed
    );
  }

  checkIntersectionBottom(elementWidth, elementHeight, posX, posY, speed) {
    return (
      // is bottom edge of element below top edge of border
      posY + elementHeight >= this.position[1] &&
      // is right edge of element in front of left edge of border
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of border
      posX <= this.position[0] + this.width - speed &&
      // is top edge of element above bottom edge of border
      posY <= this.position[1] + this.height - speed
    );
  }

  checkIntersectionLeft(elementWidth, elementHeight, posX, posY, speed) {
    return (
      // is bottom edge of element below top edge of obstaclt
      posY + elementHeight >= this.position[1] + speed &&
      // is right edge of element in front of left edge of border
      posX + elementWidth >= this.position[0] + speed &&
      // is left edge of element before of right edge of border
      posX <= this.position[0] + this.width &&
      // is top edge of element above bottom edge of border
      posY <= this.position[1] + this.height - speed
    );
  }

  checkIntersectionRight(elementWidth, elementHeight, posX, posY, speed) {
    return (
      // is right edge of element in front of left edge of obstaclt
      posX + elementWidth >= this.position[0] &&
      // is left edge of element before of right edge of border
      posX <= this.position[0] + this.width - speed &&
      // is bottom edge of element below top edge of border
      posY + elementHeight >= this.position[1] + speed &&
      // is top edge of element above bottom edge of border
      posY <= this.position[1] + this.height - speed
    );
    /* #endregion */
  }
}
