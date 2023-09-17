const mongoose = require("mongoose");

let app = mongoose.Schema({

  serverId: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: false
  },
  globalChatChannel: {
    type: String,
    required: false
  },
  globalChatEnabled: {
    type: Boolean, 
    default: false 
  },
  commandsRan: {
    type: Number,
    default: 0
  },
  blacklisted: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("servers", app);