var user = { role: String, username: String, password: String, nickname: String };
const User = mongoose.model("User", user, "users");

const Student = mongoose.model("Student", { ...user, class: ObjectId }, "users");
const Teacher = mongoose.model("Teacher", { ...user }, "users");
