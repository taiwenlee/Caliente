class Cat extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame, BuildingPos) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.left = true;         // track if cat is moving left or right
      this.isJumping = false;    // track if cat is moving
      this.isFalling = false;   // track if cat is falling
      this.isResting = false;   // track if cat is resting
      this.leftPos = BuildingPos[0];        // set the left position of the cat
      this.rightPos = BuildingPos[1];     // set the right position of the cat
      this.moveSpeed = 10;       // set the speed of the cat
      this.scale = .3;          // scales the sprite size
      this.startY = y;          // set the starting y position of the cat
   }

   update(time, delta) {
      // if cat is lower than the starting y position, it slowly moves up while climbing
      if(this.y > this.startY && !this.isJumping && !this.isFalling && !this.isResting) {
         this.y -= this.moveSpeed *delta / 200;
      }
      // jumps from one side to another
      if(keySPACE.isDown && !this.isJumping) {
         this.left ? this.left = false : this.left = true;
         this.isJumping = true;
      }

      // check if cat is currently jumping and updates position if it is
      if(this.isJumping) {
         this.left ? this.x -= this.moveSpeed * delta / 10 : this.x += this.moveSpeed * delta / 10;
         if(this.x <= this.leftPos || this.x >= this.rightPos) {
            this.left ? this.x = this.leftPos : this.x = this.rightPos;
            this.isJumping = false;
         }
      }

      // fall down
      if(keyS.isDown && !this.isJumping && !this.isResting) {
         console.log("falling");
         this.isFalling = true;
      }

      if(this.isFalling) {
         this.y += this.moveSpeed * delta / 20;
      }

      if(this.isResting && keyS.isUp) {
         this.isResting = false;
      }
   }

   Rest() {
      this.isFalling = false;
      this.isResting = true;
   }

}
