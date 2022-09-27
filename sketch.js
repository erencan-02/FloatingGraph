
//Screen Size
var SCREEN_WIDTH;
var SCREEN_HEIGHT;

//Node Speed
var LOWER_SPEED_BOUND = 0.5;
var UPPER_SPEED_BOUND = 2;


//Node Options
var NODE_RADIUS = 3;
var INITIAL_NODE_COUNT = 200;
var NODE_RANGE = 200; 
var MAX_NEIGHBOUR_COUNT = 15;
var MAX_NODE_COUNT = 300;

const UNIT = 50000; //pixel²
const NODES_PER_UNIT = 3;

//Visuals
const INITIAL_EDGE_COLOR = [255, 255, 255];
const INITIAL_NODE_COLOR = [255, 255, 255];
var EDGE_COLOR = INITIAL_EDGE_COLOR;
var NODE_COLOR = INITIAL_NODE_COLOR;
var BG_COLOR = [13, 17, 23]


var isPaused = false;

var partyLights = false;


if(navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)){
  // true for mobile device
  MAX_NODE_COUNT = 100;
}


var nodes = [];
var edges = [];

var recentlyAddedNodesCount = 0;

let rand = (x, y, isPos) => {
  return (isPos ? int((y-x)*Math.random()) + x :random([-1,1]) * (int((y-x)*Math.random()) + x) );
}

let randomSpeed = () => {
  return rand(LOWER_SPEED_BOUND, UPPER_SPEED_BOUND);
}

let distance = (n1, n2) => {
  return int(Math.sqrt( Math.pow(n1.position.getPosX() - n2.position.getPosX(), 2) + Math.pow(n1.position.getPosY() - n2.position.getPosY(), 2)));
}

let calcOpacity = (d) => {
  return (d >= NODE_RANGE ? 0 : (1 - (1/NODE_RANGE)*d)); 
}

let optimalNodeCount = (w, h) => {
  //return int(((w*h)/UNIT)*NODES_PER_UNIT);
  return 0;
}

function checkDOMChange()
{
    // check for any new element being inserted here,
    // or a particular node being modified
    let x = document.getElementById("defaultCanvas0");
    
    if(x != null){
      x.style.width = "100%";
      x.style.height = "100%";
    }
    else{
      // call the function again after 100 milliseconds
      setTimeout(checkDOMChange, 100);
    }
}


function setup() {

  cnv = createCanvas(displayWidth, displayHeight);  

  SCREEN_WIDTH = displayWidth;
  SCREEN_HEIGHT = displayHeight;
  INITIAL_NODE_COUNT = optimalNodeCount(SCREEN_WIDTH, SCREEN_HEIGHT);
    
  for(let i=0; i<INITIAL_NODE_COUNT; i++){
    let randomX = rand(NODE_RADIUS, SCREEN_WIDTH-NODE_RADIUS, true);
    let randomY = rand(NODE_RADIUS, SCREEN_HEIGHT-NODE_RADIUS, true);

    let randomSpeedX = randomSpeed();
    let randomSpeedY = randomSpeed();
    
    nodes[i] = new Node(new Position(randomX, randomY), new Vector(randomSpeedX, randomSpeedY)); 
  }
}

function draw() {

  if(partyLights){
    EDGE_COLOR = [0, random(0, 256),random(0, 256)];
  }
  else{
    EDGE_COLOR = INITIAL_EDGE_COLOR;
  }

  background(BG_COLOR[0], BG_COLOR[1], BG_COLOR[2]);
    
  if(!isPaused){
    for(let i=0; i<nodes.length; i++){
      if(nodes[i] != null){
        nodes[i].move();
        nodes[i].detectNeighbours();
      }
    }
  }


  stroke(EDGE_COLOR[0], EDGE_COLOR[1], EDGE_COLOR[2]);
  for(let k=0; k<edges.length; k++){
    strokeWeight(edges[k].opacity);
    edges[k].show();
  }

  fill(NODE_COLOR[0], NODE_COLOR[1], NODE_COLOR[2]);
  stroke(NODE_COLOR[0], NODE_COLOR[1], NODE_COLOR[2]);
  for(let i=0; i<nodes.length; i++){
    if(nodes[i] != null){
      //nodes[i].move();
      nodes[i].show();
    }
  }
  
  //fill(255,255,255,255);
}

function mouseDragged() {
  if(nodes.length >= MAX_NODE_COUNT){
    return;
  }

  if(isPaused){
    return;
  }

  var c = createNode(new Position(mouseX, mouseY), randomSpeed(), randomSpeed());

  //var tmp = new Node(new Position(mouseX, mouseY), new Vector(0, 0));

  /*nodes.forEach((n) => {
    if(distance(tmp, n) < NODE_RANGE && !(n === c)){

      var diff = new Vector(n.getPosX()-mouseX, n.getPosY()-mouseY);
      diff.mul(n.getVelocity().getLength()/diff.getLength());

      //var k = 1.0;
      //n.setSpeedX(k*diff.x);
      //n.setSpeedY(k*diff.y);
    }
  })*/
}


function mouseClicked(){
  if(nodes.length >= MAX_NODE_COUNT){
    return;
  }

  if(isPaused){
    return;
  }

  var c = createNode(new Position(mouseX, mouseY), randomSpeed(), randomSpeed());

  var tmp = new Node(new Position(mouseX, mouseY), new Vector(0, 0));

  nodes.forEach((n) => {
    if(distance(tmp, n) < NODE_RANGE && !(n === c)){

      var diff = new Vector(n.getPosX()-mouseX, n.getPosY()-mouseY);
      diff.mul(n.getVelocity().getLength()/diff.getLength());

      var k = 1.0;
      n.setSpeedX(k*diff.x);
      n.setSpeedY(k*diff.y);
    }
  })
}



