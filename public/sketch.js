// Open and connect socket
let socket = io();
// Keep track of users
let users = {};

// Create new user
// with nametag element
// and position
function createNewUser(id) {
  users[id] = {
    elt: createP(''),
    pos: undefined,
    color: 140,
    brushsize: 10
  }
}

function setBrushSize(id, size){
  // console.log(users[id]);
  users[id].brushsize = size;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  // Select input and listen for changes
  select("#username").input(usernameChanged);

  // select input and listen for changes
  select("#slider-size").input(sliderChanged);

  // Listen for confirmation of connection
  socket.on('connect', function () {
    console.log("Connected");
  });

  // Listen for updates to usernames
  socket.on('username', function (message) {
    let id = message.id;
    let username = message.username;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }
    // Update namtetag element with new username
    users[id].elt.html(username);
  });

  // Receive message from server
  socket.on('message', function (message) {
    //console.log(message);
    let id = message.id;
    let pos = message.data;

    // New user
    if (!(id in users)) {
      createNewUser(id);
    }
    // Position the nametag element
    users[id].elt.position(pos.x, pos.y);
    users[id].pos = pos;
  });

  // Listen for updates to setBrushSize
  socket.on('brushsize', function(message){
    let id = message.id;
    let size = message.size;
    setBrushSize(id, size);
    // console.log("id "+id + "  size: "+ size);
  });
  // Remove disconnected users
  socket.on('disconnected', function(id){
    delete users[id];
  });
}

// How would you draw a line from current position to previous position?
function draw() {
  // Draw all users positions
  for(let id in users) {
    let user = users[id];
    let pos = user.pos;
    push();
    fill(user.color);
    translate(pos.x, pos.y);
    ellipse(0, 0, user.brushsize, user.brushsize);
    pop();
  }
}

// Send mouse position only when mouse moves
function mouseMoved(){
  socket.emit('data', {x: mouseX, y: mouseY});
}

// Send username as it changes
function usernameChanged(){
  socket.emit('username', this.value());
}

// Send brush size as it changes
function sliderChanged(){
  // console.log(this.value());
  socket.emit('brushsize', this.value());
}
