const mongoose = require("mongoose")

const exSchema = new mongoose.Schema({
    user: String,
    date: Date,
    exercise: String,
    data: Object
})

module.exports = mongoose.model("Testsport", exSchema)