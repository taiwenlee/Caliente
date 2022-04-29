class Setting extends Phaser.Scene {
   constructor() {
      super("settingScene");
   }

   preload() {
      this.load.image('music', 'assets/images/music.png');
      this.load.image('sfx', 'assets/images/sfx.png');
      this.load.image('plus', 'assets/images/plus.png');
      this.load.image('minus', 'assets/images/minus.png');
      this.load.image('back', 'assets/images/back.png');
   }

   create() {
      this.add.text(20, 40, "Setting Scene");

      // select sound
      this.selectSound = this.sound.add('select', {volume: sfxVol});

      // exit button
      const exitButton = this.add.image(300, 600, 'back').setOrigin(0.5);
      exitButton.setInteractive();
      exitButton.on('pointerdown', () => {
         pause = false;
         this.selectSound.play({volume: sfxVol});
         this.scene.stop();
      });
      exitButton.depth = 10;
      exitButton.scale = 0.15; // scaling for the button
      //exitButton.tint = 0xff0000; // temp tinting for the button

      // music title image
      const musicTitle= this.add.image(150, 300, 'music').setOrigin(0.5);
      musicTitle.depth = 10;
      musicTitle.scale = 0.15; // scaling for the button

      // music volume up button
      const musicVolumeUpButton = this.add.image(500, 300, 'plus').setOrigin(0.5);
      musicVolumeUpButton.setInteractive();
      musicVolumeUpButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         if(musicVol <= 1) {
            musicVol += 0.1;
         }
         musicVol = Math.min(1, musicVol);
         music.setVolume(musicVol);
      });
      musicVolumeUpButton.depth = 10;
      musicVolumeUpButton.scale = 0.15; // scaling for the button
      //musicVolumeUpButton.tint = 0x00ff00; // temp tinting for the button

      // music volume down button
      const musicVolumeDownButton = this.add.image(400, 300, 'minus').setOrigin(0.5);
      musicVolumeDownButton.setInteractive();
      musicVolumeDownButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         if(musicVol >= 0) {
            musicVol -= 0.1;
         }
         musicVol = Math.max(0, musicVol);
         music.setVolume(musicVol);
      });
      musicVolumeDownButton.depth = 10;
      musicVolumeDownButton.scale = 0.15; // scaling for the button
      //musicVolumeDownButton.tint = 0x00ff00; // temp tinting for the button

      // sfx title image
      const sfxTitle= this.add.image(150, 400, 'sfx').setOrigin(0.5);
      sfxTitle.depth = 10;
      sfxTitle.scale = 0.15; // scaling for the button

      // sfx volume up button
      const sfxVolumeUpButton = this.add.image(500, 400, 'plus').setOrigin(0.5);
      sfxVolumeUpButton.setInteractive();
      sfxVolumeUpButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         if(sfxVol <= 1) {
            sfxVol += 0.1;
         }
         sfxVol = Math.min(1, sfxVol);
      });
      sfxVolumeUpButton.depth = 10;
      sfxVolumeUpButton.scale = 0.15; // scaling for the button
      //sfxVolumeUpButton.tint = 0x00ff00; // temp tinting for the button

      // sfx volume down button
      const sfxVolumeDownButton = this.add.image(400, 400, 'minus').setOrigin(0.5);
      sfxVolumeDownButton.setInteractive();
      sfxVolumeDownButton.on('pointerdown', () => {
         this.selectSound.play({volume: sfxVol});
         if(sfxVol >= 0) {
            sfxVol -= 0.1;
         }
         sfxVol = Math.max(0, sfxVol);
      });
      sfxVolumeDownButton.depth = 10;
      sfxVolumeDownButton.scale = 0.15; // temp scaling for the button
      //sfxVolumeDownButton.tint = 0x00ff00; // temp tinting for the button
   }

   update() {
   }
}