let imgBase, imgB, imgA;
let diffPixels = [];

function preload() {
  imgBase = loadImage('img/lect2.JPEG');
  imgB = loadImage('img/lect1.JPEG');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(500);
  imageMode(CENTER);

  let scaleFactor = min(width / imgBase.width, height / imgBase.height);
  imgBase.resize(imgBase.width * scaleFactor, imgBase.height * scaleFactor);
  imgB.resize(imgBase.width, imgBase.height);

  imgA = createImage(imgBase.width, imgBase.height);
  imgA.copy(imgBase, 0, 0, imgBase.width, imgBase.height, 0, 0, imgBase.width, imgBase.height);

  imgBase.loadPixels()
  imgB.loadPixels();

  const w = imgBase.width;
  const h = imgBase.height;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = 4 * (y * w + x)
      const dr = Math.abs(imgBase.pixels[idx] - imgB.pixels[idx]);
      const dg = Math.abs(imgBase.pixels[idx + 1] - imgB.pixels[idx + 1]);
      const db = Math.abs(imgBase.pixels[idx + 2] - imgB.pixels[idx + 2]);
      if (dr + dg + db > 5) {
        diffPixels.push({x: x, y: y, idx: idx});
      }
    }
  }
}

function draw() {
  background(0);
  imgA.loadPixels();
  imgBase.loadPixels();
  imgB.loadPixels();

  const len = diffPixels.length;
  if (len === 0) return;

  
  const direction = map(mouseY, 0, height, 1, -1); 
  const swaps = floor(abs(direction) * 1000); 

  for (let i = 0; i < swaps; i++) {
    const p = diffPixels[int(random(len))];
    const idx = p.idx;

    if (direction > 0) {
      
      const diffR = Math.abs(imgA.pixels[idx] - imgB.pixels[idx]);
      const diffG = Math.abs(imgA.pixels[idx + 1] - imgB.pixels[idx + 1]);
      const diffB = Math.abs(imgA.pixels[idx + 2] - imgB.pixels[idx + 2]);
      if (diffR + diffG + diffB > 5) {
        for (let j = 0; j < 3; j++) {
          const tmp = imgA.pixels[idx + j]
          imgA.pixels[idx + j] = imgB.pixels[idx + j]

          imgB.pixels[idx + j] = tmp;
        }
      }
    } else {
      
      const diffR = Math.abs(imgA.pixels[idx] - imgBase.pixels[idx]);
      const diffG = Math.abs(imgA.pixels[idx + 1] - imgBase.pixels[idx + 1]);
      const diffB = Math.abs(imgA.pixels[idx + 2] - imgBase.pixels[idx + 2])
      if (diffR + diffG + diffB > 5) {
        for (let j = 0; j < 3; j++) {
          imgA.pixels[idx + j] = imgBase.pixels[idx + j];
        }
      }
    }
  }

  imgA.updatePixels();
  image(imgA, width / 2, height / 2);
}
