class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   preload() {
      this.load.image('cat', 'assets/images/cat.png');
      this.load.image('pause', 'assets/images/pause.png');
      this.load.image('pauseHover', 'assets/images/pauseHover.png');
      this.load.image('score', 'assets/images/score.png');
      this.load.image('buildingtile', 'assets/images/buildingtile.png');
      this.load.image('background', 'assets/images/starfield.png');
      this.load.image('balcony', 'assets/images/balcony.png');
      this.load.image('debris', 'assets/images/button.png');
   }

   create() {
      // define keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

      // sets level, climbing speed, and stamina bar
      this.level = 1;
      this.startSpeed = 2;
      this.speed = this.startSpeed;
      this.stamina = 100;
      this.rest = false;
      this.height = 0;
      this.over = false;

      // building positions
      this.buildingPos = [50, 550];

      // background
      this.starfield = this.add.tileSprite(0, 0, 600, 800, 'background').setOrigin(0, 0);

      // building tiles
      this.leftbuilding = this.add.tileSprite(-150, 0, 200, 800, 'buildingtile').setOrigin(0, 0);
      this.rightbuilding = this.add.tileSprite(650, 400, 200, 800, 'buildingtile');
      this.rightbuilding.angle = 180;

      // add Alien Cat (p1)
      this.Cat = new Cat(this, 50, game.config.height/2, 'cat', 0, this.buildingPos).setOrigin(0.5);

      // Obstacle group
      // copied from Nathan's code (https://nathanaltice.github.io/PaddleParkourP3/)
      this.obstacle = this.add.group({
         runChildUpdate: true,
         maxSize: 20,
      });

      // recursive call to add more balconies with random timing
      this.addBalconyRecursive(2000, 5000);

      // recursive call to add more debris with random timing
      this.addDebrisRecursive(5000, 10000);

      // stamina bar
      this.staminaBar = new staminaBar(this, 100, 725, 400, 30, 100, 4);

      // a temp height text
      this.heightText = this.add.text(game.config.width/2, 40, "Height: " + this.height, { fill: '#0f0'}).setOrigin(0.5);

      // temp fps text
      this.fpsText = this.add.text(10, 40, "0", { fill: '#0f0'}).setOrigin(0, 0.5);
   
      // add setting hover
      const settingHover = this.add.image(500, 50, 'pauseHover').setOrigin(0.5);
      settingHover.depth = 10;
      settingHover.scale = 0.15; // scaling for the button
      
      // setting button
      const settingButton = this.add.image(500, 50, 'pause').setOrigin(0.5);
      settingButton.setInteractive();
      settingButton.on('pointerdown', () => {
         pause = true;
         this.scene.launch("settingScene", {music: music});
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

      // a temp height text
      this.heightText = this.add.text(game.config.width/2 - 15, 40, "Height: " + this.height, { fill: '#ff1568'}, {fontFamily: 'OCRAEXT',}).setOrigin(0.5);
      this.heightText.depth = 10;
   }

   // makes a Balcony object
   addBalcony() {
      let isLeft = Math.random() < 0.5;
      let balcony = new Balcony(this, isLeft ? this.buildingPos[0] : this.buildingPos[1], -84, 'balcony', 0).setOrigin(0.5);
      if(!isLeft) balcony.flipX = true;
      this.obstacle.add(balcony);
   }

   // recursive addBalcony function
   addBalconyRecursive(min, max) {
      this.addBalcony(this.obstacle);
      let delay = Math.random() * (max - min) + min;
      console.log("spawn balcony in " + delay + "ms");
      this.balconyTimer = this.time.addEvent({delay: delay, callback: this.addBalconyRecursive, args: [min,max], callbackScope: this});
   }

   // make a debris object
   addDebris() {
      let pos = Math.random() * (this.buildingPos[1] - this.buildingPos[0]) + this.buildingPos[0];
      let debris = new Debris(this, pos, -20, 'debris', 0, this.speed).setOrigin(0.5);
      this.obstacle.add(debris);
   }

   // recursive addDebris function
   addDebrisRecursive(min, max) {
      this.addDebris(this.obstacle);
      let delay = Math.random() * (max - min) + min;
      console.log("spawn debris in " + delay + "ms");
      this.debrisTimer = this.time.addEvent({delay: delay, callback: this.addDebrisRecursive, args: [min,max], callbackScope: this});
   }

   update(time, delta) {
      // cheat code
      if(keyW.isDown) {
         this.stamina += 100;
      }

      // update fps text
      this.fpsText.setText(Math.round(this.game.loop.actualFps));

      // check if gameover states
      if(!this.over  && (this.stamina <= 0 || this.Cat.y > game.config.height)) {
         this.gameOver();
      }

      if(!this.over && !pause) {
         // restart updates
         if(!this.obstacle.runChildUpdate) this.obstacle.runChildUpdate = true;
         if(this.balconyTimer.paused) this.balconyTimer.paused = false;
         if(this.debrisTimer.paused) this.debrisTimer.paused = false;

         // update cat
         this.Cat.update(time, delta);

         // update stamina bar
         this.staminaBar.update(this.stamina);

         // update level
         if(this.height < 10) this.level = 1;
         else this.level = this.height / 10;

         // update speed based on level
         this.speed = Math.log(this.level) + this.startSpeed;
         this.Cat.moveSpeed = this.speed * 5;

         // game progresses when cats not resting
         if(!this.Cat.isResting) {

            // update building tiles
            this.leftbuilding.tilePositionY -= this.speed * delta / 10;
            this.rightbuilding.tilePositionY += this.speed * delta / 10;

            // resume spawning
            //this.balconyTimer.paused = false;

            // reduces the stamina bar
            this.stamina -= 10*delta/1000;
            this.height += this.speed * delta / 1000;
            this.heightText.setText("Height: " + this.height.toFixed(0));

         } else {
            // stop balcony spawning
            this.balconyTimer.paused = true;

            // increase the stamina bar
            if(this.stamina < 100) {
               this.stamina += 40 * delta / 1000;
               if(this.stamina > 100) this.stamina = 100;
            }
            

         }
      } else {
         this.obstacle.runChildUpdate = false;
         this.balconyTimer.paused = true;
         this.debrisTimer.paused = true;
      }

   }

   // game over function
   gameOver() {
      this.gameOver = true;
      this.obstacle.runChildUpdate = false;
      this.balconyTimer.destroy();
       this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', {fontFamily: 'OCRAEXT',}).setOrigin(0.5);
       console.log("game over");
   }
}
