import { forEachValue, HTMLComponent } from "./mainFunctions.js"
import { SetupExercise,url } from "./faco.js"
//const url = "http://localhost:3000"

class Popup {
    constructor(width,height) {
        this.popup = HTMLComponent("div",undefined,"NewExPopup")
        this.popup.style.width = width
        this.popup.style.height = height
        this.popup.style.top = `${50-height/2}vh`
        this.popup.style.left = `${50-width/2}vw`
        this.elements = {}
    }
    
    build() {
        forEachValue(this.elements,(element)=>{
            this.popup.append(element)
        })
    }
}
export class ExPopup extends Popup{

    constructor(category, user, configdata, sidebar) {
        super(30,30)
        this.sidebar = sidebar
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
        super.build()
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