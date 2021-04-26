import { setupTable, inputRowWeight, setupChart } from "./facoFunctions.js"

const url = "http://localhost:3000"
let DisplayWindowActive = false

function DisplayWindowSetup(data,user,ex) {

    console.log(data) //Nur zum testen!
    
    let table = $("#ExerciseTable")
    let chartDiv = $("#ChartDiv")
    
    if (DisplayWindowActive==true) {
        table.children().remove()
        console.log(chartDiv.children())
        chartDiv.children().remove()
    } else {DisplayWindowActive = true}
    
    setupTable(table,data)
    inputRowWeight(table,user,ex)
    chartDiv.html(`<canvas id="DataChart"></canvas>`)
    let chartObject = document.getElementById("DataChart").getContext("2d")
    setupChart(chartObject,data)
}

$(document).ready(()=>{

    $("#mainpage").hide()
    
    $("#LogInButton").on("click", ()=>{
        
        let user = $("#username").val()
        $("#WelcomeMessage").text("Hey "+user)

        fetch(url+"/getUserExercises", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                user:user
            })
        }).then(response => response.json()).then(data => {
            // Setup SideBar
            for (let ex in data[0].exercise) {
                let exerciseLink = $(`<p id="${ex}_link"></p>`).text(ex)
                exerciseLink.data("ex",ex)
                // Exercise = Link: If clicked on -> DisplayWindowSetup for this Exercise 
                exerciseLink.on("click",()=>{
                    fetch(url+"/getExerciseData", {
                        method:"POST",
                        headers:{"Content-type":"application/json"},
                        body:JSON.stringify({
                            user:user,
                            exercise:ex
                        })
                    }).then(response => response.json()).then(data => { DisplayWindowSetup(data,user,ex) })
                })
                //Append each Exercise
                $("#ExerciseDiv").append(exerciseLink) 
            }

        })
        $("#LoginDiv").fadeOut(400)
        $("#mainpage").fadeIn(200)
    })
})