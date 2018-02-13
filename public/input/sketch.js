// Open and connect socket
let socket = io('/input');

let data, p_data;
let velX = 0, velY = 0;

function setup(){
  data = createVector(0,0);
  p_data = createVector();
console.log(data)
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
    // Round rotation to clousest int
    let lr = floor(rotationY);

    // Ignore flipped over device
    lr = constrain(lr, -90, 90);
    // Map rotation between 100 and 1000
    let pitch = map(lr, -90, 90, 100,1000)

    velX = -pAccelerationX;
    velY = pAccelerationY;

      let tmp = {
          "x": velX,
          "y": velY,
          "pitch": pitch
      }


  socket.emit("accel", tmp);

}
