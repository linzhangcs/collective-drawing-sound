// Open and connect socket
let socket = io('/input');

// var datalog = new Array(1,2,3);

let data, p_data;

function setup(){
  data = accelerationZ * 10;
  p_data = accelerationZ * 10;
}

function draw(){

  p_data = data;

  let weight = 0.05;
  data = (weight * accelerationZ * 10) + ( (1-weight) * p_data );
  console.log(parseInt(data));
  socket.emit("accel", parseInt(data));

}
