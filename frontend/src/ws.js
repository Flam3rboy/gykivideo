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
};
