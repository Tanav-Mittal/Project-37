//Global Variables
var banana_image, obstacle_image, monkey_running,monkey_stop, ground_image,monkey_stop;
var scene_image, scene;
var monkey, ground, stone;
var obstacleGroup, foodGroup;
var score = 0;
var gameOver_image, restart_image;
var gameOver, restart;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var count = 0;


function preload()
{
  //load images and animation
  scene_image = loadImage("jungle.jpg");
  
  monkey_running = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");

  banana_image = loadImage("Banana.png");
  
  obstacle_image = loadImage("stone.png");

  ground_image = loadImage("ground.jpg");

  gameOver_image = loadImage("gameOver.png");
  
  restart_image = loadImage("restart.png");
  
  monkey_stop = loadImage("Monkey_01.png");
}


function setup() 
{
  createCanvas(600, 300);
  
// create sprites
  scene = createSprite(0, 0, 600, 300);
  scene.addImage(scene_image);
  scene.scale = 1.5;
  scene.velocityX = -2

  ground = createSprite(200, 330, 600, 10);
  ground.addImage(ground_image);
  ground.scale = 0.1;
  ground.visible = false;

  monkey = createSprite(40, 250, 40, 50);
  monkey.addAnimation("running", monkey_running);
  monkey.addImage("stop",monkey_stop);
  monkey.scale = 0.1;

  gameOver = createSprite(280, 100, 20, 20);
  gameOver.addImage(gameOver_image);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(280, 130, 20, 20);
  restart.addImage(restart_image);
  restart.scale = 0.5;
  restart.visible = false;

  obstacleGroup = new Group();
  foodGroup = new Group();
}

function draw() 
{
  //make background white
  background(255);

  // make monkey collide with the ground
  monkey.collide(ground);
  
  // format the text
    stroke("blue");
    textSize(20);
    fill("white");

  if (gameState === PLAY) 
  {
    //make background move to the left
    //scene.velocityX = -6;

    // condition to jump the monkey
    if (keyDown("space") && monkey.y >= 220) 
    {
      monkey.velocityY = -13;
    }

    monkey.velocityX = 5;
    camera.position.x = monkey.position.x
    camera.position.y = monkey.position.y
    

    ground.velocityX = 5;

    //adding gravity
    monkey.velocityY = monkey.velocityY + 0.9;

    //reset the background
    if (scene.x < 0) 
    {
      scene.x = scene.width / 2;
    }
    console.log(scene.width)
    

    //To destroy one banana at a time and update score
    if (monkey.isTouching(foodGroup)) 
    {
      for (var i = 0; i < foodGroup.length; i++) 
      {
        if (monkey.isTouching(foodGroup[i]))
        {
          foodGroup[i].destroy();
          score = score + 2;
        }
      }
    }

    // To change monkey size when it reaches a particular score
    switch (score) 
    {
      case 10:
        monkey.scale = 0.12;
        break;
      case 20:
        monkey.scale = 0.14;
        break;
      case 30:
        monkey.scale = 0.16;
        break;
      case 40:
        monkey.scale = 0.18;
        break;
      default:
        break;
    }

    // spawn food and obstacles  
    spawnObstacle();
    spawnfood();

    //reduce size of monkey when touching obstacle first time
    if (obstacleGroup.isTouching(monkey)) 
 {
      monkey.scale = 0.1;
      count = count + 1;
      
      if(count === 1)
   {
    //to destroy only one stone at a time
       for (var i = 0; i < obstacleGroup.length; i++) 
      {
        if (monkey.isTouching(obstacleGroup[i]))
        {
          obstacleGroup[i].destroy();
        }
      }
    }
  }    
    
    // make game end when monkey touching obstacle second time    
    if(count === 2)
    {
      gameState = END;
    }
       
  } 
  else if (gameState === END)
  {
    // stop moving food, obstacle and background
    foodGroup.setVelocityXEach (0);
    obstacleGroup.setVelocityXEach (0);
    scene.velocityX = 0;
    monkey.velocityY=0;

    //make gameover and restart appear on the screen
    gameOver.visible = true;
    restart.visible = true;
    
    //stop banana and obstacle from disappearing
    foodGroup.setLifetimeEach(-1); 
    obstacleGroup.setLifetimeEach(-1);
    
    //change animation
    monkey.changeAnimation("stop",monkey_stop);
    
    // to reset the game when restart button is pressed
    if (mousePressedOver(restart))
    {
      reset();
    }
  }
  
  drawSprites();
  
  // display score
  text("Score: " + score, 400, 50);
}

function reset()
{
  //write code to reset the game 
  gameState = PLAY;
  restart.visible = false;
  gameOver.visible = false;
  foodGroup.destroyEach();
  obstacleGroup.destroyEach();
  monkey.changeAnimation("running",monkey_running);
  score = 0;
  count = 0;
}

function spawnObstacle()
{
  if (frameCount % 100 === 0) 
  {
    var stone = createSprite(610, 250, 40, 50);
    stone.addImage(obstacle_image);
    //stone.velocityX = -5;
    stone.scale = 0.15;

    //adjust collision radius of stone
    stone.setCollider("circle",20,20,220); 
    //stone.debug=true;
    
    //give lifetime
    stone.lifetime = 120;
    
    // add stones to obstacle group
    obstacleGroup.add(stone);
    }
}

function spawnfood()
{
  if (frameCount % 60 === 0) 
  {
    var banana = createSprite(610, 200, 10, 10);
    banana.y = Math.round(random(120, 200));
    //banana.velocityX = -5;
    banana.addImage(banana_image);
    banana.scale = 0.05;

    //give lifetime
    banana.lifetime = 120;

    //add bananas to food group
    foodGroup.add(banana);
  }
}