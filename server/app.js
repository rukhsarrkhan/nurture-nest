const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const configRoutes = require("./routes");

const static = express.static(__dirname + "/public");


app.use("/public", static);
app.use(express.json());

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);


//globals here
//This file contains all global variables
//Example: constants, variable names, etc.
global.userTypeParent = "PARENT";
global.userTypeNanny = "NANNY";
global.userTypeChild = "CHILD";

const ctrReq = {};
app.use("/public", static);
app.use(express.json());
app.use(cors());
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.urlencoded({ extended: true }));

// app.use(async (req, res, next) => {
//     const requestBody = JSON.parse(JSON.stringify(req.body));
//     if (requestBody.password) {
//         delete requestBody.password;
//     }
//     console.log(`URL : ${req.originalUrl} HTTP Method: ${req.method}  Request Body ${JSON.stringify(requestBody)}`);
//     if (ctrReq[req.url]) {
//         ctrReq[req.url] += 1;
//     } else {
//         ctrReq[req.url] = 1;
//     }
//     console.log(`The url ${req.url} has been requested ${ctrReq[req.url]} time(s).`);

//     next();
// });

let users = [];

const http = require('http').Server(app);



const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8081"
  }
});

socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on('message', (data) => {
    console.log("message", data);
    socketIO.emit('messageResponse', data);
  });

  //Listens when a new user joins the server
  socket.on('newUser', (data) => {
    //Adds the new user to the list of users
    users.push(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit('newUserResponse', users);
  });

  // socket.on('disconnect', () => {
  //   console.log('🔥: A user disconnected');
  //   //Updates the list of users when a user disconnects from the server
  //   users = users.filter((user) => user.socketID !== socket.id);
  //   // console.log(users);
  //   //Sends the list of users to the client
  //   socketIO.emit('newUserResponse', users);
  //   socket.disconnect();
  // });
});

configRoutes(app);

http.listen(3000, () => {
  console.log(`listening on *:${3000}`);
});


// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log("Your routes will be running on http://localhost:3000");
// });


// var io = require('socket.io')(http);

// io.on('connection', (socket) => {
//   console.log('new client connected', socket.id);

//   socket.on('user_join', (name) => {
//     console.log('A user joined their name is ' + name);
//     socket.broadcast.emit('user_join', name);
//   });

//   socket.on('message', ({ name, message }) => {
//     console.log(name, message, socket.id);
//     io.emit('message', { name, message });
//   });

//   socket.on('disconnect', () => {
//     console.log('Disconnect Fired');
//   });
// });

