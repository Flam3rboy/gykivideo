const mongoose = require("mongoose");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;
module.exports = mongoose.model("Meeting", { creator: ObjectId, team: ObjectId, class: ObjectId });
