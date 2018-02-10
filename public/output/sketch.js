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
      users[id] = {
        "x": random(W),
        "y": H/2,
        "accel": 0.,
        "fill": "red",
        "osc": new p5.Oscillator()
      };

      // set up osc
      let osc = users[id].osc;
      let effect = users[id].effect;
      osc.start(0);
      osc.setType('saw');
      osc.freq(240);
      osc.amp(0.);

    }

    let user = users[id];

    user["accel"] = data.data;
    user.y = user.accel + user.y; //slow down movement
    user.y = constrain(user.y,0,H); //keep in canvas

    let amp = Math.sin(user.y/10);
    user.osc.amp(amp, 0.05);

    let freq = map(user.y, 0, H,240,480) + Math.sin(user.y/10) * 10;
    user.osc.freq(freq, .01);

    });

    socket.on('disconnected', function(id){
        users[id].osc.stop();
        delete users[id];

      });
}

function draw(){
  fill("red");
  stroke(128);
  background(128);
  for (let user in users) {
    fill(users[user]["fill"]);
    ellipse(users[user].x + Math.sin(users[user].y/10) * 10,users[user].y ,50);
  }
}

function change_tone(user) {

}
