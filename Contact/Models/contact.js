
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    Phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      trim: true,
    },
    workplace: {
      type: String,
      required: true,
      trim: true,
    },
    Address: {
      type: String,
      required: true,
      trim: true,
    },
    Notes: {
      type: String,
      required: true,
      trim: true,
    },
    favorite: { type: Boolean, default: false }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
