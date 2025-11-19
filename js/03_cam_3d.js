let myModel;
let img;

function preload() {
  
  myModel = loadModel('img/VideoCamera.obj', true); 
  img = loadImage('img/cam3.jpeg');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL)
  noStroke();
}

function draw() {
  background(0);

  orbitControl();


  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.005);

 
  let imgCopy = img.get();
  applyMaskInteractive(imgCopy, mouseX, mouseY);


  texture(imgCopy);


  scale(2); 
  model(myModel);

}


function applyMaskInteractive(img, mouseX, mouseY) {
  img.loadPixels();
  let thresholdX = map(mouseX, 0, width, 0, 255);
  let thresholdY = map(mouseY, 0, height, 0, 255);

  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];


    let alpha = constrain((g - thresholdY + r - thresholdX), 0, 255);
    img.pixels[i + 3] = alpha;
  }

  
  img.updatePixels();
}
