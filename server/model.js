const Contact = mongoose.model("Contact", {
name: String,
phone: String,
email: String,
createdAt: {
type: Date,
default: Date.now
}
});
