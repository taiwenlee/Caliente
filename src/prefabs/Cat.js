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
      this.suction1 = this.scene.sound.add('suction1', { volume: sfxVol });  // suction 1 sound
      this.suction2 = this.scene.sound.add('suction2', { volume: sfxVol });  // suction 2 sound
      this.jumpSound = this.scene.sound.add('jump', { volume: sfxVol }); // jump sound
      this.fallSound = this.scene.sound.add('wind1', { volume: sfxVol }); // fall sound
      this.climbsoundClock = null;  // timer for suction sounds
      this.climbSoundisEnabled = true;  // track if suction sounds are enabled
      this.animation = this.anims.play('climb', true);  // play climb animation
      this.animationName = 'climb';  // set animation name

      // touch support
      this.duration = 0;
      this.hold = false;
   }

   update(time, delta) {

      // initialize cat climb sound
      if (!this.climbsoundClock) {
         this.climbsoundClock = this.scene.time.addEvent({
            delay: 400,
            callback: this.climbingSounds,
            callbackScope: this,
            loop: true
         });
      }

      // if cat is lower than the starting y position, it slowly moves up while climbing
      if (this.y > this.startY && !this.isJumping && !this.isFalling && !this.isResting) {
         this.y -= this.moveSpeed * delta / 200;
      }

      // tap vs hold
      if (input.isDown) {
         this.duration += delta;
         if (this.duration > 200) { // hold for 200ms
            // fall down
            if (!this.isJumping && !this.isResting && !this.isFalling) {
               console.log('hold');
               this.hold = true;
               this.fallSound.play({ volume: sfxVol });
               this.isFalling = true;
               if (this.climbSoundisEnabled) this.climbsoundClock.paused = true;
            }
         }
      } else if (this.duration > 1 && !this.hold) {
         console.log('tap');
         // jumps from one side to another
         if (!this.isJumping && !this.isFalling && !this.isResting) {
            this.jumpSound.play({ volume: sfxVol });
            this.anims.play('jump', true);
            this.resizeHitbox();
            this.left ? this.left = false : this.left = true;
            this.flipX = this.left;
            this.isJumping = true;
            if (this.climbSoundisEnabled) this.climbsoundClock.paused = true;
         }
         this.duration = 0;
      } else {
         this.hold = false;
         this.duration = 0;
      }

      // check if cat is currently jumping and updates position if it is
      if (this.isJumping) {
         this.left ? this.x -= this.moveSpeed * delta / 10 : this.x += this.moveSpeed * delta / 10;
         // if position reached, stop jumping
         if (this.x <= this.leftPos || this.x >= this.rightPos) {
            this.left ? this.x = this.leftPos : this.x = this.rightPos;
            this.isJumping = false;
            if (this.climbSoundisEnabled) this.climbsoundClock.paused = false;
         }
      } else if (this.isFalling) {
         console.log('fall');
         this.y += this.moveSpeed * delta / 20;
         this.anims.play('fall', true);
         this.resizeHitbox();
         this.flipX = this.left;
      } else if (this.isResting && !input.isDown) {
         console.log('stop rest');
         this.isResting = false;
         if (this.climbSoundisEnabled) this.climbsoundClock.paused = false;
      } else if (this.isResting) {  // resting movement
         // resizes hitbox to match rest animation and reposition cat to balcony
         console.log('rest');
         if (this.anims.currentAnim.key != "rest") {
            this.anims.play('rest', true);
            this.flipX = this.left;
            this.resizeHitbox();
            this.y += 10;
         }
      } else { // climb movement
         this.anims.play('climb', true);
         this.flipX = this.left;
         this.resizeHitbox();
      }
   }

   Rest() {
      this.isFalling = false;
      this.isResting = true;
   }

   // check if cat is climbing and plays suction sound if it is
   climbingSounds() {
      this.climbSounds = Math.random() < 0.5 ? this.suction1 : this.suction2;
      this.climbSounds.play({ volume: sfxVol });
   }

   // disable cat climb sound
   disableClimbSounds() {
      if (this.climbSoundisEnabled) this.climbsoundClock.paused = true;
      this.climbSoundisEnabled = false;
   }

   // enable cat climb sound
   enableClimbSounds() {
      if (!this.climbSoundisEnabled) this.climbsoundClock.paused = false;
      this.climbSoundisEnabled = true;
   }

   resizeHitbox() {
      this.body.setSize(this.anims.currentFrame.width, this.anims.currentFrame.height);
   }
}
