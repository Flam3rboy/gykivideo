const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fetch = require("node-fetch");
var FormData = require("form-data");
const config = require("./config.json");
const Channel = mongoose.model("Channel");
const User = mongoose.model("User");
const Team = mongoose.model("Team");
const { ObjectId } = mongoose.Types;

module.exports = (app) => {
	app.get("/user", async (req, res, next) => {
		try {
			var user = await User.findById(req.user.id).exec();
			if (!user) throw new Error("Nutzer nicht gefunden");
			var { id, username, role } = user;

			res.json({ success: true, id, username, role });
		} catch (error) {
			next(error);
		}
	});

	app.get("/user/teams", async (req, res, next) => {
		try {
			var id = req.user.id;

			var teams = await Team.find({ users: id }).exec();
			teams = teams.map((team) => {
				var { id, users, name } = team;
				return { id, users, name };
			});

			res.status(200).json({ success: true, teams });
		} catch (error) {
			next(error);
		}
	});

	app.get("/user/dms", async (req, res, next) => {
		try {
			var id = req.user.id;

			var dms = await Channel.find({ recipients: id }, "-messages");
			dms = dms.map((dm) => {
				var { recipients, team, id } = dm;
				return { recipients, team, id };
			});

			res.status(200).json({ success: true, dms });
		} catch (error) {
			next(error);
		}
	});

	app.post("/user/setKey", async (req, res, next) => {
		try {
			if (!req.body) throw new Error("POST must contain body");
			if (!req.body.RSA) throw new Error("Bitte übergebe einen RSA Schlüssel");
			if (!req.body.RSA.privateKey) throw new Error("Bitte übergebe einen privaten RSA Schlüssel");
			if (!req.body.RSA.publicKey) throw new Error("Bitte übergebe einen öffentlichen RSA Schlüssel");
			var { privateKey, publicKey } = req.body.RSA;

			var userid = req.user.id;

			var user = await User.findByIdAndUpdate(userid, { $set: { privateKey, publicKey } }).exec();

			res.status(200).json({ success: true, ...user });
		} catch (error) {
			next(error);
		}
	});

	app.post("/user/login", async (req, res, next) => {
		try {
			if (!req.body) throw new Error("POST must contain body");
			var { username, password, role, privateKey, publicKey } = req.body;
			if (!role) role = "student";
			if (!["student", "teacher", "admin"].includes(role)) throw new Error("Unbekannte Nutzerrolle");

			var user = await User.findOne({ username }).exec();
			var needRSAKey = false;
			var teams;
			if (!user || !user.password) {
				var loginRes = await login(role, { username, password });
				if (!loginRes.success) throw loginRes.error;
				var hash = await bcrypt.hash(password, config.saltRounds);

				if (role === "student") {
					// add student to his class
					var className = loginRes.user.class;
					var userTeam = await Team.findOne({ name: className }).exec();

					if (!userTeam) {
						var timetable;
						// create team if it doesn't exist
						if (loginRes.plan) {
							timetable = convertTimetable(loginRes.plan);
						} else {
							timetable = undefined;
						}
						userTeam = await new Team({ name: className, timetable, users: [], teams: [] }).save();
					}
				} else if (role === "teacher") {
					var className = "Lehrerzimmer";
					var userTeam = await Team.findOne({ name: className }).exec();

					if (!userTeam) {
						// create team if it doesn't exist
						userTeam = await new Team({ name: className, users: [], teams: [] }).save();
					}
				}

				user = await new User({ username, password: hash, role }).save();

				if (["student", "teacher"].includes(role)) {
					await addUserToTeam({ team: userTeam.id, user: user.id });
				}
			} else {
				teams = await Team.findById(user.class).exec();
				role = user.role;
			}

			var correctPassword = await bcrypt.compare(password, user.password);
			if (!correctPassword)
				throw new Error("Ungültiges Password oder ein Nutzer mit dem Nutzernamen existiert bereits");

			const accessToken = jwt.sign({ id: user.id, permissions: [role] }, config.jwtsecret, {
				expiresIn: config.jwtexpire,
			});

			if (!user.privateKey || !user.publicKey) {
				needRSAKey = true;
			} else {
				privateKey = user.privateKey;
				publicKey = user.publicKey;
			}

			var toReturn = {
				success: true,
				accessToken,
				needRSAKey,
				user: {
					username,
					id: user.id,
					role,
					privateKey, // private key is encrypted saved with users aes password key
					publicKey,
				},
			};

			res.status(200).json(toReturn);
		} catch (error) {
			next(error);
		}
	});
};

function addUserToTeam({ user, team }) {
	return Team.findByIdAndUpdate(team, { $push: { users: user } }).exec();
}

function login(role, args) {
	switch (role) {
		case "student":
			return loginStudent(args);
		case "teacher":
			return loginTeacher(args);
		case "admin":
			if (password !== "q3IOUUlfA!3sTVjkaNfTSO") return { success: false, error: error.toString() };
			return { success: true };
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
						class: "9C",
					},
				};
			case 1:
			case 3:
				throw new Error("Zu Oft falsch eingegeben: Bitte versuche es in " + status.B + " minuten erneut");
			case 2:
				return {
					success: true,
					user: {
						username,
						password,
						class: klasse,
					},
					plan: undefined,
				};
				throw new Error("Benutzername oder Passwort falsch");
		}
	} catch (error) {
		return { success: false, error: error };
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
			return { success: true };
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
