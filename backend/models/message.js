const Message = mongoose.model("Message", {
	author: ObjectId,
	content: String,
	read: Boolean,
	reply: ObjectId,
	room: ObjectId,
	timestamp: Date,
});
