class AmmoBox extends TriggerItem {
  constructor(gameLevelInstance, dimension, position) {
    super(gameLevelInstance, dimension, position);
  }

  draw(object, img, sprite, position) {
    this.game.context.drawImage(
      img,
      sprite.x,
      sprite.y,
      sprite.w,
      sprite.h,
      position[0],
      position[1],
      object.dimension[0],
      object.dimension[1]
    );
  }
}
