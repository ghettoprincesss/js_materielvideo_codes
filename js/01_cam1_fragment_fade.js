let img;
let t = 0;

function preload(){
  img = loadImage('img/cam1.jpeg');
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  img.resize(0, height)
  noStroke();
  background(0)
}

function draw(){
 
  fill(0, 10);
  rect(0,0,width,height);

  
  t += 0.01;
  let nFragments = 60;

  for(let i=0;i<nFragments;i++){
    
    let w = int(map(noise(i*0.1, t), 0,1, 10, 180));
    let h = int(map(noise(i*0.15, t+10), 0,1, 10, 180));

    
    let sx = int(noise(i*0.2, t+20) * (img.width - w));
    let sy = int(noise(i*0.25, t+30) * (img.height - h));

    // deplacement + oscillation

    let dx = int(map(sin(frameCount*0.02 + i), -1,1, -40, 40) + (i%7)*3);
    let dy = int(map(cos(frameCount*0.018 + i*0.7), -1,1, -40, 40))

    let a = map(noise(i*0.3, t+40), 0,1, 80, 255);
    tint(255, a);

    copy(img, sx, sy, w, h, sx + dx, sy + dy, w, h);
  }

  noTint();
}
