module.exports = (socket) => {
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

	var token = localStorage.getItem("token");

	if (!token) return console.log("invalid token");

	token = token.replace("Bearer ", "");

	socket
		.on("error", (error) => {
			console.error(error);
		})
		.on("authenticated", function () {})
		.emit("authenticate", { token });
};
