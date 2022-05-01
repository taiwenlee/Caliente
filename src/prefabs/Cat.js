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
      this.moveSpeed = 10;       // set the speed of the cat (m/s)
      this.scale = .3;          // scales the sprite size
      this.depth = 9;           // move cat to front
      this.startY = y;          // set the starting y position of the cat
      this.suction1 = this.scene.sound.add('suction1', {volume: sfxVol});  // suction 1 sound
      this.suction2 = this.scene.sound.add('suction2', {volume: sfxVol});  // suction 2 sound
      this.climbsoundClock = null;  // timer for suction sounds
      this.climbSoundisEnabled = true;  // track if suction sounds are enabled
   }

   update(time, delta) {
      // initialize cat climb sound
      if(!this.climbsoundClock) {
         this.climbsoundClock = this.scene.time.addEvent({
            delay: 400,
            callback: this.climbingSounds,
            callbackScope: this,
            loop: true
         });
      }

      // if cat is lower than the starting y position, it slowly moves up while climbing
      if(this.y > this.startY && !this.isJumping && !this.isFalling && !this.isResting) {
         this.y -= this.moveSpeed * delta / 200;
      }
      // jumps from one side to another
      if(keySPACE.isDown && !this.isJumping && !this.isFalling && !this.isResting) {
         this.left ? this.left = false : this.left = true;
         this.isJumping = true;
         if(this.climbSoundisEnabled) this.climbsoundClock.paused = true;
      }

      // check if cat is currently jumping and updates position if it is
      if(this.isJumping) {
         this.left ? this.x -= this.moveSpeed * delta / 10 : this.x += this.moveSpeed * delta / 10;
         
         // if position reached, stop jumping
         if(this.x <= this.leftPos || this.x >= this.rightPos) {
            this.left ? this.x = this.leftPos : this.x = this.rightPos;
            this.isJumping = false;
            if(this.climbSoundisEnabled) this.climbsoundClock.paused = false;
         }
      }

      // fall down
      if(keyS.isDown && !this.isJumping && !this.isResting && !this.isFalling) {
         this.isFalling = true;
         if(this.climbSoundisEnabled) this.climbsoundClock.paused = true;
      }

      if(this.isFalling) {
         this.y += this.moveSpeed * delta / 20;
      }

      if(this.isResting && keyS.isUp) {
         this.isResting = false;
         if(this.climbSoundisEnabled) this.climbsoundClock.paused = false;
      }
   }

   Rest() {
      this.isFalling = false;
      this.isResting = true;
   }

   // check if cat is climbing and plays suction sound if it is
   climbingSounds(){
      this.climbSounds = Math.random() < 0.5 ? this.suction1 : this.suction2;
      this.climbSounds.play({volume: sfxVol});
   }

   // disable cat climb sound
   disableClimbSounds() {
      if(this.climbSoundisEnabled) this.climbsoundClock.paused = true;
      this.climbSoundisEnabled = false;
   }

   // enable cat climb sound
   enableClimbSounds() {
      if(!this.climbSoundisEnabled) this.climbsoundClock.paused = false;
      this.climbSoundisEnabled = true;
   }
}
