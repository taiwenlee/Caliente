class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   preload() {
      this.load.image('cat', 'assets/cat.png');
      this.load.image('buildingtile', 'assets/buildingtile.png');
      this.load.image('background', 'assets/starfield.png');
      this.load.image('balcony', 'assets/balcony.png');
   }

   create() {
      // define keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

      // sets level, climbing speed, and stamina bar
      this.level = 1;
      this.speed = 1;
      this.stamina = 100;
      this.rest = false;
      this.height = 0;
      this.gameOver = false;

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
         runChildUpdate: true
      });

      // recursive call to add more balconies with random timing
      this.addBalconyRecursive(1000, 7000);

      // stamina bar
      this.staminaBar = new staminaBar(this, 100, 725, 400, 30, 100, 4);

      // a temp height text
      this.heightText = this.add.text(game.config.width/2, 40, "Height: " + this.height, { fill: '#0f0'}).setOrigin(0.5);
   
      // temp setting button
      const settingButton = this.add.image(game.config.width - 60, 40, 'button').setOrigin(0.5);
      settingButton.setInteractive();
      settingButton.on('pointerdown', () => {
         this.scene.launch("settingScene", {music: music});
      });
      settingButton.scale = 0.3; // temp scaling for the button
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
      this.addBalcony();
      let delay = Math.random() * (max - min) + min;
      console.log("spawn balcony in " + delay + "ms");
      this.balconyTimer = this.time.addEvent({delay: delay, callback: this.addBalconyRecursive, args: [min,max], callbackScope: this});
   }

   update(time, delta) {
      if(this.stamina <= 0 || this.Cat.y > game.config.height) {
         this.gameOver = true;
         this.obstacle.runChildUpdate = false;
      }
      if(!this.gameOver) {
         // update cat
         this.Cat.update(time, delta);

         // update stamina bar
         this.staminaBar.update(this.stamina);

         // update level
         if(this.height < 10) this.level = 1;
         else this.level = this.height / 10;

         // update speed based on level
         this.speed = Math.log(this.level) + 1;
         this.Cat.moveSpeed = this.speed * 10;

         // game progresses when cats not resting
         if(!this.Cat.isResting) {

            // update building tiles
            this.leftbuilding.tilePositionY -= this.speed *delta / 10;
            this.rightbuilding.tilePositionY += this.speed *delta / 10;

            // resume spawning
            this.balconyTimer.paused = false;

            // reduces the stamina bar
            this.stamina -= 10*delta/1000;
            this.height += this.speed * delta / 1000;
            this.heightText.setText("Height: " + this.height.toFixed(0));

         } else {
            // stop balcony spawning
            this.balconyTimer.paused = true;

            // increase the stamina bar
            if(this.stamina < 100) {
               this.stamina += 40*delta/1000;
               if(this.stamina > 100) this.stamina = 100;
            }
            

         }
      } else {
         // game over code here
         this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER').setOrigin(0.5);
         console.log("game over");
      }
   }
}
