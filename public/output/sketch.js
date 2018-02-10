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

    user["accel"] = data.data;
    user.y = user.accel + user.y; //slow down movement
    user.y = constrain(user.y,0,H); //keep in canvas

    // let amp = Math.sin(user.y/10);
    let amp = 1;
    user.osc.amp(amp, 0.05);

    let freq = map(user.y, 0, H,240,480) + Math.sin(user.y/10) * 10;
    user.osc.freq(freq, .01);

    });

    // Listen for updates to usernames
    socket.on('username', function (data) {
      let id = data.id;
      let username = data.username;

      if(!(id in users)){
        setupUser(id);
      }

      users[id].username = username;
      // let username = message.username;
      // Update namtetag element with new username
      // users[id].elt.html(username);
    });
    // Listen for updates to setBrushSize
    socket.on('brushsize', function(data){
      let id = data.id;
      let brushsize = data.brushsize;

      if(!(id in users)){
        setupUser(id);
      }
      console.log("id: "+data.id);
      console.log("brushsize "+ data.brushsize);
      users[id].brushsize = brushsize;
      console.log("brushsize:" +users[id].brushsize );
    });

    socket.on('disconnected', function(id){
        users[id].osc.stop();
        delete users[id];

      });
}
function setupUser(id){
    users[id] = {
      "x": random(W),
      "y": H/2,
      "accel": 0.,
      "fill": random(0,200),
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
    osc.amp(1);
}

function draw(){
  fill("red");
  stroke(128);
  // background(128);
  for (let user in users) {
    fill(users[user]["fill"]);
    ellipse(users[user].x + Math.sin(users[user].y/10) * 10,users[user].y, users[user].brushsize);
    console.log(users[user].brushsize);
  }

}

function change_tone(user) {

}
