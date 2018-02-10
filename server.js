// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

// Clients in the different namespaces
var outputs = io.of('/output');
var inputs = io.of('/input');

// Listen for individual clients to connect
// io.sockets.on('connection',
// 	// Callback function on connection
//   // Comes back with a socket object
// 	function (socket) {
//
// 		// console.log("We have a new client: " + socket.id);
//     // console.log('An output client connected: ' + socket.id);
//
//   // Listen for this output client to disconnect
//   socket.on('disconnect', function() {
//     console.log("An output client has disconnected " + socket.id);
//   });
// });

outputs.on('connection', function(socket){

});

// Listen for input clients to connect
inputs.on('connection', function(socket){
  // console.log('An input client connected: ' + socket.id);
  // Listen for motion data
  socket.on('accel', function(data) {
    let message = {
      id: socket.id,
      data : data
    }
    outputs.emit('movement', message);
    // console.log(message);
  });

  // Listen for motion data
  socket.on('strike', function(data) {
    let message = {
      id: socket.id,
      data : data
    }
    outputs.emit('movement', message);
    // console.log(message);
  });

  // Listen for updates to usernames
  socket.on('username', function (data) {
    let message = {
      id: socket.id,
      data: data
    }
    outputs.emit('username', message);
    // console.log(username);
    // let username = message.username;
    // Update namtetag element with new username
    // users[id].elt.html(username);
  });
  // Listen for updates to setBrushSize
  socket.on('brushsize', function(data){
    let message = {
      id: socket.id,
      data: data
    }
    outputs.emit('brushsize', message);
    // let size = message.size;
    // setBrushSize(id, size);
    console.log("brushsize called: "+ message.data);
  });
  // Listen for this input client to disconnect
  socket.on('disconnect', function() {
    console.log("An input client has disconnected " + socket.id);
    outputs.emit('disconnected', socket.id);
  });

    // // Listen for username
    // socket.on('username', function(username){
    //   let message = {
    //     id : socket.id,
    //     username : username,
    //   }
    //
    //   // Send it to all of the clients, including this one
    //   io.sockets.emit('username', message);
    // })
    //
    // // Listen for data from this client
    // socket.on('data', function(data) {
    //   // Data can be numbers, strings, objects
		// 	//console.log("Received: 'data' " + data);
    //
    //   let message = {
    //     id: socket.id,
    //     data : data
    //   }
    //
    //   // Send it to all of the clients, including this one
		// 	io.sockets.emit('message', message);
		// });
    //
    // // Listen for brushsize
    // socket.on('brushsize', function(size){
    //   let message = {
    //     id : socket.id,
    //     size: size
    //   }
    //   io.sockets.emit('brushsize', message);
    // });
    //
    // // Listen for this client to disconnect
    // // Tell everyone client has disconnected
    // socket.on('disconnect', function() {
    //   io.sockets.emit('disconnected', socket.id);
    // });
	}
);
