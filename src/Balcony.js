class Balcony extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.belowCat = false;
      this.scale = .2;
   }

   update(time, delta) {
      if(!this.scene.Cat.isResting) {
         this.y += this.scene.speed *delta / 10;

         // check if cat is above the balcony
         if(this.y - this.height * this.scale / 2 > this.scene.Cat.y + this.scene.Cat.height * this.scene.Cat.scale / 2) this.belowCat = true;
         // if cat is above the balcony, it falls down check for collision
         if(this.belowCat && this.scene.physics.world.collide(this, this.scene.Cat)) {
            this.scene.Cat.Rest();
         }

         // delete this balcony if it goes off screen
         if(this.y > game.config.height+this.height*this.scale) {
            console.log("destroy balcony");
            this.destroy();
         }
      }
   }
}