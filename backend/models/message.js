const mongoose = require("mongoose");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;
module.exports = mongoose.model("Message", {
	author: ObjectId,
	content: String,
	read: Boolean,
	reply: ObjectId,
	type: String, // dm, channel
	timestamp: Date,
});
