const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
var FormData = require("form-data");
const config = require("./config.json");

module.exports = (app) => {
	const Student = mongoose.model("Student");
	const Teacher = mongoose.model("Teacher");
	const Team = mongoose.model("Team");

	app.get("/user", async (req, res) => {
		res.json({ ...req.user });
	});

	app.post("/user/login", async (req, res) => {
		try {
			var { username, password, role } = req.body;
			if (!role) throw new Error("Bitte gib eine Nutzerrrolle an");
			if (!["student", "teacher"].includes(role)) throw new Error("Unbekannter Nutzerrolle");

			var user = await User.findOne({ username }).exec();
			var userClass;
			if (!user) {
				var login = await login(role, { username, password });
				if (!login.success) throw login.error;
				var hash = await bcrypt.hash(password, config.saltRounds);

				switch (role) {
					case "student":
						userClass = await Team.findOne({ name: userClass }).exec();

						if (!userClass) {
							var timetable = convertTimetable(plan);
							userClass = await new Team({ name: klasse, timetable, users: [] }).save();
						}
						user = await new Student({ username, password: hash, class: userClass.id }).save();
						Team.updateOne({ name: klasse }, { $push: { users: user.id } }).exec();
						break;
					case "teacher":
						teacher = await new Teacher({ username, password: hash }).save();
						return loginTeacher(args);
				}
			} else {
				userClass = await Team.findById(user.class).exec();
			}

			var correctPassword = await bcrypt.compare(password, user.password);
			if (!correctPassword) throw new Error("Ungültiges Password");

			const accessToken = jwt.sign({ username: username, id: user.id, class: user.class }, config.jwtsecret);

			var toReturn = {
				success: true,
				accessToken,
				user: {
					class: user.class,
					username,
					id: user.id,
				},
			};

			res.status(200).json(toReturn);
		} catch (error) {
			res.status(400).json({ success: false, error: error.toString() });
		}
	});
};

function login(role, args) {
	switch (role) {
		case "student":
			return loginStudent(args);
		case "teacher":
			return loginTeacher(args);
		default:
			throw new Error("Unbekannter Nutzerrolle");
	}
}

async function loginStudent({ username, password }) {
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

				return {
					success: true,
					user: {
						username,
						password,
						class: klasse,
					},
					plan,
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
