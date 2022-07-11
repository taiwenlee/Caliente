// Endless runner game for UCSC CMPM/ARTG 120

// Group names: Jake Indgin, Tai Wen Lee, Lily Pham, and Rachel Trieu

// Game name: Caliente 
// (A portmanteau of cat, alien, and hot.)
// Date finished: 5/2/22

// Creative tilt: We're particularly proud of our stamina bar, audio settings, 
// and variety of game objects (wood vs metal balconies that have different functions). 
// Our hitboxes also resize based on the animation playing.
// We're proud of our music, which has a satisfying, ethereal loop and doesn't get old fast.

let config = {
   type: Phaser.AUTO,
   width: 600,
   height: 800,
   physics: {
      default: 'arcade',
   },
   scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
   },
   scene: [Menu, Play, Setting, Tutorial, Credits],
}

// Phaser game object
let game = new Phaser.Game(config);

// Check touch input
// from https://browsergameshub.com/check-player-is-on-mobile-or-desktop/
let IS_TOUCH = false;
window.addEventListener('touchstart', function () {
   IS_TOUCH = true;
});

// reserve input var
let input;

// background music var
let music;

// volume vars
let musicVol = 0.5;
let sfxVol = 0.5;

// highscore var
let highscore = 0;
