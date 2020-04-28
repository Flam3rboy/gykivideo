const mongoose = require("mongoose");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;
const Message = require("./message").schema;
module.exports = mongoose.model("Channel", { recipients: [ObjectId], team: ObjectId, messages: [Message] }, "channels");
