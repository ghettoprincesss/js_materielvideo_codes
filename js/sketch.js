let img,imgBlur;
let listeFiltre =[];
let imageChoisie;

function preload(){
img= loadImage('img/m1.jpeg'); ///corriger URL
    

}

function setup() {
   createCanvas(windowWidth,windowHeight)
   
      for (let i = 0; i <7; i++) {
         let copie = img.get()
         listeFiltre[i] = copie;
      }

      listeFiltre[0].filter(GRAY)
      listeFiltre[1].filter(INVERT)
      listeFiltre[2].filter(THRESHOLD,0.5)
      listeFiltre[3].filter(POSTERIZE,2)
      listeFiltre[4].filter(BLUR,8)
      listeFiltre[5].filter(ERODE)
      listeFiltre[6].filter(DILATE)
      imageChoisie =random(listeFiltre);
}


function draw(){
   let frag = imageChoisie.get(mouseX,mouseY,50,50)
    image(frag,mouseX,mouseY)

    if (frameCount%50==0){ //pour changer de filtre toutes les 20 frames, pas obligatoire
     imageChoisie =random(listeFiltre);
    }
 }



//  function mouseDragged(){
   
//    let frag = imageChoisie.get(mouseX,mouseY,50,50)
//    image(frag,mouseX,mouseY)

//    if (frameCount%50==0){ //pour changer de filtre toutes les 20 frames, pas obligatoire
//     imageChoisie =random(listeFiltre);
//    }
//  }
 

 function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}



