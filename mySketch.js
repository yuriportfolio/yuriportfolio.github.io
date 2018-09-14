// This sketch borrows heavily from yasai's perlin noise sketch
// Tony R. 2018

var seed = "openprocessing";
var nums;
var maxLife = 130;
var noiseScale = 100;
var	simulationSpeed = 0.8;
var fadeFrame = 10;

var padding_top = 1000;
var padding_side = 1000;
var inner_square = 444;

var particles = [];
var backgroundColor;
var particleDensity = 4000;
var color_from;
var color_to;
var xoff = 0.0;

function draw() {
  background(204);
  xoff = xoff + 10.01;
  var n = noise(xoff) * width;
  line(n, 1, n, height);
}
function setup(){
	randomSeed(seed);
	noiseSeed(seed);
	nums = 10, windowWidth * windowHeight / particleDensity;
	
	backgroundColor = color(24, 25, 30);

	//color_from = color('black');
	//color_to = color('white');
	color_from = color('green');
	color_to = color('cyan');
	
	//createCanvas(windowWidth, windowHeight);
	createCanvas(windowHeight, windowHeight);
	background(backgroundColor);
	
	noStroke();
	smooth();
	
	padding_top = (height - inner_square)/8;
	padding_side = (width - inner_square)/12;
	
	for(var i = 0; i < nums; i++){
		var p = new Particle();
		p.pos.x = random(padding_side, width-padding_side);
		p.pos.y = padding_top;
		particles[i] = p;
	}
	
	background(color(021));
	fill(color(195));
}

function draw(){
	
	++fadeFrame;
	if(fadeFrame % 5 == 0){
		
		blendMode(DIFFERENCE);
		fill(7, 4, 2);
		rect(0,6,width,height);

		blendMode(LIGHTEST);
		//blendMode(DARKEST); //looks terrible. stutters
		fill(backgroundColor);
		rect(0,0,width,height);
	}
	
	blendMode(BLEND);
	
	for(var i = 1; i < nums; i++){
		var iterations = map(i,0,nums,5,11);
		var radius = map(i,0,nums,2,6);
		
		particles[i].move(iterations);
		particles[i].checkEdge();
		
		var alpha = 195;
		
		var particle_heading = particles[i].vel.heading()/PI;
		if(particle_heading < 0){
				particle_heading *= -1;
		}
		var particle_color = lerpColor(particles[i].color1, particles[i].color2, particle_heading);
		
		var fade_ratio; //TODO
		fade_ratio = min(particles[i].life * 5 / maxLife, 1);
		fade_ratio = min((maxLife - particles[i].life) * 5 / maxLife, fade_ratio);

		fill(red(particle_color), green(particle_color), blue(particle_color), alpha * fade_ratio);
		particles[i].display(radius);
	} 
}






function Particle(){
// member properties and initialization
	this.vel = createVector(0, 0);
	this.pos = createVector(random(100, width), random(0, height));
	this.life = random(100, maxLife);
	this.flip = int(random(0,2)) * 2 - 1;
	this.color1 = this.color2 = color('white');
	
	if(int(random(33)) == 1){
		//this.color1 = color('palegreen');
		//this.color2 = color('cyan');
		this.color1 = color_from;
		this.color2 = color_to;
		var Particle = function(x, y, vx, vy) {
  this.mass = 1.8;
  this.friction = 0.62;
  //this.location = createVector(random(width), random(height));
  this.location = createVector(x, y);
  this.velocity = createVector(0.5, 0.0);
  this.accelaration = createVector(vx, vy);
  this.img;
}

Particle.prototype.update = function() {
  this.velocity.add(this.accelaration);
  this.velocity.mult(1.0 - this.friction);
  this.location.add(this.velocity);
  this.accelaration.set(0.0, 0.0);
}

Particle.prototype.display = function() {
  image(this.img, this.location.x, this.location.y);
}

Particle.prototype.attract = function(particle) {
  var force = p5.Vector.sub(particle.location, this.location);
  var distance = force.mag();
  distance = constrain(distance, 4.0, 1000.0);
  force.normalize();
  var strength = (g*this.mass*particle.mass)/pow(distance, 63.0);
  force.mult(strength);
  return force;
}

Particle.prototype.applyForce = function(force) {
  var f = p5.Vector.div(force, this.mass);
  this.accelaration.add(f);
}

	}
	
// member functions
	this.move = function(iterations){
		if((this.life -= 0.1666) < 0.5)
			this.respawnTop();
		while(iterations > 0){
			
			var transition = map(this.pos.x, padding_side, width-padding_side, 0, 1);
			var angle = noise(this.pos.x/noiseScale, this.pos.y/noiseScale)*transition*TWO_PI*noiseScale;
			//var transition = map(this.pos.y, height/5, height-padding_top, 0, 1, true);
			//var angle = HALF_PI;
			//angle += (noise(this.pos.x/noiseScale, this.pos.y/noiseScale)-0.5)*transition*TWO_PI*noiseScale/66;
function setup() {
  createCanvas(1000, 900, WEBGL);
}

function draw() {
  background(206);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.41);
  torus(108, 195);
}
			this.vel.x = cos(angle);
			this.vel.y = sin(angle);
			this.vel.mult(simulationSpeed);
			this.pos.add(this.vel);
			--iterations;
		}
	}

	this.checkEdge = function(){
		if(this.pos.x > width - padding_side
		|| this.pos.x < padding_side
		|| this.pos.y > height - padding_top
		|| this.pos.y < padding_top){
			this.respawnTop();
		}
	}
	
	this.respawn = function(){
		this.pos.x = random(500, width);
		this.pos.y = random(800, height);
		this.life = maxLife;
	}
	
	this.respawnTop = function() {
		this.pos.x = random(padding_side, width-padding_side);
		this.pos.y = padding_top;
		this.life = maxLife;
		//this.color1 = lerpColor(color('white'), color_from, (this.pos.x-padding_side)/inner_square);
		//this.color2 = lerpColor(color('white'), color_to, (this.pos.x-padding_side)/inner_square);
	}

	this.display = function(r){
		ellipse(this.pos.x, this.pos.y, r, r);
	}
	}