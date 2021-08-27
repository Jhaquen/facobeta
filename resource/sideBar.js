import { HTMLObject } from "./mainFunctions.js"
import {  DisplayWindowSetup, setupNewExPopup} from "./facoFunctions.js"
const url = "http://localhost:3000"

export function sideBarSetup(configdata,user,ExerciseDiv) {
    
    for (let category in configdata.exercise) { //Warum ist data eine liste? Nur ein element
        let categoryDiv = HTMLObject("div", HTMLObject("h2",undefined,"ExCategory",category), "ExCategoryDiv", `ExCategoryDiv${category}`)
        let linkDiv = HTMLObject("div",undefined,"LinkDiv",`LinkDiv${category}`) //noch ein Div zum besseren anordnen der Links
        for (let ex in configdata.exercise[category]) {
            let exerciseLink = HTMLObject("p",ex,"ExLink",`${ex}Link`)
            let exconfig = configdata.exercise[category][ex].exconfig
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
}