const mongoose = require("mongoose");

// Generic atomic counter — one document per counter "key".
// Used to generate auto-incrementing, non-reusable sequence numbers
// (e.g. per-bank Ref No). The counter only ever moves forward:
// deleting a TSRInitiation record does NOT decrement or free up its number.
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g. "ICICI", "IHFC", "ABFL", "BAJAJ"
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model("Counter", CounterSchema);