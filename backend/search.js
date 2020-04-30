const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (app) => {
	app.post("/search/users", async (req, res, next) => {
		try {
			if (!req.body.name) throw new Error("Bitte gib einen Namen ein");
			var name = req.body.name;
			var users = await User.find({ username: { $regex: name, $options: "i" } }, "username")
				.limit(40)
				.exec();
			users = users.map((user) => {
				var { id, username } = user;
				return { id, username };
			});
			res.status(200).json({ success: true, users });
		} catch (error) {
			next(error);
		}
	});
};
