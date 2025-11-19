let imgBase, imgB, imgA;
let diffPixels = [];

function preload() {
  imgBase = loadImage('img/lect2.JPEG');
  imgB = loadImage('img/lect1.JPEG');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(500); // pour plus de fluidité
  imageMode(CENTER);

  let scaleFactor = min(width / imgBase.width, height / imgBase.height);
  imgBase.resize(imgBase.width * scaleFactor, imgBase.height * scaleFactor);
  imgB.resize(imgBase.width, imgBase.height);

  imgA = createImage(imgBase.width, imgBase.height);
  imgA.copy(imgBase, 0, 0, imgBase.width, imgBase.height, 0, 0, imgBase.width, imgBase.height);

  imgBase.loadPixels();
  imgB.loadPixels();

  const w = imgBase.width;
  const h = imgBase.height;

  // repérer uniquement les pixels différents
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = 4 * (y * w + x);
      const dr = Math.abs(imgBase.pixels[idx] - imgB.pixels[idx]);
      const dg = Math.abs(imgBase.pixels[idx + 1] - imgB.pixels[idx + 1]);
      const db = Math.abs(imgBase.pixels[idx + 2] - imgB.pixels[idx + 2]);
      if (dr + dg + db > 5) {
        diffPixels.push({x: x, y: y, idx: idx});
      }
    }
  }

  console.log(diffPixels.length + " pixels différents trouvés");
}

function draw() {
  background(0);
  imgA.loadPixels();
  imgBase.loadPixels();
  imgB.loadPixels();

  const len = diffPixels.length;
  if (len === 0) return;

  // nombre de swaps par frame selon mouseY
  const swaps = floor(map(mouseY, 0, height, 0, 1000)); // ajuste la vitesse

  for (let i = 0; i < swaps; i++) {
    const p = diffPixels[int(random(len))]; // pixel aléatoire différent
    const idx = p.idx;

    // ne swap que si les pixels sont effectivement différents
    const diffR = Math.abs(imgA.pixels[idx] - imgB.pixels[idx]);
    const diffG = Math.abs(imgA.pixels[idx + 1] - imgB.pixels[idx + 1]);
    const diffB = Math.abs(imgA.pixels[idx + 2] - imgB.pixels[idx + 2]);
    

    if (diffR + diffG + diffB > 5) {
      // échange R, G, B
      for (let j = 0; j < 3; j++) {
        const tmp = imgA.pixels[idx + j];
        imgA.pixels[idx + j] = imgB.pixels[idx + j];
        imgB.pixels[idx + j] = tmp;
      }
    }
  }

  imgA.updatePixels();
  image(imgA, width / 2, height / 2);
}
