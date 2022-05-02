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
      // clears the stamina bar
      this.bar.clear();

      // draw the border
      this.bar.fillStyle(0xf46d3a, 1); // lighter orange border
      this.bar.fillRoundedRect(this.x, this.y, this.width, this.height, this.height / 4);

      // draw the stamina bar background
      this.bar.fillStyle(0xf46d3a, 1); // pink bar
      this.bar.fillRoundedRect(this.x + this.padding, this.y + this.padding, this.width - 2 * this.padding, this.height - 2 * this.padding, (this.height - 2 * this.padding) / 4);
   
      // sets stamina color
      if(this.value < 20) {
         this.bar.fillStyle(0xa62e20, 1); // darker orange
      } else {
         this.bar.fillStyle(0xa62e20, 1);
      }

      // draw the remaining stamina bar
      this.bar.fillRoundedRect(this.x + this.padding, this.y + this.padding, (this.width - this.height) * (this.value / this.max) + (this.height - 2 * this.padding), this.height - 2 * this.padding, (this.height - 2 * this.padding) / 4);
   }
   
   update(value) {
      this.value = value;
      this.draw();
   }
}