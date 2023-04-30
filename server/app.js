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
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
