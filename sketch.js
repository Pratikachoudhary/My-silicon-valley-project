// declaring varialbles

var pony,obc1Image,obc2image,obc3Image,groundImage,ponyImg,ground;
var invisiblebg,coinsImg,ponyStuckImg,boosterImg,booster;
var PLAY=1;
var END=0;
var gameState=PLAY;
var score =0;
var gameover,reset,resetImg,gameoverImg;

function preload(){// loading images in this function
  
     // ground
    groundImage = loadImage("bg1.jpg");

     // obstacles 
     obc2Image = loadImage("obstacle2.png"); 
     obc3Image = loadImage("obstacle3.png");  

     //player
      ponyImg = loadAnimation("pony1.png","pony2.png");

      //coins
      coinsImg = loadImage("point.png");
      boosterImg = loadImage("score.png");

      //pony
      ponyStuckImg=loadAnimation("pony1.png");

      //loading gameover and reset images
      resetImg = loadImage("reaset.jpg");
      gameoverImg = loadImage("gameOver.jpg");
  
      //loading sound
     heaven = loadSound("amaze.mp3");
     getcoin=loadSound("getcoin.wav");
     jump=loadSound("jump.wav");
     gameovers=loadSound("gameover.wav");
}

function setup(){ 
    // here we create sprite and give different properties to them
  
    //creating canavas
    createCanvas(900,600);
  
    //creating ground;
    ground = createSprite(350,300,700,600);
    ground.addImage("ground",groundImage);
    ground.scale=2;
    ground.velocityX=-(4+score/100);
    ground.x=ground.width/2;
  
  
  
    //creating player(pony);
    pony = createSprite(60,460);
    pony.addAnimation("running",ponyImg);
    pony.addAnimation("stuck",ponyStuckImg);
    pony.scale= 0.3;

    //creating invisible ground
    invisiblebg = createSprite(350,530,700,10);
    invisiblebg.visible=false;
  
    //creating group of candy
    candyGroup = new Group();
  
    //creating booster group
    boosterGroup = new Group();
  
    //creating group of coins
    coinsGroup = new Group();
  
    //collider of pony
    pony.debug=false;
    pony.setCollider("rectangle",0,0,350,400);
  
    //gameover 
    gameover = createSprite(450,250);
    gameover.addImage(gameoverImg);
    gameover.scale = 1.5;
  
    //reset
    reset = createSprite(50,50);
    reset.addImage(resetImg);
    reset.scale = 0.3;

        //adding sound
        heaven.loop();
        heaven.setVolume(0.2);
}

function draw(){
  
    //giving colour to background
    background(220);

    //adding gamestate
    if(gameState===PLAY){
      

  
    //adding continuous ground
    if(ground.x<350){
    ground.x=500;
    }
  
    //jumping pony
    if(keyDown("space") && pony.y>250){
    pony.velocityY=-10;
     jump.play();   
   }
  
    //gravity to pony
    pony.velocityY=pony.velocityY+0.8;
  
    //calling functions
    spawnCandy(); 
    spawnCoins();
    spawnBooster();
  
    //giving extra bonus
    if(boosterGroup.isTouching(pony)){
    score=score+50;
    boosterGroup.destroyEach();
    getcoin.play();
   }
     
   //changing gamestate
    if(candyGroup.isTouching(pony)){
    gameState=END;
    gameovers.play();
      } 
  
  //giving score
  if(coinsGroup.isTouching(pony))
    {
      score = score + 10;
      coinsGroup.destroyEach();
      getcoin.play();
    }
  
  //visiblity false to gameover and reset
   gameover.visible= false;
   reset.visible = false;

}
   else if(gameState===END){
   //stopping ground
   ground.velocityX = 0; 
  
    //stoping pony
    pony.velocityY = 0;
    pony.changeAnimation("stuck",ponyStuckImg); 
    
    //stopping coins group
    coinsGroup.setVelocityXEach(0);
    
    //stopping candy group
    candyGroup.setVelocityXEach(0);
    
    //stopping booster group
    boosterGroup.setVelocityXEach(0);
    
    //stoping sound
     heaven.stop();

    //changing lifetime in negative so candy and coins which are on ground never destroy
    coinsGroup.setLifetimeEach(-1);
    candyGroup.setLifetimeEach(-1);
    boosterGroup.setLifetimeEach(-1);
    
   // gameover and reset image to canvas
   gameover.visible= true;
   reset.visible = true;

   //reseting game
   if(mousePressedOver(reset)){
      resetGame();     
      }
    
}//gamestate end ended
  
  //colliding pony with invisiblebg
  pony.collide(invisiblebg);
  
  // drawing sprites 
  drawSprites();
  
  //giving stroke to score
  stroke("yellow")
  
  //giving stroke weight to score
  strokeWeight(4);
  
  //giving colour to score
  fill("#FFB6C7");
  
  //giving text size to score
  textSize(20);
  
  //creating score
  text("Score : " + score,700,40);
  
  
}


function spawnCandy(){
  
    //spawing candy
    if(frameCount%120===0){
      
    //creating candy sprite
    var candy = createSprite(880,495,30,50);
      
    //giving velocity
    candy.velocityX=-(4+score/100);
      
    //giving scale
    candy.scale=0.3;
      
    //checking collider
    candy.debug=false;
    
    
    //applying  images to obstacles randomly
    var rndm = Math.round(random(1,2));
    switch(rndm){
        
    case 1: candy.addImage(obc2Image);
    break;
        
    case 2 : candy.addImage(obc3Image)
                      
    candy.setCollider("rectangle",0,0,250,200);
    break;
       
    default : break;
}
    //giving lifetime
    candy.lifetime=300;
    
    //adding to group
    candyGroup.add(candy);
} 
  
}


function spawnCoins(){
  
   //spawing coins
   if(frameCount%180===0){
     
   //creating coins sprite
   var coins = createSprite(900,295,30,50);
     
   //giving velocity
  coins.velocityX=-(4+score/100);
     
   //giving scale
   coins.scale=0.3;
     
   //adding image
   coins.addImage(coinsImg);
     
   //checking collider
   coins.debug = false;
     
   //settig collider
   coins.setCollider("rectangle",0,0,150,180);
     
   //giving lifetime
   coins.lifetime=300;

     //changing depth
    coins.depth=gameover.depth;
    gameover.depth=coins.depth+1;
     
   // adding to group
   coinsGroup.add(coins);
}
}

function resetGame(){
  
   //reseting gameState
   gameState=PLAY;
  
   //removing visiblity of gameover image
   gameover.visible= false;
  
   //removing visiblity of reset image
   reset.visible = false;
   
   // destroying groups
   candyGroup.destroyEach();
   coinsGroup.destroyEach();
   boosterGroup.destroyEach();
  
   //changing pony image
   pony.changeAnimation("running",ponyImg);
   
   //giving velocity to ground
   ground.velocityX=-6;
  
   //changing score to zero
   score = 0;

   //reseting sound
     heaven.loop();
     heaven.setVolume(0.2);

  
     
}

function spawnBooster(){
  
  //spawning  booster
  if(frameCount%1000===0){
    
  //creating booster sprite
  var booster = createSprite(950,295,30,50);
    
  //giving velocity
  booster.velocityX=-(4+score/100);
    
  //giving scale
  booster.scale=0.1;
    
  //adding image
  booster.addImage(boosterImg);
    
  //checking  collider
  booster.debug=false;
    
  //setting collider 
  booster.setCollider("rectangle",0,0,240,240);
    
  //giving lifetime
  booster.lifetime=300; 
    
  // adding to group
  boosterGroup.add(booster);
}
}