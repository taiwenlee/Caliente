class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }

   preload() {
      
   }

   create() {

      this.add.text(20, 20, "Menu Scene");

      // basic text button to go to play scene
      const playButton = this.add.text(game.config.width/2, game.config.height/2, "Play", { fill: '#0f0'}).setOrigin(0.5);
      playButton.setInteractive();
      playButton.on('pointerdown', () => {
         this.scene.start("playScene");
      });

      
   }

   update() {

   }
}
