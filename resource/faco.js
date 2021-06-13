import {  DisplayWindowSetup, setupNewExPopup, div, buttonButton } from "./facoFunctions.js"

const url = "http://localhost:3000"
let DisplayWindowActive = false

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
        }).then(response => response.json()).then(configdata => {
            // Setup SideBar
            console.log(configdata)
            for (let category in configdata[0].exercise) { //Warum ist data eine liste? Nur ein element
                let categoryDiv = div(`<h2 class="ExCategory" id=${category}>${category}</h2>`,"ExCategoryDiv",`ExCategoryDiv${category}`)
                let linkDiv = div(undefined,"LinkDiv",`LinkDiv${category}`) //noch ein Div zum besseren anordnen der Links
                for (let ex in configdata[0].exercise[category]) {
                    let exerciseLink = $(`<p class="ExLink" id="${ex}_link"></p>`).text(ex)
                    //exerciseLink.data("ex",ex)
                    let exconfig = configdata[0].exercise[category][ex].exconfig
                    // Exercise = Link: If clicked on -> DisplayWindowSetup for this Exercise 
                    exerciseLink.on("click",()=>{
                        // get data of exercise
                        fetch(url+"/getExerciseData", {
                            method:"POST",
                            headers:{"Content-type":"application/json"},
                            body:JSON.stringify({
                                user:user,
                                exercise:ex
                            })
                        }).then(response => response.json()).then(data => { DisplayWindowSetup(data,exconfig,user,category,ex) })
                    })
                    //Append each Exercise
                    linkDiv.append(exerciseLink)
                }   
                let newExButton = buttonButton("new","AddButton",`newExButton${category}`)
                newExButton.on("click",()=>{
                    setupNewExPopup($(`#newExButton${category}`).position(),category,user,configdata)
                })
                linkDiv.append(newExButton)
                categoryDiv.append(linkDiv)
                $("#ExerciseDiv").append(categoryDiv) 
            }

        })
        $("#LoginDiv").fadeOut(400)
        $("#mainpage").fadeIn(200)
    })
})