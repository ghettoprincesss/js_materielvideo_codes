let imgs = [];
let alphas = [];
let speed = 0.01;
let exposure = 2;

function preload() {
  for (let i = 1; i <= 4; i++) {
    imgs.push(loadImage('img/cam' + i + '.jpeg'));
    
    alphas.push(0);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  imgs.forEach(im => {
    let scaleFactor = min(width / im.width, height / im.height);
    im.resize(int(im.width * scaleFactor), int(im.height * scaleFactor));
  });

  noStroke();
  noCursor();
}

function draw() {
  background(0);
  let t = frameCount * speed;

  let threshold = map(mouseX, 0, width, 0, 255);

  for (let i = 0; i < imgs.length; i++) {
    alphas[i] = map(sin(t + i * PI / 2), -1, 1, 80, 255);

    let imgCopy = imgs[i].get();
    applyExposure(imgCopy, exposure);
    altererImg(imgCopy, threshold); 

    tint(255, alphas[i]);
    image(imgCopy, width / 2, height / 2);
  }

  noTint();
}

// effet 2 seuil
function altererImg(img, threshold) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let v = img.pixels[i + 1];
    if (v < threshold) {
      img.pixels[i + 3] = 10;
    }
  }
  img.updatePixels();

}


function applyExposure(img, factor) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i]   = min(img.pixels[i]   * factor, 255);
    img.pixels[i+1] = min(img.pixels[i+1] * factor, 255);
    img.pixels[i+2] = min(img.pixels[i+2] * factor, 255);
  }
  img.updatePixels();
}
