const fs = require("fs");
const express = require("express");
var jwt = require("express-jwt");
const bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const config = require("./config.json");
const mongoose = require("mongoose");
const login = require("./login");
const ws = require("./ws");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;

fs.readdirSync;

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser());
app.use(jwt({ secret: config.jwtsecret, expiresIn: "365d" }).unless({ path: ["/user/login", "/teacher/login"] }));
login(app);
ws(io);

server.listen(2000, () => {
	console.log("ready");
});
