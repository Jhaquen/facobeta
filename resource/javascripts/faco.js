import { HTMLComponent } from "./mainFunctions.js"
import { SideBar } from "./sideBar.js"
import { Timer } from "./timer.js"
import { ExPopup } from "./popup.js"
import { Table } from "./table.js"

export const url = "http://localhost:3000"
let exWindowActive = false
var timer // Set in SetupExercise
var table // Set in SetupExercise
var chart

window.onload = function() {

    let loginDiv = document.getElementById("LoginDiv")
    let logInButton = document.getElementById("LogInButton")
    let usernameInput = document.getElementById("username")
    let mainpage = document.getElementById("mainpage")
    let WelcomeMessage = document.getElementById("WelcomeMessage")
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
            sideBar.Links[category][ex].addEventListener("click",()=>{
                SetupExercise(user,configdata[0].exercise[category][ex],ex)
                sideBar.setActive(category,ex)
            })
        }
        sideBar.newExButtons[category].addEventListener("click",()=>{
            let popup = new ExPopup(category,user,configdata,sideBar)
            document.body.append(popup.Component)
        })
    }
}


export async function SetupExercise(user,exconfig,ex) {
    
    let lowerDiv = document.getElementById("lowerDiv")
    let mainDiv = document.getElementById("mainDiv")
    let chartDiv = document.getElementById("ChartDiv")

    let exerciseData = await fetch(url+"/getExerciseData", {
        method:"POST",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
            user:user,
            exercise:ex
        })
    }).then(response => response.json())
    
    
    // set up or reset Timer
    if (!exWindowActive) {
        console.log(exconfig)
        timer = new Timer(exconfig.timedata)
        lowerDiv.append(timer.Component)
    } else {
        timer.set(exconfig.timedata)
    }
    
    // set up or change Table (and Graph but thats about to change)
    if (!exWindowActive) {
        table = new Table(exerciseData,exconfig.exdata,ex,user)
        lowerDiv.append(table.Component)
        for (let input in table.Inputs) {
            if (input.replace(/ \d/g,"")!="Weight") {
                table.Inputs[input].addEventListener("input",()=>timer.start())
            }
        }
    } else {
        table.update(exerciseData,exconfig.exdata,ex,user)
    }
    
    // set up Graph
    if (!exWindowActive) {
        let chartdata = calculateChartData(exconfig,exerciseData)
        chart = new Plot("100%","50vh",chartdata,{axes:{x:false}})
        chartDiv.append(chart.Component)
        chart.startUp()
    } else {
        let chartdata = calculateChartData(exconfig,exerciseData)
        chart.update(chartdata)
        chart.startUp() // lieber graph.change?
    }

    // save that the window displaying the table and graph is currently active
    mainDiv.style.visibility = "visible"
    exWindowActive = true
    
}

function calculateChartData(config,data) {
    let chartData = []
    if (config.exdata == "BW") {
        let earliestDate = new Date(data[0].date).getTime()
        let dates = []
        for (let ex of data) {
            dates.push( (new Date(ex.date).getTime() - earliestDate) / (1000 * 3600 * 24) )
        }
        for (let i=0; i<dates.length; i++) {
            chartData[i] = {x:dates[i], y:[data[i].data.rep1,data[i].data.rep2,data[i].data.rep3]}
        }
    } else {
        chartData = [
            {x:10,y:[20,15,10]},
            {x:100,y:[230,200,190,120]}
        ]
    }
    return chartData
}