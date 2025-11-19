let img;

function preload() {
  img = loadImage('img/cam3.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noStroke();
  background(0);
  let scaleFactor = min(width / img.width, height / img.height);
  img.resize(img.width * scaleFactor, img.height * scaleFactor);
}

function draw() {
  
  background(0, 1);

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    
    let w = random(20, 200);
    
    let h = random(20, 200);

    
    let offset = 30;
    let x = constrain(mouseX + random(-offset, offset), w / 2, img.width - w / 2);
    let y = constrain(mouseY + random(-offset, offset), h / 2, img.height - h / 2)

    
    let fragment = img.get(x - w / 2, y - h / 2, w, h);

    let effect = random(['none', 'blur', 'negative', 'threshold']);
    if (effect === 'blur') fragment.filter(BLUR, int(random(2, 8)));
    if (effect === 'negative') {
      fragment.loadPixels();
      for (let i = 0; i < fragment.pixels.length; i += 4) {
        fragment.pixels[i] = 255 - fragment.pixels[i];
        fragment.pixels[i + 1] = 255 - fragment.pixels[i + 1];
        fragment.pixels[i + 2] = 255 - fragment.pixels[i + 2];
      }
      fragment.updatePixels();
    }
    if (effect === 'threshold') {
      fragment.loadPixels()

      for (let i = 0; i < fragment.pixels.length; i += 4) {
        let v = (fragment.pixels[i] + fragment.pixels[i + 1] + fragment.pixels[i + 2]) / 3;
        let c = v > random(100, 180) ? 255 : 0;
        fragment.pixels[i] = fragment.pixels[i + 1] = fragment.pixels[i + 2] = c;
      }
      fragment.updatePixels();
    }

    image(fragment, mouseX, mouseY, w, h);
  }
}
