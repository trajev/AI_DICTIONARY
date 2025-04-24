const mongoose = require("mongoose");

const wordEntrySchema = mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  definition: {
    type: String,
    required: true,
  },
  userSearched: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],

}, { timestamps: true });


const WordEntry = mongoose.model("WordEntry", wordEntrySchema );

module.exports = WordEntry;

