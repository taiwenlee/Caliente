class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   preload() {
      this.load.image('button', 'assets/button.png');
   }

   create() {
      // define keys
      keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.add.text(20, 20, "Play Scene");

      // add Alien Cat (p1)
      this.Cat = new Cat(this, 50, game.config.height/2, 'button', 0).setOrigin(0.5);


   }

   update() {
      this.Cat.update();
   }
}
