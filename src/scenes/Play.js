class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   preload() {
      // image assets
      this.load.image('pause', './assets/images/pause.png');
      this.load.image('pauseHover', './assets/images/pauseHover.png');
      this.load.image('score', './assets/images/score.png');
      this.load.image('buildingtile', './assets/images/buildingtile.png');
      this.load.image('skyfield', './assets/images/skyfield.png');
      this.load.image('balcony', './assets/images/balcony.png');
      this.load.image('steelbalcony', './assets/images/steelbalcony.png');
      this.load.image('debris', './assets/images/brokenBuilding.png');
      this.load.image('hole', './assets/images/holeTile.png');
      this.load.image('warning', './assets/images/warning.png');
      this.load.image('gameOver', './assets/images/gameOver.png');
      this.load.image('menu', './assets/images/menu.png');
      this.load.image('menuHover', './assets/images/menuHover.png');
      this.load.image('restart', './assets/images/restart.png');
      this.load.image('restartHover', './assets/images/restartHover.png');

      // animation assets
      this.load.atlas('cat', './assets/images/cat.png', './assets/images/cat.json');

      // audio assets
      this.load.audio('death', './assets/sounds/deathstate.wav');
      this.load.audio('warningSound', './assets/sounds/debriswarning.wav');
      this.load.audio('overSound', './assets/sounds/gameover.wav');
      this.load.audio('jump', './assets/sounds/jump.wav');
      this.load.audio('suction1', './assets/sounds/suction1.mp3');
      this.load.audio('suction2', './assets/sounds/suction2.mp3');
      this.load.audio('wind1', './assets/sounds/wind1.mp3');
      this.load.audio('wind2', './assets/sounds/wind2.mp3');

   }

   create() {
      // define keys
      if (IS_TOUCH) {
         input = this.input.activePointer;
      } else {
         input = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      }

      // select sound
      this.selectSound = this.sound.add('select', { volume: sfxVol });

      // cat animations
      this.catClimb = this.anims.create({
         key: 'climb',
         frames: this.anims.generateFrameNames('cat', { prefix: 'climb', suffix: '.png', end: 7, }),
         frameRate: 10,
         repeat: -1
      });

      this.catJump = this.anims.create({
         key: 'jump',
         frames: this.anims.generateFrameNames('cat', { prefix: 'spin', suffix: '.png', end: 5, }),
         frameRate: 10,
      });

      this.catRest = this.anims.create({
         key: 'rest',
         frames: this.anims.generateFrameNames('cat', { prefix: 'rest', suffix: '.png', end: 1, }),
         frameRate: 1,
      });

      this.catFall = this.anims.create({
         key: 'fall',
         frames: this.anims.generateFrameNames('cat', { prefix: 'fall', suffix: '.png', end: 1, }),
         frameRate: 1,
      });

      // sets level, climbing speed, stamina bar, and score
      this.level = 1;
      this.startSpeed = 2;
      this.speed = this.startSpeed;
      this.stamina = 100;
      this.rest = false;
      this.height = 0;

      // game over vars
      this.over = false;
      this.overMenu = false;
      this.moveUp = true;
      this.moveDown = false;

      // building positions
      this.buildingPos = [80, 520];

      // background
      this.skyfield = this.add.tileSprite(0, 0, 600, 800, 'skyfield').setOrigin(0, 0);

      // building tiles
      this.leftbuilding = this.add.tileSprite(-150, 0, 200, 800, 'buildingtile').setOrigin(0, 0);
      this.rightbuilding = this.add.tileSprite(650, 400, 200, 800, 'buildingtile');
      this.rightbuilding.angle = 180;

      // add Alien Cat (p1)
      this.Cat = new Cat(this, 80, game.config.height / 2, 'cat', 'climb0.png', this.buildingPos).setOrigin(0.5);

      // Obstacle group
      // copied from Nathan's code (https://nathanaltice.github.io/PaddleParkourP3/)
      this.obstacle = this.add.group({
         runChildUpdate: true,
         maxSize: 20,
      });

      // Balcony group
      this.balconys = this.add.group({
         runChildUpdate: true,
         maxSize: 20,
      });

      // recursive call to add more balconies with random timing
      this.addBalconyRecursive(1000, 4000);

      // recursive call to add more debris with random timing
      this.debrisTimer = this.time.addEvent({ delay: 5000, callback: this.addDebrisRecursive, args: [5000, 10000], callbackScope: this });

      // recursive call to add more holes with random timing
      this.holeTimer = this.time.addEvent({ delay: 2500, callback: this.addHoleRecursive, args: [5000, 10000], callbackScope: this });

      // stamina bar
      this.staminaBar = new staminaBar(this, 100, 725, 400, 30, 100, 6);

      // add setting hover
      const settingHover = this.add.image(500, 50, 'pauseHover').setOrigin(0.5);
      settingHover.depth = 10;
      settingHover.scale = 0.15; // scaling for the button

      // setting button
      const settingButton = this.add.image(500, 50, 'pause').setOrigin(0.5);
      settingButton.setInteractive();
      settingButton.on('pointerdown', () => {
         this.selectSound.play({ volume: sfxVol });
         this.scene.pause().launch("settingScene", { music: music, fromScene: "playScene" });
      });
      settingButton.on('pointerover', () => { // reveal hover image
         settingButton.alpha = 0;
      });
      settingButton.on('pointerout', () => {  // return og image
         settingButton.alpha = 1;
      });
      settingButton.input.alwaysEnabled = true; // prevents flickering between two images
      settingButton.depth = 10;
      settingButton.scale = 0.15; // scaling for the button

      // score display
      const score = this.add.image(185, 50, 'score').setOrigin(0.5);
      score.depth = 10;
      score.scale = 0.15; // scaling for the display

      // a Score text
      this.heightText = this.add.text(340, 50, this.height, { fill: '#f46d3a', fontFamily: 'OCRAEXT', fontSize: 45, align: 'right' }).setOrigin(1, 0.5);
      this.heightText.depth = 10;
   }

   // makes a Balcony object
   addBalcony() {
      let isLeft = Math.random() < 0.5;
      let isMetal = Math.random() < 0.25;
      let balcony = new Balcony(this, isLeft ? this.buildingPos[0] : this.buildingPos[1], -84, isMetal ? 'steelbalcony' : 'balcony', 0, isMetal).setOrigin(0.5);
      if (!isLeft) balcony.flipX = true;
      this.balconys.add(balcony);
   }

   // recursive addBalcony function
   addBalconyRecursive(min, max) {
      this.addBalcony();
      let delay = Math.random() * (max - min) + min;
      console.log("spawn balcony in " + (delay / 1000).toFixed(2) + "sec");
      this.balconyTimer = this.time.addEvent({ delay: delay, callback: this.addBalconyRecursive, args: [min, max], callbackScope: this });
   }

   // make a hole object
   addHole() {
      let isLeft = Math.random() < 0.5;
      let hole = new Hole(this, isLeft ? this.buildingPos[0] - 80 : this.buildingPos[1] + 80, -84, 'hole', 0).setOrigin(0.5);
      if (!isLeft) hole.flipX = true;
      this.obstacle.add(hole);
   }

   // recursive addHole function
   addHoleRecursive(min, max) {
      this.addHole();
      let delay = Math.random() * (max - min) + min;
      console.log("spawn hole in " + (delay / 1000).toFixed(2) + "sec");
      this.holeTimer = this.time.addEvent({ delay: delay, callback: this.addHoleRecursive, args: [min, max], callbackScope: this });
   }

   // make a debris object
   addDebris() {
      let pos = Math.random() * (this.buildingPos[1] - this.buildingPos[0] - 100) + this.buildingPos[0] + 50;
      let debris = new Debris(this, pos, -40, 'debris', 0, this.speed).setOrigin(0.5);
      this.obstacle.add(debris);
      this.debrisSound = this.sound.add('warningSound', { volume: sfxVol });
      this.debrisSound.play({ volume: sfxVol });
   }

   // recursive addDebris function
   addDebrisRecursive(min, max) {
      this.addDebris();
      let delay = Math.random() * (max - min) + min;
      console.log("spawn debris in " + (delay / 1000).toFixed(2) + "sec");
      this.debrisTimer = this.time.addEvent({ delay: delay, callback: this.addDebrisRecursive, args: [min, max], callbackScope: this });
   }

   // gameover function
   gameOver() {
      this.over = true;
      this.deathSound = this.sound.add('death', { volume: sfxVol });
      this.deathSound.play({ volume: sfxVol });
      this.obstacle.runChildUpdate = false;
      this.balconys.runChildUpdate = false;
      this.balconyTimer.destroy();
      this.debrisTimer.destroy();
      this.holeTimer.destroy();
      this.Cat.climbsoundClock.destroy();

      // set highscore
      highscore = Math.max(highscore, this.height.toFixed(0));

      // add delay for death animation
      this.time.delayedCall(100, () => {
         // stop moving up
         this.moveUp = false;
         this.time.delayedCall(75, () => {
            // start moving down
            this.moveDown = true;
         });
      });
   }

   // gameover menu function
   gameoverMenu() {
      // game over image
      const gameEnd = this.add.image(game.config.width / 2, 350, 'gameOver').setOrigin(0.5);
      gameEnd.scale = 0.15;
      gameEnd.depth = 10;

      this.endGame = this.sound.add('overSound', { volume: sfxVol });
      this.endGame.play({ volume: sfxVol });

      // add restart hover
      const restartHover = this.add.image(200, 450, 'restartHover').setOrigin(0.5);
      restartHover.depth = 10;
      restartHover.scale = 0.15; // scaling for the button

      // setting button
      const restartButton = this.add.image(200, 450, 'restart').setOrigin(0.5);
      restartButton.setInteractive();
      restartButton.on('pointerdown', () => {
         this.endGame.stop();
         this.selectSound.play({ volume: sfxVol });
         this.time.delayedCall(100, () => {
            this.scene.restart("playScene");
         });
      });
      restartButton.on('pointerover', () => { // reveal hover image
         restartButton.alpha = 0;
      });
      restartButton.on('pointerout', () => {  // return og image
         restartButton.alpha = 1;
      });
      restartButton.input.alwaysEnabled = true; // prevents flickering between two images
      restartButton.depth = 10;
      restartButton.scale = 0.15; // scaling for the button

      // add menu hover
      const menuHover = this.add.image(435, 450, 'menuHover').setOrigin(0.5);
      menuHover.depth = 10;
      menuHover.scale = 0.15; // scaling for the button

      // menu button
      const menuButton = this.add.image(435, 450, 'menu').setOrigin(0.5);
      menuButton.setInteractive();
      menuButton.on('pointerdown', () => {
         this.endGame.stop();
         this.selectSound.play({ volume: sfxVol });
         this.scene.stop();
         this.scene.switch("menuScene",);
      });
      menuButton.on('pointerover', () => { // reveal hover image
         menuButton.alpha = 0;
      });
      menuButton.on('pointerout', () => {  // return og image
         menuButton.alpha = 1;
      });
      menuButton.input.alwaysEnabled = true; // prevents flickering between two images
      menuButton.depth = 10;
      menuButton.scale = 0.15; // scaling for the button

      console.log("game over");
   }

   update(time, delta) {

      // check if gameover states
      if (!this.over && (this.stamina <= 0 || this.Cat.y > game.config.height)) {
         this.gameOver();
      }

      if (!this.over) {
         // update cat
         this.Cat.update(time, delta);

         // restart updates
         this.resume();

         // update stamina bar
         this.staminaBar.update(this.stamina);

         // update level
         if (this.height < 10) this.level = 1;
         else this.level = this.height / 10;

         // update speed based on level
         this.speed = Math.log(this.level) + this.startSpeed;
         this.Cat.moveSpeed = this.speed * 5;

         // update animation speed
         this.catClimb.frameRate = this.speed * 5;
         this.catJump.frameRate = this.speed * 5;

         // game progresses when cats not resting
         if (!this.Cat.isResting) {
            // update bg
            this.skyfield.tilePositionY -= 1;
            // update building tiles
            this.leftbuilding.tilePositionY -= this.speed * delta / 10;
            this.rightbuilding.tilePositionY += this.speed * delta / 10;

            // if cat is climbing
            if (!this.Cat.isFalling) {
               // reduces the stamina bar
               this.stamina -= 10 * delta / 1000;
               this.height += this.speed * delta / 1000;
               this.heightText.setText(this.height.toFixed(0));
            }

         } else {
            // stop climbing sounds
            this.Cat.climbsoundClock.paused = true;

            // stop balcony spawning
            this.balconyTimer.paused = true;
            this.holeTimer.paused = true;

            // increase the stamina bar
            if (this.stamina < 100) {
               this.stamina += 40 * delta / 1000;
               if (this.stamina > 100) this.stamina = 100;
            }
         }
      } else if (this.over) {
         // cat fall animation
         this.Cat.anims.play('fall', true);

         // cat moves up a little
         if (this.moveUp) {
            this.Cat.y -= 5 * delta / 10;
            // cats falls down and dies
         } else if (!this.overMenu && this.moveDown) {
            this.Cat.y += 5 * delta / 10;
            // if cat is off screen
            if (this.Cat.y > game.config.height + this.Cat.height * this.Cat.scale) {
               this.overMenu = true;
               this.gameoverMenu();
            }
         }
      } else {
         this.pause();
      }
   }

   pause() {
      this.obstacle.runChildUpdate = false;
      this.balconys.runChildUpdate = false;
      this.balconyTimer.paused = true;
      this.debrisTimer.paused = true;
      this.holeTimer.paused = true;
      this.Cat.disableClimbSounds();
   }

   resume() {
      this.obstacle.runChildUpdate = true;
      this.balconys.runChildUpdate = true;
      this.balconyTimer.paused = false;
      this.debrisTimer.paused = false;
      this.holeTimer.paused = false;
      this.Cat.enableClimbSounds();
   }

}
