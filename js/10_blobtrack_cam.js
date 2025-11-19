let imgs = [];
let numImages = 4;
let fragments = [];
let maxFrags = 50;
let interestMaps = [];
let lastMouseX, lastMouseY;

function preload() {
  for (let i = 1; i <= numImages; i++) {
    imgs.push(loadImage(`img/cam${i}.jpeg`));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  noStroke();
  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  background(0);

  
  for (let img of imgs) {
    interestMaps.push(computeInterestMap(img));
  }
}

function draw() {


  let dx = mouseX - lastMouseX;
  let dy = mouseY - lastMouseY;
  let distMouse = sqrt(dx * dx + dy * dy);

  if (distMouse > 0) {
    let numNewFrags = int(map(distMouse, 0, width, 1, 5));
    for (let i = 0; i < numNewFrags; i++) {
      let imgIdx = int(random(numImages));
      let pos = pickInterestingPosition(interestMaps[imgIdx]);

      fragments.push({
        imgIdx,
        x: map(pos.x, 0, interestMaps[imgIdx].width, 0, width),
        y: map(pos.y, 0, interestMaps[imgIdx].height, 0, height),
        w: random(40, 80),
        h: random(40, 80),
        life: 150,
        amt: random(1)
      });

      if (fragments.length > maxFrags) fragments.shift();
    }
  }


  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    let imgRef = imgs[f.imgIdx];
    let mapRef = interestMaps[f.imgIdx];

    let sx = constrain(map(f.x, 0, width, 0, imgRef.width) - f.w / 2, 0, imgRef.width - f.w);
    let sy = constrain(map(f.y, 0, height, 0, imgRef.height) - f.h / 2, 0, imgRef.height - f.h);
    let fragImg = imgRef.get(sx, sy, f.w, f.h);

    fragImg = transitionNegativePositive(fragImg, f.amt);

    tint(255, 220);
    image(fragImg, f.x, f.y, f.w, f.h);
    noTint();

    if (i > 0) {
      stroke(255, 100);
      line(f.x, f.y, fragments[i - 1].x, fragments[i - 1].y);

      noStroke();
    }

    f.life--;
    f.amt += 0.01;
    if (f.amt > 1) f.amt = 1;
  }

  fragments = fragments.filter(f => f.life > 0);

  lastMouseX = mouseX;
  lastMouseY = mouseY;
  
}

function transitionNegativePositive(img, amt) {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i]     = lerp(255 - img.pixels[i], img.pixels[i], amt);
    img.pixels[i + 1] = lerp(255 - img.pixels[i + 1], img.pixels[i + 1], amt);
    img.pixels[i + 2] = lerp(255 - img.pixels[i + 2], img.pixels[i + 2], amt);
  }
  img.updatePixels();
  return img;
}


function computeInterestMap(img) {
  let gfx = createGraphics(img.width, img.height);
  img.loadPixels();
  gfx.loadPixels();

  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      let idx = (y * img.width + x) * 4;
      let brightnessCenter = (img.pixels[idx] + img.pixels[idx + 1] + img.pixels[idx + 2]) / 3;

      let idxL = (y * img.width + (x - 1)) * 4;
      let idxR = (y * img.width + (x + 1)) * 4;
      let idxT = ((y - 1) * img.width + x) * 4;
      let idxB = ((y + 1) * img.width + x) * 4;

      let contrast = 0;
      contrast += abs(brightnessCenter - (img.pixels[idxL] + img.pixels[idxL + 1] + img.pixels[idxL + 2]) / 3);
      contrast += abs(brightnessCenter - (img.pixels[idxR] + img.pixels[idxR + 1] + img.pixels[idxR + 2]) / 3);
      contrast += abs(brightnessCenter - (img.pixels[idxT] + img.pixels[idxT + 1] + img.pixels[idxT + 2]) / 3);
      contrast += abs(brightnessCenter - (img.pixels[idxB] + img.pixels[idxB + 1] + img.pixels[idxB + 2]) / 3);

      gfx.pixels[idx] = contrast;
      gfx.pixels[idx + 1] = contrast;
      gfx.pixels[idx + 2] = contrast;
      gfx.pixels[idx + 3] = 255;
    }
  }
  gfx.updatePixels();
  return gfx;
}


function pickInterestingPosition(interestMap) {
  interestMap.loadPixels();
  for (let tries = 0; tries < 1000; tries++) {
    let x = int(random(interestMap.width));
    let y = int(random(interestMap.height));
    let idx = (y * interestMap.width + x) * 4;
    let val = interestMap.pixels[idx]; 
    if (val > random(100, 200)) { // pour avoir + de zones contrastées
      return { x, y };
    }
  }
  

  return { x: random(interestMap.width), y: random(interestMap.height) };
}
