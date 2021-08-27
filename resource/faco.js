import {  DisplayWindowSetup, setupNewExPopup, div, HTMLObject, buttonButton } from "./facoFunctions.js"

const url = "http://localhost:3000"
let DisplayWindowActive = false

window.onload = function() {

    let loginDiv = document.getElementById("LoginDiv")
    let logInButton = document.getElementById("LogInButton")
    let usernameInput = document.getElementById("username")
    let mainpage = document.getElementById("mainpage")
    let WelcomeMessage = document.getElementById("WelcomeMessage")
    let ExerciseDiv = document.getElementById("ExerciseDiv")

    mainpage.style.visibility = "hidden"
    logInButton.addEventListener("click",()=>{
        
        let user = usernameInput.value
        WelcomeMessage.innerHTML = "Hey "+user

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
                let categoryDiv = HTMLObject("div", HTMLObject("h2",undefined,"ExCategory",category), "ExCategoryDiv", `ExCategoryDiv${category}`)
                let linkDiv = HTMLObject("div",undefined,"LinkDiv",`LinkDiv${category}`) //noch ein Div zum besseren anordnen der Links
                for (let ex in configdata[0].exercise[category]) {
                    let exerciseLink = HTMLObject("p",ex,"ExLink",`${ex}Link`)
                    let exconfig = configdata[0].exercise[category][ex].exconfig
                    // Exercise = Link: If clicked on -> DisplayWindowSetup for this Exercise 
                    exerciseLink.addEventListener("click",()=>{
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
                let newExButton = HTMLObject("button","new","AddButton",`newExButton${category}`)
                newExButton.addEventListener("click",()=>{
                    setupNewExPopup($(`#newExButton${category}`).position(),category,user,configdata)
                })
                linkDiv.append(newExButton)
                categoryDiv.append(linkDiv)
                ExerciseDiv.append(categoryDiv)
            }

        })
        loginDiv.style.visibility = "hidden"
        mainpage.style.visibility = "visible"
    })
}