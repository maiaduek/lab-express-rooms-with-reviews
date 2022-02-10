const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
   email: String,
   password: String,
   fullName: String,
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
