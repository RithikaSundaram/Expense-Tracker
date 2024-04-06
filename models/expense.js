const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Expense = new Schema({
  name: String,
  desc: String,
  date: String,
  amt: Number,
});

const expense = mongoose.model("expense", Expense);
module.exports = expense;
