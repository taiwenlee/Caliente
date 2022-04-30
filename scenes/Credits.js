class Credits extends Phaser.Scene {
    constructor() {
       super("creditsScene");
    }
 
    preload() {
       this.load.image('credits', 'assets/images/credits.png');
       this.load.image('names', 'assets/images/names.png');
       this.load.image('back', 'assets/images/back.png');
       this.load.image('backHover', 'assets/images/backHover.png');
       this.load.image('background', 'assets/images/starfield.png');
       this.load.audio('select', 'assets/sounds/select.wav');
    }
 
    create() {
 
        // select sound
        this.selectSound = this.sound.add('select', {volume: sfxVol});

        this.starfield = this.add.tileSprite(0, 0, 600, 800, 'background').setOrigin(0, 0);
    
        // add credits image
        const credits = this.add.image(game.config.width/2, 200, 'credits').setOrigin(0.5);
        credits.scale = 0.15;
        
        // add names image
        const names = this.add.image(game.config.width/2, 400, 'names').setOrigin(0.5);
        names.scale = 0.15;
    
        // add back hover
        const exitHover = this.add.image(game.config.width/2, 595, 'backHover').setOrigin(0.5);
        exitHover.depth = 10;
        exitHover.scale = 0.15; // scaling for the button

        // exit button
        const exitButton = this.add.image(game.config.width/2, 595, 'back').setOrigin(0.5);
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
          // move bg
          this.starfield.tilePositionY -= 5;
    }
 }
 