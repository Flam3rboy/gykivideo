const mongoose = require("mongoose");
const FormData = require("form-data");
const fetch = require("node-fetch");
const Team = require("./models/team");
const User = require("./models/user");
const config = require("./config.json");
mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
var url = "https://api.gymnasium-kirchheim.de/apitest.php";
var mysql = require("mysql");
var con = mysql.createConnection({
	host: "server",
	user: "root",
	password: "9!Jn9lV$7TQ@",
	database: "gykiapp",
});
con.connect();

var t = ["A", "B", "C", "D", "E", "F"];

function main() {
	for (var stufe = 5; stufe <= 12; stufe++) {
		for (var k = 0; k < t.length; k++) {
			if (stufe > 10) {
				k = t.length - 1;
			}
			setTimeout(
				async (k, stufe, t) => {
					var body = new FormData();
					var klasse = t[k];
					var s = stufe > 9 ? stufe % 10 : stufe;

					body.append("username", klasse + "xx.Testxxx" + s);
					body.append("password", klasse + "GykTest=" + s);
					body.append("mode", 1);

					var name = "" + stufe + klasse;
					if (stufe > 10) {
						name = "Q" + stufe;
					}
					console.log("download: " + name);
					var klass = await fetch(url, {
						method: "POST",
						headers: body.getHeaders(),
						body,
					});
					klass = await klass.json();
					var timetable = klass.s_plan;

					if (valid(timetable)) {
						timetable = convertTimetable(timetable);
						await new Team({ name, users: [], teams: [], timetable }).save();
						console.log("saved: " + name);
					}
				},
				0,
				k,
				stufe,
				t
			);
		}
	}
}

main();

function valid(plan) {
	return plan[0].tage[0] !== "Ber";
}

function convertTimetable(table) {
	var tage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
	var time = [];

	tage.forEach((tag) => {
		time.push({ day: tag, lessons: [] });
	});

	table = table.forEach((x) => {
		var l = { time: x.zeit, hour: parseInt(x.stunde) };

		x.tage.forEach((lesson, i) => {
			time[i].lessons.push({ ...l, name: lesson });
		});
	});

	return time;
}
