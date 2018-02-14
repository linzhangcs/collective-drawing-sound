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
    // update time variables and get time delta in SI units, seconds
    timestamp = millis();
    let delta_millis = timestamp - ptimestamp;
    let delta_seconds = delta_millis / 1000;

    // smooth acceleration with simple linear interpolation
    let weight = .05;
    smth_accel_x = smth_accel_x * (1-weight) + accelerationX * weight;
    smth_accel_y = smth_accel_y * (1-weight) + accelerationY * weight;

    // integrate acceleration to get velocity, also friction
    let friction = .99;
    velo_x = velo_x * friction + smth_accel_x * delta_seconds;
    velo_y = velo_y * friction + smth_accel_y * delta_seconds;

    // calculate new position from last position, velocity, and acceleration
    // TODO: i think my understanding of physics is wrong
    // TODO: look at nature of code
    // let move_x = velo_x * delta_seconds + .5 * smth_accel_x * delta_seconds**2;
    // let move_y = velo_y * delta_seconds + .5 * smth_accel_y * delta_seconds**2;
    let move_x = velo_x * delta_seconds;
    let move_y = velo_y * delta_seconds;

    // exagerate movement
    pos_x += move_x * 100;
    pos_y += move_y * 100;

    // limit output to 10x10
    pos_x = constrain(pos_x, -10, 10);
    pos_y = constrain(pos_y, -10, 10);

    // wrap around
    pos_x = pos_x == -10 ? 10 : pos_x == 10 ? -10 : pos_x;
    pos_y = pos_y == -10 ? 10 : pos_y == 10 ? -10 : pos_y;

    // pitch
    let lr = floor(rotationY);
    // Ignore flipped over device
    lr = constrain(lr, -90, 90);
    let pitch = map(lr, -90, 90, 100,1000)

    // build data packet and send
    let packet = {
      "x": pos_x,
      "y": pos_y,
      "pitch": pitch
    }
    socket.emit("accel", packet);

    // set prev timestamp for next draw cycle
    ptimestamp = timestamp;
}
