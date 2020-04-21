module.exports = (io) => {
	io.on("connection", (socket) => {
		socket.emit("test", "hi");
		socket.on("*", function (event, data) {
			console.log(event);
			console.log(data);
		});
	});
};
