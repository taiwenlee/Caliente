class Play extends Phaser.Scene {
   constructor() {
      super("playScene");
   }

   preload() {

   }

   create() {
      // define keys
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.add.text(20, 20, "Play Scene");

      

   }

   update() {

   }
}
