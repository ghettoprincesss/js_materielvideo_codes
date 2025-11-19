let imgs = [];
let alphas = [];         // alpha progressifs pour chaque image
let speed = 0.01;        // vitesse de transition
let exposure = 2;        // luminosité

function preload(){
  for(let i=1; i<=4; i++){
    imgs.push(loadImage('img/cam' + i + '.jpeg'));
    alphas.push(0);       // initialisation alpha
  }
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // redimensionner toutes les images pour qu'elles tiennent dans la fenêtre
  imgs.forEach(im => {
    let scaleFactor = min(width / im.width, height / im.height);
    im.resize(int(im.width * scaleFactor), int(im.height * scaleFactor));
  });

  noStroke();
  noCursor();
}

function draw(){
  background(0);

  // oscillateur temporel pour varier les alpha
  let t = frameCount * speed;

  for(let i=0; i<imgs.length; i++){
    // alpha oscille entre 50 et 255
    alphas[i] = map(sin(t + i*PI/2), -1, 1, 50, 255);

    let imgCopy = imgs[i].get();          // copie pour ne pas altérer l'original
    applyExposure(imgCopy, exposure);     // augmenter la luminosité
    altererImg(imgCopy, mouseY);         // masque interactif
    tint(255, alphas[i]);                 // alpha progressif
    image(imgCopy, width/2, height/2);
  }

  noTint();
}

// masque basé sur le canal vert
function altererImg(img, threshold){
  img.loadPixels();
  for(let i=0; i<img.pixels.length; i+=4){
    let v = img.pixels[i+1];
    if(v < threshold){
      img.pixels[i+3] = 10;
    }
  }
  img.updatePixels();
}

// luminosité
function applyExposure(img, factor){
  img.loadPixels();
  for(let i=0; i<img.pixels.length; i+=4){
    img.pixels[i]   = min(img.pixels[i]   * factor, 255);
    img.pixels[i+1] = min(img.pixels[i+1] * factor, 255);
    img.pixels[i+2] = min(img.pixels[i+2] * factor, 255);
  }
  img.updatePixels();
}
