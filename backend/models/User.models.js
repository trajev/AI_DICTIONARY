const mongoose = require("mongoose");


const userSchema = mongoose.Schema( {
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WordEntry",
    }
  ]
}, { timestamps: true } );


const User = mongoose.model("User", userSchema );

module.exports = User;
