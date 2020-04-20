const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
var FormData = require("form-data");
const config = require("./config.json");

module.exports = (app) => {
	const Teacher = mongoose.model("Teacher");
	app.post("/teacher/login", async (req, res) => {
		try {
			var { username, password } = req.body;

			var teacher = await Teacher.findOne({ username }).exec();
			if (!teacher) {
				var login = await loginTeacher({ username, password });
				if (!login.success) throw login.error;

				var hash = await bcrypt.hash(password, config.saltRounds);
				teacher = await new Teacher({ username, password: hash }).save();
			}

			var correctPassword = await bcrypt.compare(password, user.password);
			if (!correctPassword) throw new Error("Ungültiges Password");

			const accessToken = jwt.sign({ username: username, id: user.id }, config.jwtsecret);

			var toReturn = {
				success: true,
				accessToken,
				user: {
					username,
					id: teacher.id,
				},
			};

			res.status(200).json(toReturn);
		} catch (error) {
			res.status(400).json({ success: false, error: error.toString() });
		}
	});
};
