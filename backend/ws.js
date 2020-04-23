const mongoose = require("mongoose");
const socketioJwt = require("socketio-jwt");
const config = require("./config.json");
const User = mongoose.model("User");
const Team = mongoose.model("Team");

module.exports = (io) => {
	io.on(
		"connection",
		socketioJwt.authorize({
			secret: config.jwtsecret,
			timeout: 15000,
		})
	).on("authenticated", async function (socket) {
		var user = socket.decoded_token.id;
		var user = await User.findById(user).exec();
		if (!user) throw new Error("Nutzer nicht gefunden");

		user._doc.id = user.id;
		user = user._doc;
		delete user._id;
		delete user.__v;
		socket.user = user;
		console.log(user);

		socket.join(user.id);

		var onevent = socket.onevent;
		socket.onevent = function (packet) {
			var args = packet.data || [];
			onevent.call(this, packet); // original call
			packet.data = ["*"].concat(args);
			onevent.call(this, packet); // additional call to catch-all
		};

		socket.on("*", function (event, data) {
			console.log(event + ":", data);
		});

		socket
			.on("room", (room) => {
				socket.join(room);
			})
			.on("disconnect", (reason) => {
				// if (["ping timeout", "transport close", "transport error"].includes(reason)) {}
				console.error("[socket.io] Disconnect - " + reason);
			})
			.on("error", (error) => {
				console.error(error);
			})
			.on("message", (message) => {});
	});
};
