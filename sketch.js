let snowflakes = []; // array to hold snowflake objects
let snowGlobeR = 70; // radius of the snow globe (ellipse)
let gravity = 0.03; // reduced gravity for gentle motion
let colorChange = true;

function setup() {
  noCursor();
  createCanvas(600, 500);
  noStroke();
}

function draw() {
  if (colorChange){
    background("#247BA0");
  }
  else{
    background("lightblue");
  }
  
  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(2); i++) {
    // Reduced the number of snowflakes
    snowflakes.push(new Snowflake()); // append snowflake object
  }

  // the snow globe
  fill(255, 100);
  ellipse(mouseX, mouseY, snowGlobeR * 2);

  // star
  globeStar()

  // loop through snowflakes
  for (let flake of snowflakes) {
    flake.move(t); // update snowflake position
    flake.checkCollision(); // check if it collides with the snow globe
    flake.display(); // draw snowflake
  }

  // snow globe holder
  push();
  fill(255, 0, 0);
  rectMode(CENTER);
  rect(mouseX, mouseY + snowGlobeR, snowGlobeR, snowGlobeR * 0.2);
  pop();
}

class Snowflake {
  constructor() {
    // initialize snowflake positions
    this.posX = random(width);
    this.posY = random(-50, 0); // somewhere outside of the canvas
    this.initialangle = random(0, 2 * PI);
    this.size = random(5, 10); // snowflake size range
    this.radius = sqrt(random(pow(width / 2, 2))); // for normal motion
    this.isInGlobe = false; // track if it's inside the globe
    this.velX = random(-0.5, 0.5); // horizontal drift inside the globe
    this.velY = random(0, 0.5); // initial vertical velocity
    this.speedLimit = 1.5; // speed limit for snowflakes
  }

  move(time) {
    if (!this.isInGlobe) {
      // normal snowflake falling motion (not inside the globe)
      let w = 0.6; // angular speed
      let angle = w * time + this.initialangle;
      this.posX = width / 2 + this.radius * sin(angle);
      this.posY += pow(this.size, 0.5);

      // delete snowflake if past end of screen
      if (this.posY > height) {
        let index = snowflakes.indexOf(this);
        snowflakes.splice(index, 1);
      }
    } else {
      // gravity inside the globe
      this.velY += gravity; // small gravity effect 0.03
      this.posY += this.velY;
      this.posX += this.velX;

      // avoid fast falling
      this.velY = constrain(this.velY, -this.speedLimit, this.speedLimit);

      let distanceFromCenter = dist(this.posX, this.posY, mouseX, mouseY);

      // SNOWGLOBE GRAVITY
      // If snowflake hits the bottom or sides of the globe, move horizontally
      if (distanceFromCenter > snowGlobeR - this.size / 2) {
        let angle = atan2(this.posY - mouseY, this.posX - mouseX);
        this.velX = -cos(angle) * random(0.5, 1); // gentle reflection

        // keep the snowflake inside the snow globe's bottom edge
        this.posX = mouseX + (snowGlobeR - this.size / 2) * cos(angle);
        this.posY = mouseY + (snowGlobeR - this.size / 2) * sin(angle);
      }
    }
  }

  checkCollision() {
    // check if the snowflake touched the snow globe
    let distanceFromMouse = dist(this.posX, this.posY, mouseX, mouseY);
    if (distanceFromMouse < snowGlobeR) {
      this.isInGlobe = true; // once inside, it stays in the globe
    }
  }

  display() {
    ellipse(this.posX, this.posY, this.size);
  }
}

function mousePressed() {
  snowflakes = [];
  colorChange=!colorChange;
}

function globeStar(){
  push();
  fill(230, 230, 0, 230);
  quad(
    mouseX,
    mouseY - 50,
    mouseX + 20,
    mouseY,
    mouseX,
    mouseY + 50,
    mouseX - 20,
    mouseY
  );
  quad(
    mouseX - 50,
    mouseY,
    mouseX,
    mouseY - 20,
    mouseX + 50,
    mouseY,
    mouseX,
    mouseY + 20
  );
  fill(255,100)
  quad(
    mouseX,
    mouseY - 50,
    mouseX + 5,
    mouseY,
    mouseX,
    mouseY + 50,
    mouseX - 5,
    mouseY
  );
  quad(
    mouseX - 50,
    mouseY,
    mouseX,
    mouseY - 5,
    mouseX + 50,
    mouseY,
    mouseX,
    mouseY + 5
  );
  pop();}