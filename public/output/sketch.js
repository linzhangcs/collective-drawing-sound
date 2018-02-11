// Open and connect socket
let socket = io('/output');

let users = {};

var W,H;

function setup(){

  W = windowWidth - 50;
  H = windowHeight - 50;

  createCanvas(W, H);
  background(128);

  socket.on('movement', function(data) {

    let id = data.id;
    let accel = data.data;

    if (!(id in users)) {
      setupUser(id);
    }

    let user = users[id];

    user.accel = data.data;

    user.pos.x += user.accel.x;
    user.pos.y += user.accel.y;
    user.pos.x = constrain(user.pos.x,0,W); //keep in canvas
    user.pos.y = constrain(user.pos.y,0,H); //keep in canvas
    console.log("data: "+data.data.x + "   "+ data.data.y);
    let amp = 1;
    user.osc.amp(amp, 0.05);

    user.osc.freq(data.data.pitch);

    });

    // Listen for updates to usernames
    socket.on('username', function (data) {
      let id = data.id;
      let username = data.username;

      if(!(id in users)){
        setupUser(id);
      }

      users[id].username = username;

    });
    // Listen for updates to setBrushSize
    socket.on('brushsize', function(data){
      let id = data.id;
      let brushsize = data.brushsize;

      if(!(id in users)){
        setupUser(id);
      }

      users[id].brushsize = brushsize;
      users[id].osc.amp(map(brushsize, 1, 50, 0, 1));
    });

    socket.on('disconnected', function(id){
        users[id].osc.stop();
        delete users[id];

      });
}
function setupUser(id){
    users[id] = {
      "pos": createVector(W/2, H/2),
      "accel": createVector(),
      "fill": 255,//random(0,200),
      "username": "Hello",
      "brushsize":3,
      "osc": new p5.Oscillator()
    };

    // set up osc
    let osc = users[id].osc;
    let effect = users[id].effect;
    osc.start(0);
    osc.setType('saw');
    osc.freq(240);
    osc.amp(map(users[id].brushsize, 1, 50, 0, 1));
}

function draw(){
  fill("red");
  stroke(128);
  // background(128);
  for (let user in users) {
    fill(users[user]["fill"]);
    ellipse(users[user].pos.x, users[user].pos.y, users[user].brushsize);
    //console.log(users[user].brushsize);
  }

}
