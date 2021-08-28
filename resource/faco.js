import {  DisplayWindowSetup, setupNewExPopup} from "./facoFunctions.js"
import { HTMLComponent } from "./mainFunctions.js"
import { SideBar } from "./sideBar.js"
import { Timer } from "./timer.js"

const url = "http://localhost:3000"
let DisplayWindowActive = false

window.onload = function() {

    let loginDiv = document.getElementById("LoginDiv")
    let logInButton = document.getElementById("LogInButton")
    let usernameInput = document.getElementById("username")
    let mainpage = document.getElementById("mainpage")
    let WelcomeMessage = document.getElementById("WelcomeMessage")
    let ExerciseDiv = document.getElementById("ExerciseDiv")
    let lowerDiv = document.getElementById("lowerDiv")

    mainpage.style.visibility = "hidden"


    logInButton.addEventListener("click", async function() {
        
        let user = usernameInput.value
        WelcomeMessage.innerHTML = "Hey "+user

        let configdata = await fetch(url+"/getUserExercises", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                user:user
            })
        }).then(response => response.json())
        let sideBar = new SideBar(configdata)
        mainpage.prepend(sideBar.Component)
        for (let category in sideBar.Links) {
            for (let ex in sideBar.Links[category]) {
                sideBar.Links[category][ex].addEventListener("click",()=>CreateExWindowLink(user,configdata[0].exercise[category][ex].exconfig,category,ex))
            }
        }

        let timer = new Timer(200)
        lowerDiv.append(timer.Component)
        
        loginDiv.style.visibility = "hidden"
        mainpage.style.visibility = "visible"
    })
}

async function CreateExWindowLink(user,exconfig,category,ex) {

    fetch(url+"/getExerciseData", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            user:user,
            exercise:ex
        })
    }).then(response => response.json()).then(data => { DisplayWindowSetup(data,exconfig,user,category,ex) })
}