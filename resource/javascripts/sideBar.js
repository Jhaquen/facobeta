import { HTMLComponent } from "./mainFunctions.js"
import { SVG } from "./svgCollection.js"
const url = "http://localhost:3000"

/*
export function sideBarSetup(configdata,user,ExerciseDiv) {
    
    for (let category in configdata.exercise) { //Warum ist data eine liste? Nur ein element
        let categoryDiv = HTMLComponent("div", HTMLComponent("h2",undefined,"ExCategory",category), "ExCategoryDiv", `ExCategoryDiv${category}`)
        let linkDiv = HTMLComponent("div",undefined,"LinkDiv",`LinkDiv${category}`) //noch ein Div zum besseren anordnen der Links
        for (let ex in configdata.exercise[category]) {
            let exerciseLink = HTMLComponent("p",ex,"ExLink",`${ex}Link`)
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
        let newExButton = HTMLComponent("button","new","AddButton",`newExButton${category}`)
        newExButton.addEventListener("click",()=>{
            setupNewExPopup($(`#newExButton${category}`).position(),category,user,configdata)
        })
        linkDiv.append(newExButton)
        categoryDiv.append(linkDiv)
        ExerciseDiv.append(categoryDiv)
    }
}
*/

export class SideBar {

    constructor(configdata) {
        this.configdata = configdata[0]
        this.setup()
    }

    setup() {

        this.SideBarDiv = HTMLComponent("div",undefined,"SideBar","SideBarDiv")
        
        this.categoryDivs = {}
        this.links = {}
        this.newExButtons = {}
        
        for (let category in this.configdata.exercise) {
            // create Divs per category containing title+newExButton and links
            let header = HTMLComponent("h2",category,"ExCategoryHeader Sidebar",`ExCategoryHeader${category}`)
            let newExButton = HTMLComponent("button",SVG.Plus(0.5),"ExCategoryHeader Sidebar NewButton",`ExCategoryNewButton${category}`)
            this.newExButtons[category] = newExButton
            let headerDiv = HTMLComponent("div",[header,newExButton],"ExCategoryHeaderDiv Sidebar", `ExCategoryHeaderDiv${category}`)
            let categoryDiv = HTMLComponent("div", headerDiv, "ExCategoryDiv SideBar", `ExCategoryDiv${category}`)
            let linkDiv = HTMLComponent("div",undefined,"LinkDiv SideBar",`LinkDiv${category}`) //noch ein Div zum besseren anordnen der Links
            // create links (without functionality) and append to exLinks
            for (let ex in this.configdata.exercise[category]) {
                let exerciseLink = HTMLComponent("p",ex,"ExLink",`${ex}Link`)
                if (Object.keys(this.links).includes(category)) { this.links[category][ex] = exerciseLink }
                else { this.links[category] = {}; this.links[category][ex] = exerciseLink }
                linkDiv.append(exerciseLink)
            }
            categoryDiv.append(linkDiv) //append links to category
            // sort category and append to sidebar
            this.categoryDivs[category] = categoryDiv 
            this.SideBarDiv.append(categoryDiv)
        }
    }

    get Component() {
        return this.SideBarDiv
    }
    get Categories() {
        return this.categoryDivs
    }
    get Links() {
        return this.links
    }
    get NewExButtons() {
        return this.newExButtons
    }
}