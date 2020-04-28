const mongoose = require("mongoose");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;
module.exports = User = mongoose.model(
	"User",
	{ role: String, username: String, password: String, nickname: String, publicKey: String, privateKey: String }, // private key is encrypted saved with users aes password key
	"users"
);
// Teams werden in Teams.users abgespeichert
