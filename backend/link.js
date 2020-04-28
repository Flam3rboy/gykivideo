const urlMetadata = require("url-metadata/lib/parse");
const atob = require("atob");
const fetch = require("node-fetch");

module.exports = (app) => {
	app.get("/link/:url", async (req, res, next) => {
		try {
			if (!req.params.url) throw new Error("Bitte gib einen Link an");
			var url = decodeURIComponent(atob(req.params.url));
			// TODO check if url is local subnet

			try {
				var metadata = await fetch(url);
				var body = await metadata.text();
				metadata = urlMetadata(url, body, {});
			} catch (error) {
				console.error(error, url, metadata);
				throw new Error("Website nicht erreichbar");
			}

			res.status(200).json({ success: true, ...metadata });
		} catch (error) {
			next(error);
		}
	});
};

function addUserToTeam({ user, team }) {
	return Team.findByIdAndUpdate(team, { $push: { users: user } }).exec();
}
