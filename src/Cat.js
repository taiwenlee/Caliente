class Cat extends Phaser.GameObjects.Sprite {
   constructor(scene, x, y, texture, frame, BuildingPos) {
      super(scene, x, y, texture, frame);

      scene.add.existing(this);
      this.left = true;         // track if cat is moving left or right
      this.isMoving = false;    // track if cat is moving
      this.isResting = false;   // track if cat is resting
      this.leftPos = BuildingPos[0];        // set the left position of the cat
      this.rightPost = BuildingPos[1];     // set the right position of the cat
      this.moveSpeed = 5;       // set the speed of the cat
      this.scale = .3;          // scales the sprite size
   }

   update() {
      if(keySPACE.isDown && !this.isMoving) {
         this.left ? this.left = false : this.left = true;
         this.isMoving = true;
      }

      if(this.isMoving) {
         this.left ? this.x -= this.moveSpeed : this.x += this.moveSpeed;
         if(this.x <= this.leftPos || this.x >= this.rightPost) {
            this.isMoving = false;
         }
      }
   }

}
