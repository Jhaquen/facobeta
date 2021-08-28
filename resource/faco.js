import {  DisplayWindowSetup} from "./facoFunctions.js"
import { HTMLComponent } from "./mainFunctions.js"
import { SideBar } from "./sideBar.js"
import { Timer } from "./timer.js"
import { setupNewExPopup } from "./NewExPopup.js"

const url = "http://localhost:3000"
let DisplayWindowActive = false

window.onload = function() {

    let loginDiv = document.getElementById("LoginDiv")
    let logInButton = document.getElementById("LogInButton")
    let usernameInput = document.getElementById("username")
    let mainpage = document.getElementById("mainpage")
    let WelcomeMessage = document.getElementById("WelcomeMessage")
    let lowerDiv = document.getElementById("lowerDiv")
    let loggedIn = true

    if (!loggedIn) {
        mainpage.style.visibility = "hidden"
        logInButton.addEventListener("click", async function() {
            let user = usernameInput.value
            WelcomeMessage.innerHTML = "Hey "+user
            LoadExercisePage(user)
            loginDiv.style.visibility = "hidden"
            mainpage.style.visibility = "visible"
        })
    } else {
        loginDiv.style.visibility = "hidden"
        let user = "Sascha"
        LoadExercisePage(user)
    }
    
    
}


async function LoadExercisePage(user) {
    
    // get configData of user
    let configdata = await fetch(url+"/getUserExercises", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            user:user
        })
    }).then(response => response.json())
    // create new SideBar component and append the correspoindig HTML Element (HTML Elements are always saved in Object.Component)
    let sideBar = new SideBar(configdata)
    mainpage.prepend(sideBar.Component)
    // add functionality to Exercise Links and newExButtons
    for (let category in sideBar.Links) {
        for (let ex in sideBar.Links[category]) {
            sideBar.Links[category][ex].addEventListener("click",()=>SetupExercise(user,configdata[0].exercise[category][ex].exconfig,category,ex))
        }
        sideBar.newExButtons[category].addEventListener("click",()=>setupNewExPopup(sideBar.newExButtons[category].getBoundingClientRect(),category,user,configdata))
    }
}


async function SetupExercise(user,exconfig,category,ex) {
    
    let exerciseData = await fetch(url+"/getExerciseData", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            user:user,
            exercise:ex
        })
    }).then(response => response.json())

    DisplayWindowSetup(exerciseData,exconfig,user,category,ex)
    
    let timer = new Timer(200)
    lowerDiv.append(timer.Component)

}