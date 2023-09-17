const mongoose = require("mongoose");

let app = mongoose.Schema({

  userId: {
    type: String,
    required: true
  },
  blacklisted: {
    type: Boolean, 
    default: false 
  },
  messagesSent: {
    type: Number,
    default: 0
  },
  warning: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("users", app);