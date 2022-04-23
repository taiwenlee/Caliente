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

      // balconyss group
      // copied from Nathan's code (https://nathanaltice.github.io/PaddleParkourP3/)
      this.balconys = this.add.group({
         classType: Balcony,
         runChildUpdate: true
      });

      this.addBalcony();
      // adds a balcony every 7 seconds
      this.balconyTimer = this.time.addEvent({
         delay: 7000,
         callback: this.addBalcony,
         callbackScope: this,
         loop: true
      });

      // a temp stamina text
      this.staminaText = this.add.text(game.config.width/2, 20, "Stamina: " + this.stamina, { fill: '#0f0'}).setOrigin(0.5);

      // a temp height text
      this.heightText = this.add.text(game.config.width/2, 40, "Height: " + this.height, { fill: '#0f0'}).setOrigin(0.5);
   }

   // makes a Balcony object
   addBalcony() {
      let isLeft = Math.random() < 0.5;
      let balcony = new Balcony(this, isLeft ? this.buildingPos[0] : this.buildingPos[1], 0, 'balcony', 0).setOrigin(0.5);
      if(!isLeft) balcony.flipX = true;
      this.balconys.add(balcony);
   }

   update(time, delta) {
      if(this.stamina <= 0 || this.Cat.y > game.config.height) {
         this.gameOver = true;
         this.balconys.runChildUpdate = false;
      }
      if(!this.gameOver) {
         this.Cat.update(time, delta);
         // game progresses when cats not resting
         if(!this.Cat.isResting) {
            // update building tiles
            this.leftbuilding.tilePositionY -= this.speed *delta / 10;
            this.rightbuilding.tilePositionY += this.speed *delta / 10;
            
            // if cat is falling check if it hits a balcony and if so cat rests
            if(this.Cat.isFalling) {
               this.physics.world.collide(this.Cat, this.balconys, () => {
                  this.Cat.Rest();
               });
            }

            // reduces the stamina bar
            this.stamina -= 10*delta/1000;
            this.staminaText.setText("Stamina: " + this.stamina.toFixed(0));
            this.height += this.speed * delta / 1000;
            this.heightText.setText("Height: " + this.height.toFixed(0));

         } else {
            // increase the stamina bar
            if(this.stamina < 100) {
               this.stamina += 10*delta/1000;
               this.staminaText.setText("Stamina: " + this.stamina.toFixed(0));
            }
            if(this.stamina > 100) this.stamina = 100;
         }
      } else {
         // game over code here
         console.log("game over");
      }
   }
}
