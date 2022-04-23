// Endless runner game for CMPM/ARTG 120 by Tai Wen Lee, 
// Jake Indgin, Lily Pham, and Rachel Trieu

let config = {
   type: Phaser.WEBGL,
   width: 600,
   height: 800,
   physics: {
      default: 'arcade',
      arcade: {
         debug: true
      }
   },
   scene: [Menu, Play]
}

// Phaser game object
let game = new Phaser.Game(config);

// reserve keyboard vars
let keySPACE, keyS;
