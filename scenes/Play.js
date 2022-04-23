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

      // temp indicator of play scene
      this.add.text(20, 20, "Play Scene");

      // sets level, climbing speed, and stamina bar
      this.level = 1;
      this.speed = 1;
      this.stamina = 100;

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

      // obstacles group
      // copied from Nathan's code (https://nathanaltice.github.io/PaddleParkourP3/)
      this.obstacles = this.add.group({
         runChildUpdate: true
      });

      this.addBalcony(Math.random() < 0.5);

   }

   // makes a Balcony object
   addBalcony(isLeft) {
      let balcony = new Balcony(this, isLeft ? this.buildingPos[0] : this.buildingPos[1], 0, 'balcony', 0).setOrigin(0.5);
      if(!isLeft) balcony.flipX = true;
      this.obstacles.add(balcony);
   }

   update() {
      // update building tiles
      this.leftbuilding.tilePositionY -= this.speed;
      this.rightbuilding.tilePositionY += this.speed;

      this.Cat.update();
   }
}
