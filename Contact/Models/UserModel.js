
const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    Username: {
      type: String,
      required: true,
      trim: true,
    },

    Email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    Password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Login = model("Login", UserSchema);

module.exports = Login;
