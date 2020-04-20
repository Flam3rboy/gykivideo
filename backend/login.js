var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const fetch = require("node-fetch");
var FormData = require("form-data");
const bcrypt = require("bcrypt");
const config = require("./config.json");

module.exports = (app) => {
	const User = mongoose.model("User");
	const Teacher = mongoose.model("Teacher");
	const Team = mongoose.model("Team");
	const Class = mongoose.model("Class");

	app.post("/user/login", async (req, res) => {
		var { username, password } = req.body;

		User.findOne({ username }).exec(async function (err, user) {
			try {
				if (!user) {
					var login = await loginUser({ username, password });
					if (!login.success) throw login.error;

					var hash = await bcrypt.hash(password, config.saltRounds);

					user = await new User({ username, password: hash, class: login.user.klasse }).save();
				}

				var correctPassword = await bcrypt.compare(password, user.password);
				if (!correctPassword) throw new Error("Ungültiges Password");

				const accessToken = jwt.sign({ username: username, id: user.id }, config.jwtsecret);

				var toReturn = {
					success: true,
					accessToken,
					user: {
						class: user.class,
						username,
					},
				};

				res.status(200).json(toReturn);
			} catch (error) {
				res.status(400).json({ success: false, error: error.toString() });
			}
		});
	});

	app.post("/teacher/login", async (req, res) => {
		var { username, password } = req.body;

		Teacher.findOne({ username }).exec(async function (err, teacher) {
			try {
				if (!teacher) {
					var login = await loginTeacher({ username, password });
					if (!login.success) throw login.error;

					var hash = await bcrypt.hash(password, config.saltRounds);
					teacher = await new Teacher({ username, password: hash }).save();
				}

				var correctPassword = await bcrypt.compare(password, user.password);
				if (!correctPassword) throw new Error("Ungültiges Password");

				res.status(200).json({ success: true, ...teacher._doc });
			} catch (error) {
				res.status(400).json({ success: false, error: error.toString() });
			}
		});
	});

	async function loginUser({ username, password }) {
		try {
			if (!username) throw new Error("Bitte gib einen gültigen Nutzernamen ein");
			if (!password) throw new Error("Bitte gib ein gültiges Passwort ein");
			var plan = "stundenplan";

			var body = new FormData();
			body.append("username", username);
			body.append("password", password);
			body.append("mode", 1);
			body.append("test", 0);

			try {
				var text = await fetch(config.gyki, {
					method: "POST",
					headers: body.getHeaders(),
					body,
				});
			} catch (error) {
				console.error(error);
				throw new Error("Datenbank nicht erreichbar");
			}

			try {
				var json = await text.json();
			} catch (error) {
				throw new Error("Benutzername oder Passwort falsch");
			}

			var { status } = json;

			var { B } = status;
			if (!B) B = "wenigen";

			switch (status.A) {
				case 0:
					plan = json.s_plan;
					var klasse = status.C;
					if (!klasse) throw new Error("Dein Konto hat keine Klasse");

					Class.findOne({ name: klasse }).exec(async function (err, classEntry) {
						if (err) return console.error(error);

						var timetable = convertTimetable(plan);

						if (!classEntry) {
							await new Class({ name: klasse, timetable, users: [] }).save();
						}

						Class.updateOne({ name: klasse }, { $push: { users: username } }).exec();
					});

					return {
						success: true,
						user: {
							username,
							password,
							klasse,
						},
					};
				case 1:
				case 3:
					throw new Error("Zu Oft falsch eingegeben: Bitte versuche es in " + status.B + " minuten erneut");
				case 2:
					throw new Error("Benutzername oder Passwort falsch");
			}
		} catch (error) {
			return { success: false, error: error.toString() };
		}
	}

	async function loginTeacher({ username, password }) {
		try {
			if (!username) throw new Error("Bitte gib einen gültigen Nutzernamen ein");
			if (!password) throw new Error("Bitte gib ein gültiges Passwort ein");

			console.log(username, password);

			var body = new FormData();
			body.append("user", username);
			body.append("password", password);

			try {
				var cookie = await fetch(config.infoportal);
				cookie = cookie.headers.get("set-cookie").split("; ")[0].split("=")[1];
				var api = await fetch(config.infoportal, {
					method: "POST",
					headers: {
						Cookie: "infoportal=" + cookie,
						"content-length": body.getLengthSync(),
						...body.getHeaders(),
					},
					body,
				});
				var text = await api.text();
			} catch (error) {
				console.error(error, api, await api.text());
				throw new Error("Infoportal nicht erreichbar");
			}

			if (api.redirected) {
				return { success: true, teacher: { username, password } };
			} else {
				var searchError = "<p class='font' style='font-size: 10pt; color: #CC0033'>";
				var error = text.indexOf(searchError);
				if (error !== -1) {
					// login failed
					error = text.slice(error);
					error = error.slice(searchError.length, error.indexOf("</p>"));
					throw "Fehler vom Infoportal: " + error;
				} else {
					throw new Error("Benutzername oder Passwort falsch");
				}
			}
		} catch (error) {
			return { success: false, error: error.toString() };
		}
	}

	function convertTimetable(table) {
		var tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
		var time = [];

		tage.forEach((tag) => {
			time.push({ day: tag, lessons: [] });
		});

		table = table.forEach((x) => {
			var l = { time: x.zeit, hour: parseInt(x.stunde) };

			x.tage.forEach((lesson, i) => {
				time[i].lessons.push({ ...l, name: lesson });
			});
		});

		return time;
	}
};
