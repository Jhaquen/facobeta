const express = require("express")
const app = express()
const exModel = require("../models/exModel.js")
const configModel = require("../models/configModel.js")

app.get("/", (req,res)=>{
    res.render("faco")
})

app.post("/getExerciseData", (req,res)=>{
    exModel.find({user:req.body.user, exercise:req.body.exercise},(err,data)=>{
        if (err) { res.send({err}) } else {
            res.send(JSON.stringify(data))
        }
    })
})

app.post("/getUserExercises", (req,res)=>{
    configModel.find({user:req.body.user},(err,data)=>{
        if (err) { res.send({err}) } else {
            res.send(JSON.stringify(data))
        }
    })
})

app.post("/saveExerciseData", (req,res)=>{
    exModel.create(req.body,(err,created)=>{
        if (err) { res.send({err}) } else { res.send("saved") }
    })
})

app.post("/newExercise", (req,res)=>{
    configModel.findOneAndUpdate({user:req.body.user},{exercise:req.body.exercise},{new:true},(err,created)=>{
        if (err) { res.send({err}) } else { res.send(JSON.stringify(created)) }
    })
})

module.exports = app