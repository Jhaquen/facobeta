const express = require("express")
const app = express()
const path = require("path")
const mongoClient = require("mongodb").MongoClient
const mongoose = require("mongoose")

const port = 3000
const staticRouter = require("./routes/staticRouter.js")
const url = "mongodb+srv://Barbara:0000@cluster0.lkv3a.mongodb.net/sport?retryWrites=true&w=majority"

app.use(express.json())
app.use("/",staticRouter)
app.use(express.static(path.join(__dirname, 'resource')))
app.set("view engine", "ejs")
app.set("views", "./views")

mongoose.connect(url, {useNewUrlParser:true, useUnifiedTopology:true})
const db = mongoose.connection
db.once("open",()=>{
    console.log(`Database connected: ${url}`)
})
db.on("error",(err)=>{
    console.log(err)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app