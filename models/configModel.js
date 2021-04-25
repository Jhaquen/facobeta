const mongoose = require("mongoose")

const ConfigSchema = new mongoose.Schema({
    user: String,
    exercise: Object
})

module.exports = mongoose.model("Testconfig", ConfigSchema)