class Vector{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  getLength(){
    return Math.sqrt(this.x*this.x + this.y*this.y).toFixed(2);
  }

  mul(k){
    this.x *= k; 
    this.y *= k;
  }
}

class Node{
  constructor(position, velocityVector){
    this.position = position;
    
    //Speed: Pixel/Frame
    this.velocity = velocityVector;
    this.speedX = velocityVector.x;
    this.speedY = velocityVector.y;
    
    this.neighbours = [];
    this.arcs = [];
  }

  getVelocity(){
    return this.velocity;
  }
  
  getSpeedX(){
    return this.speedX;
  }

  getSpeedY(){
    return this.speedY;
  }

  setSpeedX(k){
    this.speedX = k;
    this.velocity.x = k;
  }
  
  setSpeedY(k){
    this.speedY = k;
    this.velocity.y = k;
  }

  getPosX(){
    return this.position.getPosX();
  }

  getPosY(){
    return this.position.getPosY();
  }
  
  show(){
    circle(this.getPosX(), this.getPosY(), 2*NODE_RADIUS);
  }
  
  move(){
    this.position.changeX(this.speedX);
    this.position.changeY(this.speedY);
    
    let x = this.getPosX();
    let y = this.getPosY();
    
    if(x <= NODE_RADIUS || x+NODE_RADIUS >= SCREEN_WIDTH){
       this.speedX *= -1;
    }
    
    if(y <= NODE_RADIUS || y+NODE_RADIUS >= SCREEN_HEIGHT){
       this.speedY *= -1;
    }
  }
  
  
  detectNeighbours(){
    for(let i=0; i<nodes.length; i++){
      let n = nodes[i];
      
      
      if(this.neighbours.length >= MAX_NEIGHBOUR_COUNT){
         break;
      }
      
      
      if(n.neighbours.length >= MAX_NEIGHBOUR_COUNT){
         continue;
      }
      
      
      if(n == this || distance(this, n) > NODE_RANGE || this.neighbours.includes(n) || n.neighbours.includes(this)){
        continue;
      }
      
      
      var e = new Edge(this, n);
      edges.push(e);

      this.neighbours.push(n);
      n.neighbours.push(this);

      this.arcs.push(e);
      n.arcs.push(e);
    }
  }
}


class Edge{
  constructor(node1, node2){
    this.node1 = node1;
    this.node2 = node2;
    
    this.opacity = 0;
    this.dist = 1;
  }
  
  show(){
    this.updateAlpha();
    
    
    line(this.node1.position.getPosX(), this.node1.position.getPosY(), this.node2.position.getPosX(), this.node2.position.getPosY());
  }
  
  updateAlpha(){
    this.dist = (distance(this.node1, this.node2));
    
    if(this.dist > NODE_RANGE){
      //this.node1.neighbours = this.node1.neighbours.filter(item => item != this.node2);
      //this.node2.neighbours = this.node2.neighbours.filter(item => item != this.node1);
      //edges = edges.filter(item => !(item === this));

      this.node1.neighbours = removeFromArray(this.node1.neighbours, this.node2);
      this.node1.arcs = removeFromArray(this.node1.arcs, this);

      this.node2.neighbours = removeFromArray(this.node2.neighbours, this.node1);
      this.node2.arcs = removeFromArray(this.node2.arcs, this);

      edges = removeFromArray(edges, this);

      return;
    }
    
    this.opacity = calcOpacity(this.dist);
  }
}


class Position{
  constructor(initialX, initialY){
    this.posX = initialX;
    this.posY = initialY;
  }
  
  setPosX(x){
    this.posX = x;
  }
  
  getPosX(){
    return this.posX;
  }
  
  setPosY(y){
    this.posY = y;
  }
  
  getPosY(){
    return this.posY;
  }
  
  changeX(x){
    this.posX += x;
  }
  
  changeY(y){
    this.posY += y;
  }
  
}


function changeNodeSpeed(diff){
  nodes.forEach((n) => {
    n.setSpeedX(n.getSpeedX() + diff);
    n.setSpeedY(n.getSpeedY() + diff);
  });
}


function randomizeSpeed(){
  nodes.forEach((n) => {
    n.setSpeedX(randomSpeed());
    n.setSpeedY(randomSpeed());
  })
}

function createNode(position, speedX, speedY){
  var n = new Node(position, new Vector(speedX, speedY));
  nodes.push(n);
  recentlyAddedNodesCount = 1;

  return n;
}

function addRandomNodes(k){
  if(nodes.length + k > MAX_NODE_COUNT){
    k = Math.max(0, MAX_NODE_COUNT-nodes.length);
  }

  for (var i=0; i<k; i++) {
    let randomX = rand(NODE_RADIUS, SCREEN_WIDTH-NODE_RADIUS, true);
    let randomY = rand(NODE_RADIUS, SCREEN_HEIGHT-NODE_RADIUS, true);
    
    let randomSpeedX = rand(LOWER_SPEED_BOUND, UPPER_SPEED_BOUND);
    let randomSpeedY = rand(LOWER_SPEED_BOUND, UPPER_SPEED_BOUND);

    createNode(new Position(randomX, randomY), randomSpeedX, randomSpeedY);
  }

  recentlyAddedNodesCount = (k > 0) ? k : 0;
}

function removeNodes(k){
  if(k >= nodes.length){
    removeAll();
    return;
  }

  let x = nodes.length - k;
  removeAll();
  addRandomNodes(x);
}


function removeAll(){
  nodes = [];
  edges = [];
}


function removeFromArray(array, element){
  return array.filter(item => !(item === element));
}



checkDOMChange();
