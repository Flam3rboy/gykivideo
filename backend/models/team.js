const Team = mongoose.model(
	"Team",
	{
		name: String,
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
		users: [ObjectId],
	},
	"teams"
);
