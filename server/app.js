const express = require('express');
const app = express();
const cors = require("cors");
const session = require('express-session');
const configRoutes = require('./routes');
const static = express.static(__dirname + '/public');

app.use('/public', static);
app.use(express.json());

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

//globals here
//This file contains all global variables
//Example: constants, variable names, etc.
global.userTypeParent = "PARENT";
global.userTypeNanny = "NANNY";
global.userTypeChild = "CHILD";

app.use(cors());

app.use(express.urlencoded({extended: true}));
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});