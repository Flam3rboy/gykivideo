const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("./config.json");
const User = mongoose.model("User");
const Team = mongoose.model("Team");

module.exports = (app) => {
	var { guard } = app;

	app.get("/teams", async (req, res, next) => {
		try {
			var teams = await Team.find({}).exec();
			teams = teams.map((x) => {
				return { id: x.id, name: x.name, teams: x.teams, users: x.users };
			});
			res.status(200).json({ success: true, teams });
		} catch (error) {
			next(error);
		}
	});

	app.get("/teams/:id", async (req, res, next) => {
		try {
			if (!req.params.id) throw new Error("Bitte gib eine Team id ein");
			var x = await Team.findById(req.params.id).exec();
			if (!x) throw new Error("Team nicht gefunden");
			var team = { id: x.id, name: x.name, teams: x.teams, users: x.users, timetable: x.timetable };
			res.status(200).json({ success: true, team });
		} catch (error) {
			next(error);
		}
	});

	app.post("/teams/create", guard.check([["admin"], ["teacher"]]), async (req, res, next) => {
		try {
			res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});
};

function addUserToTeam({ user, team }) {
	return Team.findByIdAndUpdate(team, { $push: { users: user } }).exec();
}
