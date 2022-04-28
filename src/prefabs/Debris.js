class Debris extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, speed) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.speed = speed; // falling speed of object (default sticks to wall)
      this.scale = 0.5;
      this.isFalling = false;
      this.delay = null;
   }

   update(time, delta) {
      if(!this.delay) {
         this.delay = this.scene.time.delayedCall(1000, () => { 
            this.isFalling = true;
        });
      }

      if(this.isFalling) {
         if(!this.scene.Cat.isResting) {
            this.y += this.scene.speed * delta / 10;

         }
         this.y += this.speed * delta / 10;
      } 

      if(this.scene.physics.world.collide(this, this.scene.Cat)) {
         this.scene.gameOver();
      }

      // delete this if it goes off screen
      if(this.y > game.config.height + this.height * this.scale) {
         console.log("destroy obj");
         this.destroy();
      }
   }
}
