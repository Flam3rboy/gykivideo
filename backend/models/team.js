const mongoose = require("mongoose");
const { String, ObjectId, Boolean, Date } = mongoose.Schema.Types;
module.exports = mongoose.model(
	"Team",
	{
		name: String,
		users: [ObjectId],
		teams: [ObjectId],
		timetable: [
			{
				day: String,
				lessons: [
					{
						time: String,
						hour: String,
						name: String,
					},
				],
			},
		],
	},
	"teams"
);
