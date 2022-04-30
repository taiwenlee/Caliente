class Tutorial extends Phaser.Scene {
    constructor() {
       super("tutorialScene");
    }

    preload() {
        this.load.image('howTo', 'assets/images/howTo.png');
        this.load.image('controls', 'assets/images/controls.png');
        this.load.image('tutorial', 'assets/images/tutorial.png');
        this.load.image('back', 'assets/images/back.png');
        this.load.image('backHover', 'assets/images/backHover.png');
        this.load.image('play', 'assets/images/play.png');
        this.load.image('playHover', 'assets/images/playHover.png');
        this.load.image('menubackground', 'assets/images/tempbackground.jpg');
        this.load.image('background', 'assets/images/starfield.png');
    }
  
    create() {        
        // background
        this.starfield = this.add.tileSprite(0, 0, 600, 800, 'background').setOrigin(0, 0);
        
        const howTo = this.add.image(game.config.width/2, 90, 'howTo').setOrigin(0.5);
        howTo.scale = 0.15;
        howTo.depth = 10;

        const controls = this.add.image(game.config.width/2, 245, 'controls').setOrigin(0.5);
        controls.scale = 0.15
        controls.depth = 10;        
        
        const tutorial = this.add.image(game.config.width/2, 495, 'tutorial').setOrigin(0.5);
        tutorial.scale = 0.15;
        tutorial.depth = 10;

        // add play hover image
        const playHover = this.add.image(440, 700, 'playHover').setOrigin(0.5);
        playHover.scale = 0.15; // scaling for the button

        // play button
        const playButton = this.add.image(440, 700, 'play').setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => {
            this.selectSound.play({volume: sfxVol});
            this.scene.stop();
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

        // add back hover
        const exitHover = this.add.image(163, 700, 'backHover').setOrigin(0.5);
        exitHover.depth = 10;
        exitHover.scale = 0.15; // scaling for the button

        // exit button
        const exitButton = this.add.image(163, 700, 'back').setOrigin(0.5);
        exitButton.setInteractive();
        exitButton.on('pointerdown', () => {
            pause = false;
            this.selectSound.play({volume: sfxVol});
            this.scene.stop();
            this.scene.resume("menuScene");
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
    }
  
    update() {
        this.starfield.tilePositionY -= 5;
     }
  }