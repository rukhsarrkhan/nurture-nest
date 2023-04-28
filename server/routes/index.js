const users = require("./users");
const child = require("./child");
const parent = require("./parent");
const nanny = require("./nanny");

const constructorMethod = (app) => {
    app.use("/users", users);
    app.use("/child", child);
    app.use("/parent", parent);
    app.use("/nanny", nanny);
    app.use("*", (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;
