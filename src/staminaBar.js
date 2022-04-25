class staminaBar {
   constructor(scene, x, y, width, height, max, padding) {
      this.bar = new Phaser.GameObjects.Graphics(scene);

      // set position and size of health bar
      this.x = x;
      this.y = y;
      this.depth = 10;
      this.bar.depth = 10;
      this.width = width;
      this.height = height;
      this.padding = padding;

      // current value and max value
      this.max = max;
      this.value = max;
      
      this.draw();

      scene.add.existing(this.bar); 
   }

   draw() {
      // clears the health bar
      //this.bar.clear();

      // draw the border
      this.bar.fillStyle(0xFFFFFF, 1); // black border
      this.bar.fillRect(this.x, this.y, this.width, this.height);

      // draw the stamina bar background
      this.bar.fillStyle(0x808080, 1); // white bar
      this.bar.fillRect(this.x + this.padding, this.y + this.padding, this.width - 2 * this.padding, this.height - 2 * this.padding);
   
      // sets stamina color
      if(this.value < 20) {
         this.bar.fillStyle(0xFF0000, 1);
      } else {
         this.bar.fillStyle(0x00FF00, 1);
      }

      // draw the remaining stamina bar
      this.bar.fillRect(this.x + this.padding, this.y + this.padding, (this.width - 2 * this.padding) * (this.value / this.max), this.height - 2 * this.padding);
   }
   
   update(value) {
      this.value = value;
      this.draw();
   }
}