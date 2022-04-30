// Endless runner game for CMPM/ARTG 120 by Tai Wen Lee, 
// Jake Indgin, Lily Pham, and Rachel Trieu

let config = {
   type: Phaser.AUTO,
   width: 600,
   height: 800,
   physics: {
      default: 'arcade',
   },
   scene: [Menu, Play, Setting, Tutorial],
   autoCenter: true,
}

// Phaser game object
let game = new Phaser.Game(config);

// reserve keyboard vars
let keySPACE, keyS, keyW;

// background music var
let music;

// pause var
let pause = false;

// volume vars
let musicVol = 0.5;
let sfxVol = 0.5;
