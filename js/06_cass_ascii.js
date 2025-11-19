let imgA, imgB;
let asciiChars = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
let charSize = 20;
let ratioY = 2;
let scaledW, scaledH;
let offsetX, offsetY;
let step = 4;

function preload() {
  imgA = loadImage("img/cass1.JPEG");
  imgB = loadImage("img/cass2.jpeg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("monospace");
  textAlign(LEFT, TOP);
  noStroke();

  let scaleFactor = min(
    (width * 0.4) / imgA.width,
    (height * 0.4) / imgA.height
  );
  scaledW = int(imgA.width * scaleFactor);
  scaledH = int(imgA.height * scaleFactor);

  imgA.resize(scaledW, scaledH);
  imgB.resize(scaledW, scaledH);

  let asciiWidth = (scaledW / step) * (charSize / 2);
  let asciiHeight = (scaledH / step) * (charSize / ratioY);

  offsetX = (width - asciiWidth) / 2;
  offsetY = (height - asciiHeight) / 2;

  frameRate(60);
  noCursor();
}

function draw() {
  background(0);

  let t = constrain(map(mouseX, 0, width, 0, 1), 0, 1);

  imgA.loadPixels();
  imgB.loadPixels();
  textSize(charSize);

  for (let y = 0; y < imgA.height; y += step) {
    for (let x = 0; x < imgA.width; x += step) {
      let idx = (x + y * imgA.width) * 4;

      let r1 = imgA.pixels[idx];
      let g1 = imgA.pixels[idx + 1];
      let b1 = imgA.pixels[idx + 2];

      let r2 = imgB.pixels[idx];
      let g2 = imgB.pixels[idx + 1];
      let b2 = imgB.pixels[idx + 2];

      let r = lerp(r1, r2, t);
      let g = lerp(g1, g2, t);
      let b = lerp(b1, b2, t);

      let bright = (r + g + b) / 3;
      let cIndex = floor(map(bright, 0, 255, 0, asciiChars.length - 1));
      let c = asciiChars.charAt(cIndex);

      fill(r, g, b);
      text(
        c,
        offsetX + (x / step) * (charSize / 2),
        offsetY + (y / step) * (charSize / ratioY)
        
      );
    }
  }
}
