import {  DisplayWindowSetup, setupNewExPopup} from "./facoFunctions.js"
import { HTMLObject } from "./mainFunctions.js"
import { sideBarSetup } from "./sideBar.js"
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
    logInButton.addEventListener("click",()=>{
        
        let user = usernameInput.value
        WelcomeMessage.innerHTML = "Hey "+user

        fetch(url+"/getUserExercises", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                user:user
            })
        }).then(response => response.json()).then(configdata => { sideBarSetup(configdata[0],user,ExerciseDiv) })
        let timer = new Timer(200)
        lowerDiv.append(timer.Element)
        
        loginDiv.style.visibility = "hidden"
        mainpage.style.visibility = "visible"
    })
}