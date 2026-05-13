const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  eventType: { type: String, required: true, enum: ["click", "page_view"] },
  url: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  x: Number,
  y: Number,
  windowWidth: Number,
  windowHeight: Number,
  referrer: { type: String, default: "direct" },
  target: String,
});

eventSchema.index({ sessionId: 1, timestamp: 1 });

module.exports = mongoose.model("Event", eventSchema);
