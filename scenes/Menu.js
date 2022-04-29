class Menu extends Phaser.Scene {
   constructor() {
      super("menuScene");
   }

   preload() {
      this.load.image('play', 'assets/images/play.png');
      this.load.image('playHover', 'assets/images/playHover.png');
      this.load.image('settings', 'assets/images/settings.png');
      this.load.image('settingsHover', 'assets/images/settingsHover.png');
      this.load.image('menubackground', 'assets/images/tempbackground.jpg');
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
      this.background = this.add.image(0, 0, 'menubackground');
      this.background.setDisplaySize(game.config.width, game.config.height).setOrigin(0);

      this.add.text(20, 20, "Menu Scene", {fontFamily: 'OCRAEXT',});

      // basic text button to go to play scene
      /*const playButton = this.add.text(game.config.width/2, game.config.height/2, "Play", { fill: '#0f0'}).setOrigin(0.5);
      playButton.setInteractive();
      playButton.on('pointerdown', () => {
         this.scene.start("playScene");
      });*/

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

      // temp setting button
      const settingButton = this.add.image(game.config.width/2, 500, 'settings').setOrigin(0.5);
      settingButton.setInteractive();
      settingButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         this.scene.launch("settingScene", {music: music});
      });
      settingButton.on('pointerover', () => { // reveal hover image
         settingButton.alpha = 0;
      });
      settingButton.on('pointerout', () => {  // return og image
         settingButton.alpha = 1;
      });
      settingButton.input.alwaysEnabled = true; // prevents flickering between two images
      settingButton.scale = 0.15; // scaling for the button

      // temp how to play button
      //const howToPlayButton = this.add.image(game.config.width/2 - 60, game.config.height/2 + 40, 'button').setOrigin(0.5);
      //howToPlayButton.setInteractive();
      //howToPlayButton.on('pointerdown', () => {
         //this.selectSound.play({volume: sfxVol});
         //this.scene.launch("howToPlayScene");
      //});
      //howToPlayButton.scale = 0.3; // scaling for the button

   }

   update() {
   }
}
