class Setting extends Phaser.Scene {
   constructor() {
      super("settingScene");
   }

   init(data) {
      this.fromScene = data.fromScene;
   }

   preload() {
      // image assets
      this.load.image('music', 'assets/images/music.png');
      this.load.image('sfx', 'assets/images/sfx.png');
      this.load.image('plus', 'assets/images/plus.png');
      this.load.image('plusHover', 'assets/images/plusHover.png');
      this.load.image('minus', 'assets/images/minus.png');
      this.load.image('minusHover', 'assets/images/minusHover.png');
      this.load.image('back', 'assets/images/back.png');
      this.load.image('backHover', 'assets/images/backHover.png');
      this.load.image('settings', 'assets/images/settings.png');
      this.load.image('skyfield', 'assets/images/skyfield.png');
   }

   create() {
      // background
      this.skyfield = this.add.tileSprite(0, 0, 600, 800, 'skyfield').setOrigin(0, 0);

      // select sound
      this.selectSound = this.sound.add('select', { volume: sfxVol });

      // back sound
      this.backSound = this.sound.add('back', { volume: sfxVol });

      // music vol text
      this.musicVolText = this.add.text(game.canvas.width / 2 + 20, 330, (musicVol * 100).toFixed(0), { fill: '#f46d3a', fontFamily: 'OCRAEXT', fontSize: 45, align: 'right' }).setOrigin(1, 0.5);
      this.musicVolText.depth = 11;

      // sfx vol text
      this.sfxVolText = this.add.text(game.canvas.width / 2 + 20, 450, (sfxVol * 100).toFixed(0), { fill: '#f46d3a', fontFamily: 'OCRAEXT', fontSize: 45, align: 'right' }).setOrigin(1, 0.5);
      this.sfxVolText.depth = 11;

      // add settings image
      const settings = this.add.image(game.config.width / 2, 200, 'settings').setOrigin(0.5);
      settings.depth = 10;
      settings.scale = 0.15; // scaling for the button

      // add back hover
      const exitHover = this.add.image(300, 585, 'backHover').setOrigin(0.5);
      exitHover.depth = 10;
      exitHover.scale = 0.15; // scaling for the button

      // exit button
      const exitButton = this.add.image(300, 585, 'back').setOrigin(0.5);
      exitButton.setInteractive();
      exitButton.on('pointerdown', () => {
         this.time.delayedCall(100, () => {
            this.scene.stop();
            this.scene.resume(this.fromScene);
         });
         this.backSound.play({ volume: sfxVol });
      });
      exitButton.on('pointerover', () => { // reveal hover image
         exitButton.alpha = 0;
      });
      exitButton.on('pointerout', () => {  // return og image
         exitButton.alpha = 1;
      });
      exitButton.input.alwaysEnabled = true; // prevents flickering between two images
      exitButton.depth = 10;
      exitButton.scale = 0.15; // scaling for the button
      //exitButton.tint = 0xff0000; // temp tinting for the button

      // music title image
      const musicTitle = this.add.image(200, 330, 'music').setOrigin(0.5);
      musicTitle.depth = 10;
      musicTitle.scale = 0.15; // scaling for the button

      // add music vol up hover
      const musicUpHover = this.add.image(500, 330, 'plusHover').setOrigin(0.5);
      musicUpHover.depth = 10;
      musicUpHover.scale = 0.15; // scaling for the button

      // music volume up button
      const musicVolumeUpButton = this.add.image(500, 330, 'plus').setOrigin(0.5);
      musicVolumeUpButton.setInteractive();
      musicVolumeUpButton.on('pointerdown', () => {
         this.selectSound.play({ volume: sfxVol });
         if (musicVol <= 1) {
            musicVol += 0.1;
         }
         musicVol = Math.min(1, musicVol);
         music.setVolume(musicVol);
         this.musicVolText.setText((musicVol * 100).toFixed(0));
      });
      musicVolumeUpButton.on('pointerover', () => { // reveal hover image
         musicVolumeUpButton.alpha = 0;
      });
      musicVolumeUpButton.on('pointerout', () => {  // return og image
         musicVolumeUpButton.alpha = 1;
      });
      musicVolumeUpButton.input.alwaysEnabled = true; // prevents flickering between two images
      musicVolumeUpButton.depth = 10;
      musicVolumeUpButton.scale = 0.15; // scaling for the button
      //musicVolumeUpButton.tint = 0x00ff00; // temp tinting for the button

      // add music vol down hover
      const musicDownHover = this.add.image(405, 330, 'minusHover').setOrigin(0.5);
      musicDownHover.depth = 10;
      musicDownHover.scale = 0.15; // scaling for the button

      // music volume down button
      const musicVolumeDownButton = this.add.image(405, 330, 'minus').setOrigin(0.5);
      musicVolumeDownButton.setInteractive();
      musicVolumeDownButton.on('pointerdown', () => {
         this.backSound.play({ volume: sfxVol });
         if (musicVol >= 0) {
            musicVol -= 0.1;
         }
         musicVol = Math.max(0, musicVol);
         music.setVolume(musicVol);
         this.musicVolText.setText((musicVol * 100).toFixed(0));
      });
      musicVolumeDownButton.on('pointerover', () => { // reveal hover image
         musicVolumeDownButton.alpha = 0;
      });
      musicVolumeDownButton.on('pointerout', () => { // return og image
         musicVolumeDownButton.alpha = 1;
      });
      musicVolumeDownButton.input.alwaysEnabled = true; // prevents flickering between two images
      musicVolumeDownButton.depth = 10;
      musicVolumeDownButton.scale = 0.15; // scaling for the button
      //musicVolumeDownButton.tint = 0x00ff00; // temp tinting for the button

      // sfx title image
      const sfxTitle = this.add.image(200, 450, 'sfx').setOrigin(0.5);
      sfxTitle.depth = 10;
      sfxTitle.scale = 0.15; // scaling for the button

      // add sfx vol up hover
      const sfxUpHover = this.add.image(500, 450, 'plusHover').setOrigin(0.5);
      sfxUpHover.depth = 10;
      sfxUpHover.scale = 0.15; // scaling for the button

      // sfx volume up button
      const sfxVolumeUpButton = this.add.image(500, 450, 'plus').setOrigin(0.5);
      sfxVolumeUpButton.setInteractive();
      sfxVolumeUpButton.on('pointerdown', () => {
         this.selectSound.play({ volume: sfxVol });
         if (sfxVol <= 1) {
            sfxVol += 0.1;
         }
         sfxVol = Math.min(1, sfxVol);
         this.sfxVolText.setText((sfxVol * 100).toFixed(0));
      });
      sfxVolumeUpButton.on('pointerover', () => { // reveal hover image
         sfxVolumeUpButton.alpha = 0;
      });
      sfxVolumeUpButton.on('pointerout', () => {  // return og image
         sfxVolumeUpButton.alpha = 1;
      });
      sfxVolumeUpButton.input.alwaysEnabled = true; // prevents flickering between two images
      sfxVolumeUpButton.depth = 10;
      sfxVolumeUpButton.scale = 0.15; // scaling for the button
      //sfxVolumeUpButton.tint = 0x00ff00; // temp tinting for the button

      // add sfx vol down hover
      const sfxDownHover = this.add.image(405, 450, 'minusHover').setOrigin(0.5);
      sfxDownHover.depth = 10;
      sfxDownHover.scale = 0.15; // scaling for the button

      // sfx volume down button
      const sfxVolumeDownButton = this.add.image(405, 450, 'minus').setOrigin(0.5);
      sfxVolumeDownButton.setInteractive();
      sfxVolumeDownButton.on('pointerdown', () => {
         this.backSound.play({ volume: sfxVol });
         if (sfxVol >= 0) {
            sfxVol -= 0.1;
         }
         sfxVol = Math.max(0, sfxVol);
         this.sfxVolText.setText((sfxVol * 100).toFixed(0));

      });
      sfxVolumeDownButton.on('pointerover', () => { // reveal hover image
         sfxVolumeDownButton.alpha = 0;
      });
      sfxVolumeDownButton.on('pointerout', () => { // return og image
         sfxVolumeDownButton.alpha = 1;
      });
      sfxVolumeDownButton.input.alwaysEnabled = true; // prevents flickering between two images
      sfxVolumeDownButton.depth = 10;
      sfxVolumeDownButton.scale = 0.15; // temp scaling for the button
      //sfxVolumeDownButton.tint = 0x00ff00; // temp tinting for the button
   }

   update() {
      this.skyfield.tilePositionY -= 1;
   }
}