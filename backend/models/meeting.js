const Meeting = mongoose.model("Meeting", { creator: ObjectId, team: ObjectId, class: ObjectId });
