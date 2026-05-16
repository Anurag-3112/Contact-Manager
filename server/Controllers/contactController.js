const Contact = require("../models/Contact");

createContact = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        if (!name || !phone || !email) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!email.includes("@")) {
            return res.status(400).json({ error: "Invalid email format" });
        }
        if (phone.length < 10) {
            return res.status(400).json({ error: "Phone must be at least 10 digits" });
        }
        const contact = new Contact({ name, phone, email });
        await contact.save();
        res.status(201).json(contact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

getContact = async (req, res) => {
    try {
        const search = req.query.search || "";
        const sortOrder = req.query.sort === "asc" ? 1 : -1;
        const contacts = await Contact.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search } },
            ],
        }).sort({ createdAt: sortOrder });
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

updateContact = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const updated = await Contact.findByIdAndUpdate(
            req.params.id,
            { name, phone, email },
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

deleteContact = async (req, res) => {
    try {
        const deleted = await Contact.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Contact not found" });
        }
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {createContact, getContact, updateContact, deleteContact};