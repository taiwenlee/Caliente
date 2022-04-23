class Balcony extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
      console.log(this);

      scene.add.existing(this);
      this.scale = .2;
   }

   update() {
      this.y += this.scene.speed;
   }
}