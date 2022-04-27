class Debris extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.speed = 0; // falling speed of object (default sticks to wall)
   }

   update(time, delta) {
      if(!this.scene.Cat.isResting) {
         this.y += this.scene.speed *delta / 10;

      }

      // delete this if it goes off screen
      if(this.y > game.config.height+this.height*this.scale) {
         console.log("destroy obj");
         this.destroy();
      }
   }
}
