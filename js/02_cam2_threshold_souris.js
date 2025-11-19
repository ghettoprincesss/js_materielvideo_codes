let img, buffer;
let tOffsetX = 0;
let tOffsetY = 1000; 

function preload() {
  img = loadImage('img/cam2.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  img.resize(width, 0);
  imageMode(CENTER);
  noSmooth();
  frameRate(30);
  buffer = createGraphics(width, height);
  buffer.noSmooth();
}

function draw() {
  background(255);
  let t = frameCount * 0.02;


  let control = constrain(map(mouseX, 0, width, 0, 1), 0, 1);

  buffer.clear();
  buffer.push();
  buffer.translate(width / 2, height / 2);
  buffer.imageMode(CENTER);
  buffer.blendMode(ADD);


  let layers = int(5 + control * 10); // --> gere le nombre de couches
  
  for (let i = 0; i < layers; i++) {
    
    let nx = noise(tOffsetX + t * 2 + i * 2);
    let ny = noise(tOffsetY + t * 2 + i * 2);

    
    let dx = map(nx, 0, 1, -20, 20) * control + sin(t * 0.7 + i) * 4 * control;
    let dy = map(ny, 0, 1, -20, 20) * control + cos(t * 0.5 + i) * 3 * control;

    
    let scale = 1 + sin(t * 0.2 + i) * 0.02 + (noise(i * 0.3, t * 0.3) - 0.5) * 0.04;

    let alpha = 80 + control * 100 - i * 8;

    buffer.push();
    buffer.tint(255, alpha);
    buffer.image(img, dx, dy, img.width * scale, img.height * scale);
    buffer.pop();
  }

  buffer.pop();
  buffer.noTint();

  buffer.blendMode(BLEND);

  
  buffer.loadPixels();
  let pixels = buffer.pixels;
  
  // pr faire bouger le seuil

  let threshold = 128 + 40 * (control - 0.5) + 21 * sin(t * 0.8);
  for (let i = 0; i < pixels.length; i += 4) {
    let v = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    let c = v > threshold ? 255 : 0;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = c;
  }
  buffer.updatePixels();

  image(buffer, width / 2, height / 2);

}
