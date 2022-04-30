class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }

   preload() {
      this.load.image('title', 'assets/images/title.png');
      this.load.image('play', 'assets/images/play.png');
      this.load.image('playHover', 'assets/images/playHover.png');
      this.load.image('settings', 'assets/images/settings.png');
      this.load.image('settingsHover', 'assets/images/settingsHover.png');      
      this.load.image('howTo', 'assets/images/howTo.png');
      this.load.image('howToHover', 'assets/images/howToHover.png');
      this.load.image('menubackground', 'assets/images/tempbackground.jpg');
      this.load.image('background', 'assets/images/starfield.png');
      this.load.audio('backgroundmusic', 'assets/sounds/Catlien.wav');
      this.load.audio('select', 'assets/sounds/select.wav');
   }

   create() {

      // background music
      music = this.sound.add('backgroundmusic', {volume: musicVol});
      music.setLoop(true);
      music.play();

      // select sound
      this.selectSound = this.sound.add('select', {volume: sfxVol});

      // add a background image
      //this.background = this.add.image(0, 0, 'menubackground');
      //this.background.setDisplaySize(game.config.width, game.config.height).setOrigin(0);
      this.starfield = this.add.tileSprite(0, 0, 600, 800, 'background').setOrigin(0, 0);

      this.add.text(20, 20, "Menu Scene", {fontFamily: 'OCRAEXT',});

      const title = this.add.image(game.config.width/2, 225, 'title').setOrigin(0.5);
      title.scale = 0.13;
      
      // add play hover image
      const playHover = this.add.image(game.config.width/2, 400, 'playHover').setOrigin(0.5);
      playHover.scale = 0.15; // scaling for the button

      // play button
      const playButton = this.add.image(game.config.width/2, 400, 'play').setOrigin(0.5);
      playButton.setInteractive();
      playButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         this.scene.start("playScene");
      });
      playButton.on('pointerover', () => { // reveal hover image
         playButton.alpha = 0;
      });
      playButton.on('pointerout', () => {  // return og image
         playButton.alpha = 1;
      });
      playButton.input.alwaysEnabled = true; // prevents flickering between two images
      playButton.scale = 0.15; // scaling for the button

      // add setting hover image
      const settingHover = this.add.image(game.config.width/2, 500, 'settingsHover').setOrigin(0.5);
      settingHover.scale = 0.15; // scaling for the button

      // setting button
      const settingButton = this.add.image(game.config.width/2, 500, 'settings').setOrigin(0.5);
      settingButton.setInteractive();
      settingButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         this.scene.pause().launch("settingScene", {music: music});
      });
      settingButton.on('pointerover', () => { // reveal hover image
         settingButton.alpha = 0;
      });
      settingButton.on('pointerout', () => {  // return og image
         settingButton.alpha = 1;
      });
      settingButton.input.alwaysEnabled = true; // prevents flickering between two images
      settingButton.scale = 0.15; // scaling for the button

      // add howTo hover image
      const howToHover = this.add.image(game.config.width/2, 600, 'howToHover').setOrigin(0.5);
      howToHover.scale = 0.15; // scaling for the button

      // setting button
      const howTo = this.add.image(game.config.width/2, 600, 'howTo').setOrigin(0.5);
      howTo.setInteractive();
      howTo.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         this.scene.pause().launch("tutorialScene", {music: music});
      });
      howTo.on('pointerover', () => { // reveal hover image
         howTo.alpha = 0;
      });
      howTo.on('pointerout', () => {  // return og image
         howTo.alpha = 1;
      });
      howTo.input.alwaysEnabled = true; // prevents flickering between two images
      howTo.scale = 0.15; // scaling for the button

   }

   update() {
         // move bg
         this.starfield.tilePositionY -= 5;
   }
}
