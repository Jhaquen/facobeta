import { forEachValue, HTMLComponent } from "./mainFunctions.js"
import { SetupExercise } from "./faco.js"
const url = "http://localhost:3000"

export function setupNewExPopup(pos,category,user,configdata) {
    console.log(pos,category,user)
    let newExPopup = div(undefined,`NewExPopup`,`NewExPopup${category}`)
    newExPopup.css({
        "top":`${pos.top-50}px`,
        "left":`${pos.left+50}px`,
    })
    let form = div(`
    <input type="text" placeholder="Exercise Name" id="NewExName">
    <form>
    <label for="ExTypeWeigt">Weight</label>
    <input type="radio" name="ExType" id="ExTypeWeight">
    <label for="ExTypeBody">BodyWeight</label>
    <input type="radio" name="ExType" id="ExTypeBody">
    </form>
    `)
    let cancelButton = buttonButton("cancel")
    cancelButton.on("click",()=>{
        newExPopup.remove()
    })
    let confirmButton = buttonButton("confirm")
    confirmButton.on("click",()=>{
        let newExName = $("#NewExName").val()
        if ($("#ExTypeWeight").prop("checked")==true) {
            configdata[0].exercise[category][newExName] = {
                exconfig: ["weight1","rep1","weight2","rep2","weight3","rep3"],
                timeconfig: 120
            }
        } else if ($("#ExTypeBody").prop("checked")==true) { 
            configdata[0].exercise[category][newExName] = {
                exconfig: ["rep1","rep2","rep3"],
                timeconfig: 120
            }
        }
        fetch(url+"/newExercise", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({user:user,exercise:configdata[0].exercise}) })
            let newLink = $(`<p class="ExLink" id="${newExName}_link"></p>`).text(newExName)
        let exconfig = configdata[0].exercise[category][newExName].exconfig
        newLink.on("click",()=>{
            // get data of exercise
            fetch(url+"/getExerciseData", {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                    user:user,
                    exercise:newExName
                })
            }).then(response => response.json()).then(data => { DisplayWindowSetup(data,exconfig,user,category,newExName) }) })
        $(`#LinkDiv${category}`).append(newLink)
        newExPopup.remove()
    })
    newExPopup.append(form); newExPopup.append(cancelButton); newExPopup.append(confirmButton)
    $("body").append(newExPopup)
}

export class ExPopup {

    constructor(category, user, configdata, sidebar) {
        this.popup = HTMLComponent("div",undefined,"NewExPopup")
        this.sidebar = sidebar
        this.popup.style.top = "40vh"
        this.popup.style.left = "40vw"
        this.configdata = configdata; this.user = user; this.category = category
        this.elements = {
            form:{
                nameInput: HTMLComponent("input",undefined,undefined,undefined,{"placeholder":"ExName"}),
                timeInput: HTMLComponent("input",undefined,undefined,undefined,{"placeholder":"Time"}),
                weightLabel: HTMLComponent("label","Weight",undefined,undefined,{"for":"ExTypeWeight"}),
                weightRadio: HTMLComponent("input",undefined,undefined,undefined,{"type":"radio","id":"ExTypeWeight","name":"ExType"}),
                bwLabel: HTMLComponent("label","BodyWeight",undefined,undefined,{"for":"ExTypeBody"}),
                bwRadio: HTMLComponent("input",undefined,undefined,undefined,{"type":"radio","id":"ExTypeBody","name":"EType"})

            },
            buttons: {
                confirmButton: HTMLComponent("button","create"),
                cancelButton: HTMLComponent("button","cancel")
            }
        }
        // Button functionality
        this.elements.buttons.cancelButton.addEventListener("click",()=>{
            this.popup.remove()
        })
        this.elements.buttons.confirmButton.addEventListener("click",()=>{
            this.createDocument()
            this.sendDocument()
            this.insertLink()
            this.startEx()
            this.popup.remove()
        })
        // Append Components
        forEachValue(this.elements,(element)=>{
            this.popup.append(element)
        })
    }

    createDocument() {
        let exdata = this.elements.form.weightRadio.checked?"W":"BW"
        let timedata = parseInt(this.elements.form.timeInput.value)
        this.newExName = this.elements.form.nameInput.value
        this.configdata[0].exercise[this.category][this.newExName] = {
            exdata: exdata,
            timedata: timedata
        }
        console.log("document created: ",this.configdata)
    }

    sendDocument() {
        fetch(url+"/newExercise", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({user:this.user,exercise:this.configdata[0].exercise}) })
    }

    insertLink() {
        console.log(this.sidebar.Links)
        let link = HTMLComponent("p",this.newExName,"ExLink",`${this.newExName}Link`)
        link.addEventListener("click",()=>{
            SetupExercise(this.user,this.configdata[0].exercise[this.category][this.newExName],this.newExName)
        })
        this.sidebar.Categories[this.category].append(link)
    }

    startEx() {
        SetupExercise(this.user,this.configdata[0].exercise[this.category][this.newExName],this.newExName)
    }

    get Component() {
        return this.popup
    }
}