const mongoose = require("mongoose");
var fs = require("fs");
var Grid = require("gridfs-stream");
var path = require("path");
var multer = require("multer");
var uploads = path.join(__dirname, "uploads");
var upload = multer({ dest: uploads });
const { ObjectId } = mongoose.Types;

module.exports = (app) => {
	var GridFS = new mongoose.mongo.GridFSBucket(mongoose.connection.db);

	app.get("/file/:id/:name", async (req, res, next) => {
		try {
			if (!req.params || !req.params.id) throw new Error("Keine ID angegeben");
			if (!req.params.name) throw new Error("Keine Dateiname angegeben");
			var id = new ObjectId(req.params.id);

			try {
				var file = await GridFS.find({ _id: id }).next();
				if (file.filename.filename != req.params.name) throw new Error("Dateiname nicht gefunden");
			} catch (error) {
				console.error(error);
				throw new Error("Datei nicht gefunden");
			}

			var readstream = GridFS.openDownloadStream(id);
			readstream.on("error", (e) => {
				console.log(e);
				return next(new Error("Datei nicht gefunden"));
			});
			readstream.pipe(res);
			// res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	app.delete("/file/:id", async (req, res, next) => {
		try {
			if (!req.params || !req.params.id) throw new Error("Keine ID angegeben");
			var id = new ObjectId(req.params.id);
			var userid = req.user.id;
			var role = req.user.permissions[0];

			try {
				var file = await GridFS.find({ _id: id }).next();
				var user = file.filename.metadata.user;
				if (role !== "admin") {
					if (user !== userid) throw new Error("Du bist nicht autorisiert die Datei zu löschen");
				}
				await GridFS.delete(id);
			} catch (error) {
				throw new Error("Datei nicht gefunden");
			}

			res.status(200).json({ success: true });
		} catch (error) {
			next(error);
		}
	});

	app.post("/file/", upload.any(), async (req, res, next) => {
		try {
			if (!req.files) throw new Error("Keine Datei hochgeladen");

			var promises = [];

			for (var file of req.files) {
				promises.push(
					new Promise((resolve, reject) => {
						var writestream = GridFS.openUploadStream({
							filename: file.originalname,
							contentType: file.mimetype,
							metadata: {
								user: req.user.id,
							},
						});
						writestream.on("error", (e) => {
							reject(e);
						});
						var p = file.path;
						writestream.on("finish", function (f) {
							resolve(f);
							fs.unlink(p, (err) => {
								if (err) console.error(err);
							});
						});
						fs.createReadStream(file.path).pipe(writestream);
					})
				);
			}

			promises = await Promise.all(promises);
			promises = promises.map((file) => {
				return { id: file._id.toString(), filename: file.filename.filename };
			});

			console.log(promises);

			res.status(200).json({ success: true, files: promises });
		} catch (error) {
			next(error);
		}
	});
};

function addUserToTeam({ user, team }) {
	return Team.findByIdAndUpdate(team, { $push: { users: user } }).exec();
}
