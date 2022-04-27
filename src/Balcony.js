class Balcony extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.defaultx = x;
      this.belowCat = false;           // track if cat is below the balcony
      this.fall = false;               // track if balcony is falling
      this.shake = false;              // track if balcony is shaking
      this.fallTimer = null;
      this.scale = .2;
      this.depth = 5;
   }

   update(time, delta) {
      if(!this.scene.Cat.isResting) {
         this.y += this.scene.speed *delta / 10;

         // check if cat is above the balcony
         if(this.y - this.height * this.scale / 2 > this.scene.Cat.y + this.scene.Cat.height * this.scene.Cat.scale / 2) this.belowCat = true;

         // if cat is above the balcony, it falls down check for collision
         if(!this.scene.Cat.isResting && !this.fall && this.scene.Cat.isFalling && this.belowCat && this.scene.physics.world.collide(this, this.scene.Cat)) {
            this.scene.Cat.Rest();

            // delayed call for balcony to shake and fall
            if(this.fallTimer == null) {
               this.fallTimer = this.scene.time.delayedCall(1500, () => { 
                  this.shake = true;
                  this.fallTimer = this.scene.time.delayedCall(500, () => {
                     this.fall = true;
                     this.scene.Cat.isResting = false;
                     console.log("balcony falls");
                  });
               });
            }
            console.log("cat rest on balcony");
         }
      }

      // balcony shakes
      if(this.shake) {
         this.x = this.defaultx + Math.random() * 10 - 5;
      }

      // balcony falls down
      if(this.fall) {
         this.y += this.scene.speed * delta;
      }

      // delete this balcony if it goes off screen
      if(this.y > game.config.height+this.height*this.scale) {
         console.log("destroy balcony");
         if(this.fallTimer) this.fallTimer.remove();
         this.destroy();
      }
   }
}
