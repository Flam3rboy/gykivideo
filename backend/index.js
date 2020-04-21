const fs = require("fs");
const express = require("express");
var jwt = require("express-jwt");
var guard = require("express-jwt-permissions")();
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const config = require("./config.json");
const mongoose = require("mongoose");
var guard = require("express-jwt-permissions")({
	requestProperty: "user",
	permissionsProperty: "permissions",
});
var path = __dirname + "/models/";
var models = fs.readdirSync(path);
models.forEach((file) => {
	require(path + file);
});
app.guard = guard;

const user = require("./user");
const ws = require("./ws");
const team = require("./team");

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser());
app.use(jwt({ secret: config.jwtsecret, expiresIn: config.jwtexpire }).unless({ path: ["/user/login"] }));
app.use(guard.check([["student"], ["teacher"], ["admin"]]).unless({ path: "/user/login" }));

ws(io);
user(app);
team(app);

app.use(function (err, req, res, next) {
	if (err.code === "permission_denied") {
		res.status(403).json({ success: false, error: "Forbidden" });
	} else if (err.name === "UnauthorizedError") {
		res.status(401).json({ success: false, error: "Invalid Token" });
	} else if (err) {
		res.status(400).json({ success: false, error: err.toString() });
	} else {
		next();
	}
});

server.listen(2000, () => {
	console.log("ready");
});
