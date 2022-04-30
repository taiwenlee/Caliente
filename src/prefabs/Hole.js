class Hole extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.scale = 0.5;
   }

   update(time, delta) {

      // after delay debris starts falling{
      if(!this.scene.Cat.isResting) {
         this.y += this.scene.speed * delta / 10;

      }

      // if cat collides with hole, game over
      if(this.scene.physics.world.collide(this, this.scene.Cat)) {
         this.scene.gameOver();
      }

      // delete this if its in another obstacle
      if(this.scene.physics.world.collide(this, this.scene.balconys)) {
         this.destroy();
      }

      // delete this if it goes off screen
      if(this.y > game.config.height + this.height * this.scale) {
         this.destroy();
      }
   }
}
