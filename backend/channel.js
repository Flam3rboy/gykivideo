const mongoose = require("mongoose");
const fetch = require("node-fetch");

module.exports = (app) => {
	app.post("/channel/", async (req, res, next) => {
		try {
			res.status(200).json({ success: true, files: promises });
		} catch (error) {
			next(error);
		}
	});
};

function addUserToTeam({ user, team }) {
	return Team.findByIdAndUpdate(team, { $push: { users: user } }).exec();
}
