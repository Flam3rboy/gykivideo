(async () => {
	const fs = require("fs");
	const express = require("express");
	var jwt = require("express-jwt");
	var guard = require("express-jwt-permissions")();
	const bodyParser = require("body-parser");
	const app = express();
	const server = require("http").Server(app);
	const io = require("socket.io")(server);
	const config = require("./config.json");
	const unless = require("express-unless");

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

	const search = require("./search");
	const link = require("./link");
	const channel = require("./channel");
	const user = require("./user");
	const ws = require("./ws");
	const team = require("./team");
	const file = require("./file");

	await mongoose.connect(config.database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	});

	var noauth = {
		path: [{ url: /\/file\/\w+\/[^\/].+/, methods: ["GET"] }, "/user/login"],
		// strict: false,
		// ext: ["png", "jpg"],
	};

	var jwtTest = jwt({ secret: config.jwtsecret, expiresIn: config.jwtexpire });
	jwtTest.unless = unless;
	var guardCheck = guard.check([["student"], ["teacher"], ["admin"]]);
	jwtTest.unless = unless;

	app.use(bodyParser.json());
	app.use(jwtTest.unless(noauth));
	app.use(guardCheck.unless(noauth));

	ws(io);
	user(app);
	team(app);
	file(app);
	channel(app);
	link(app);
	search(app);

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

	server.listen(config.port, () => {
		console.log("ready on " + config.port);
	});
})();
