// Open and connect socket
let socket = io('/input');
// instantiate timestamps to calculate delta
let timestamp = 10, ptimestamp = 0;
let pos_x = 0, pos_y = 0;
let velo_x = 0, velo_y = 0
let smth_accel_x = 0, smth_accel_y = 0;

function setup(){
    // Select input and listen for changes
    select("#username").input(usernameChanged);
    // select input and listen for changes
    select("#slider-size").input(sliderChanged);
}

// Send username as it changes
function usernameChanged(){
  console.log("username" + this.value);
  socket.emit('username', this.value());
}

// Send brush size as it changes
function sliderChanged(){
  console.log("brush" + this.value());
  socket.emit('brushsize', this.value());
}

function draw(){
    // update time variables
    timestamp = millis();
    let delta_millis = timestamp - ptimestamp;
    let delta_seconds = delta_millis / 1000;
    let weight = .30;
    smth_accel_x = smth_accel_x * (1-weight) + accelerationX * weight;
    smth_accel_y = smth_accel_y * (1-weight) + accelerationY * weight;
    velo_x += smth_accel_x * delta_seconds;
    velo_y += smth_accel_y * delta_seconds;
    let move_x = velo_x * delta_seconds + .5 * smth_accel_x * delta_seconds**2;
    let move_y = velo_y * delta_seconds + .5 * smth_accel_y * delta_seconds**2;
    pos_x += move_x * 10;
    pos_y += move_y * 10;
    pos_x = constrain(pos_x, -10, 10);
    pos_y = constrain(pos_y, -10, 10);
    console.log([pos_x,pos_y]);

    let packet = {
      "x": pos_x,
      "y": pos_y,
      "pitch": 500
    }
    socket.emit("accel", packet);

    // set prev timestamp for next draw cycle
    ptimestamp = timestamp;
}
