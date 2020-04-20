const express = require("express");
var jwt = require("express-jwt");
const bodyParser = require("body-parser");
const app = express();
const config = require("./config.json");
const mongoose = require("mongoose");
const login = require("./login");
const { String } = mongoose.Schema.Types;

mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });

const User = mongoose.model("User", { username: String, password: String, nickname: String, class: String }, "users");
const Teacher = mongoose.model("Teacher", { username: String, password: String, nickname: String }, "teacher");
const Team = mongoose.model("Team", { name: String, classes: [String] }, "teams");
const Class = mongoose.model(
	"Class",
	{
		name: String,
		users: [String],
		timetable: [
			{
				day: String,
				lessons: [
					{
						time: String,
						hour: String,
						name: String,
					},
				],
			},
		],
	},
	"classes"
);

app.use(bodyParser());
app.use(jwt({ secret: config.jwtsecret, expiresIn: "365d" }).unless({ path: ["/user/login", "/teacher/login"] }));
login(app);

app.listen(2000, () => {
	console.log("ready");
});