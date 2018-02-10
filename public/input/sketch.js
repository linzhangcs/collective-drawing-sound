// Open and connect socket
let socket = io('/input');

// var datalog = new Array(1,2,3);

let data, p_data;

function setup(){
  data = accelerationZ * 10;
  p_data = accelerationZ * 10;

  //Select input fields
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

  p_data = data;

  let weight = 0.05;
  data = (weight * accelerationZ * 10) + ( (1-weight) * p_data );
  // console.log(parseInt(data));
  socket.emit("accel", parseInt(data));

}
