const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const configRoutes = require("./routes");

const static = express.static(__dirname + "/public");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
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
let users = [];

const http = require("http").Server(app);

const socketIO = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:8081",
    },
});

socketIO.on("connection", (socket) => {
    socket.on("message", (data) => {
        socketIO.emit("messageResponse", data);
    });

    //Listens when a new user joins the server
    socket.on("newUser", (data) => {
        //Adds the new user to the list of users
        users.push(data);
        //Sends the list of users to the client
        socketIO.emit("newUserResponse", users);
    });

    socket.on("disconnect", () => {
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        //Sends the list of users to the client
        socketIO.emit("newUserResponse", users);
        socket.disconnect();
    });
});

configRoutes(app);

http.listen(3000, () => {
    console.log(`listening on *:${3000}`);
});
