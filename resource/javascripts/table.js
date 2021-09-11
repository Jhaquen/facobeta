import { HTMLComponent } from "./mainFunctions.js"
import { SVG } from "./svgCollection.js"

const url = "http://localhost:3000"

export class Table {

    constructor(data,exconfigExData,exercise,user) {
        this.data = data
        this.exType = exconfigExData
        this.exercise = exercise
        this.user = user
        this.table = HTMLComponent("table",undefined,"ExDataTable","ExerciseTable")
        if (this.exType == "W") {
            this.sameWeights = checkWeights(this.data)
        } else {
            this.sameWeights = false
        }
        this.longest = getLongestDataObject(this.data)
        this.setupHeader()
        if (this.data.length>0) { this.setupRows() }
        this.setupInput()
        this.setupAccept()
    }
    
    // Create list of Headers
    setupHeader() {
        this.columns = {}
        let headers = ["Date"]
        if (this.data.length>0) {
            // If exercise was already used / data exists
            if (this.exType=="W" && this.sameWeights){
                // if every weight is the same per day
                headers.push("Weight")
                for (let d in this.data[this.longest.index].data) {
                    if (/rep\d/.test(d)) { headers.push("Set "+ d.replace(/\D/g,""))}
                }
            } else if (this.exType=="W" && !this.sameWeights) {
                // order headers in weight 1, rep 1, ...
                let orderedHeaders = orderHeaders(this.data[this.longest.index].data)
                // append the right string to headers
                for (let index in orderedHeaders) {
                    for (let el of orderedHeaders[index]) {
                        if (el.replace(/\d/g,"") == "weight") {
                            headers.push("Weight "+el.replace(/\D/g,""))
                        } else {
                            headers.push("Set "+el.replace(/\D/g,""))
                        }
                    }
                }
            } else {
                // for bodyweight exercsises
                for (let d in this.data[this.longest.index].data) {
                    headers.push("Set "+d.replace(/\D/g,""))
                }
            }
        } else {
            // If exersice does not contain any data / was just created
            if (this.exType=="W") {
                headers.push("Weight", "Set 1", "Set 2", "Set 3")
            } else {
                headers.push("Set 1", "Set 2", "Set 3")
            }
        }
        // Create TabelRow out of TableHeaders containing Headers as content
        let headerComponents = []
        for (let h of headers) {
            let colComp = HTMLComponent("th",h,"tableHeader",`tableHeader${h.replace(" ","")}`)
            headerComponents.push(colComp)
            this.columns[h] = [colComp]
        }
        let header = HTMLComponent("tr",headerComponents)
        let addButton = HTMLComponent("button",SVG.Plus(0.5))
        addButton.addEventListener("click",()=>{
            this.addColumn(Object.keys(this.columns)[Object.keys(this.columns).length-1],"Set")
        })
        header.append(HTMLComponent("td",addButton,"AddSetButtonColumn",undefined,{"rowspan":3}))
        this.table.append(header)
    }

    // setup each data containing row
    setupRows() {

        for (let i=(this.data.length>4)?this.data.length-4:0; i<this.data.length; i++) {
            
            let date = new Date(this.data[i].date).toDateString()
            let dateTableData = HTMLComponent("td",date,"tableData tableDataDate")
            let newRowData = [dateTableData]
            this.columns["Date"].push(dateTableData)
            
            if (this.sameWeights) {
                let weightTableData = HTMLComponent("td",this.data[i].data.weight1,"tableData tableDataWeight",`tableDataWeight`)
                newRowData.push(weightTableData); this.columns["Weight"].push(weightTableData)
                for (let el in this.data[i].data) {
                    if (/rep\d/.test(el)) {
                        let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataRep",`tableData${el.replace(" ","")}_${i}`)
                        newRowData.push(repTableData); this.columns["Set "+el.replace(/\D/g,"")].push(repTableData)
                    }
                } 
                if (Object.keys(this.data[i].data).length < this.longest.length) {
                    for (i=Object.keys(this.data[i].data).length; i>this.longest.length; i++) {
                        let emptyData = HTMLComponent("td","-","tableData tableDataEmpty")
                        newRowData.push(emptyData); this.columns["Set "+i].push(emptyData)
                    }
                } 
            } else {
                let orderedKeys = orderHeaders(this.data[i].data)
                for (let index in orderedKeys) {
                    for (let key of orderedKeys[index]) {
                        for (let el in this.data[i].data) {
                            if (el==key) {
                                if (el.replace(/\d/g,"") == "weight") {
                                    let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataWeight", `tableData${el.replace(" ","")}_${i}`)
                                    newRowData.push(repTableData); this.columns["Weight "+el.replace(/\D/g,"")].push(repTableData)
                                } else {
                                    let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataRep", `tableData${el.replace(" ","")}_${i}`)
                                    newRowData.push(repTableData); this.columns["Set "+el.replace(/\D/g,"")].push(repTableData)
                                }
                            }
                        }
                    }
                }
            }

            let newRow = HTMLComponent("tr",newRowData,"tableRow")
            this.table.append(newRow)
        }
    }

    // Setup Ipnut fields as final row of table
    setupInput() {

        this.inputs = {}
        let inputRow = []

        let emptyTableData = HTMLComponent("td",undefined,"tableData tableDataEmpty")
        inputRow.push(emptyTableData); this.columns["Date"].push(emptyTableData)
        let columnIndex = 0

        for (let column in this.columns) {
            if (column!="Date") {
                let inputField = HTMLComponent("input",undefined,"NewRowInput",`${column.replace(" ","")}Input`,{
                    "type":"number",
                    "min":1,
                    "placeholder":column[0]+column.replace(/\D/g,"")
                })
                let content = [inputField]
                if (column.replace(/ \d/,"")=="Set" && Object.keys(this.columns)[columnIndex-1].replace(/\d/,"")!="Weight" && this.exType=="W") {
                    let addWeightButton = HTMLComponent("button",SVG.Plus(0.4),"NewRowAddWeightButton",`${column.replace(" ","")}NewRowAddWeightButton`)
                    addWeightButton.addEventListener("click",()=>{
                        this.addColumn(column,"Weight")
                        addWeightButton.remove()
                        this.sameWeights = false
                    })
                    content.push(addWeightButton)
                }
                let inputDiv = HTMLComponent("div",content,"NewRowInputDiv",`${column.replace(" ","")}InputDiv`)
                this.inputs[column] = inputField
                let inputTableData = HTMLComponent("td",inputDiv,`tableData tableData${column.replace( /\d/,"")}`,`tableData${column.replace(" ","")}`)
                inputRow.push(inputTableData); this.columns[column].push(inputTableData)
            }
            columnIndex++
        }

        let inputTableRow = HTMLComponent("tr",inputRow,"tableRow inputRow")
        this.table.append(inputTableRow)
    }

    setupAccept() {

        let acceptButton = HTMLComponent("button","SAVE","acceptButton")
        let acceptTableData = HTMLComponent("td",acceptButton, "acceptButtonData")
        acceptTableData.setAttribute("colspan",Object.keys(this.columns).length)
        let acceptTableRow = HTMLComponent("tr",acceptTableData, "tableRow acceptButtonRow")
        this.table.append(acceptTableRow)
        acceptButton.addEventListener("click",()=>{
            let inputvals = []
            for (let input in this.inputs) {
                inputvals.push(this.inputs[input].value=="")
            }
            // Create new Document
            if (inputvals.every(val=>val==false)) {
                let newDocData = {}
                let sets = 0; let weights = 0
                for (let input in this.inputs) {
                    if (/Set \d/.test(input)) {
                        newDocData[`rep${input.replace(/\D/g,"")}`] = parseInt(this.inputs[input].value)
                        sets++
                    }
                    if (/Weight \d/.test(input)) { weights++ }
                }
                if (this.sameWeights && this.exType=="W") {
                    for (let set=0; set<sets; set++) { newDocData[`weight${set+1}`] = parseInt(this.inputs["Weight"].value) }
                } else if (this.exType=="W") {
                    for (let set=0; set<sets; set++) { 
                        if (set<weights) {
                            if (set==0) {
                                newDocData[`weight${set+1}`] = parseInt(this.inputs[`Weight`].value)
                            } else {
                                newDocData[`weight${set+1}`] = parseInt(this.inputs[`Weight ${set+1}`].value)
                            }
                        } else {
                            newDocData[`weight${set+1}`] = parseInt(this.inputs[`Weight ${weights+1}`].value)
                        }
                     }
                }
                // append new document to data and update table
                let newDoc = {
                    data:newDocData,
                    date: new Date().toISOString(),
                    exercise: this.exercise,
                    user: this.user
                }
                this.data.push(newDoc)
                this.update(this.data,this.exType)
                fetch(url+"/saveExerciseData",{
                    method:"POST",
                    headers:{"Content-type":"application/json"},
                    body:JSON.stringify(newDoc) // here it gets send. 
                })
            } 
        })
    
    }

    update(data,exconfigExData) {
        this.table.innerHTML = ""
        this.data = data
        this.exType = exconfigExData
        if (this.exType == "W") {
            this.sameWeights = checkWeights(this.data)
        } else {
            this.sameWeights = false
        }
        this.longest = getLongestDataObject(this.data)
        this.setupHeader()
        if (this.data.length>0) { this.setupRows() }
        this.setupInput()
        this.setupAccept()
        
    }

    addColumn(prevCol,mode) {
        let setIndex = mode=="Weight"?parseInt(prevCol.replace(/\D/g,"")):parseInt(prevCol.replace(/\D/g,""))+1
        this.columns[`${mode} ${setIndex}`] = []
        for (let cell of this.columns[prevCol]) {
            for (let rowIndex=0; rowIndex<this.table.children.length; rowIndex++) {
                let row = this.table.children[rowIndex]
                if (row.children.length>1) {
                    for (let cellRow of row.children) {
                        if (cell.id==cellRow.id) {
                            let newCell
                            switch (rowIndex) {
                                case 0: 
                                    newCell = HTMLComponent("th",`${mode} ${setIndex}`,"tableHeader",`tableHeader${mode}${setIndex}`)
                                    break
                                case this.table.children.length-2:
                                    let inputField = HTMLComponent("input",undefined,"NewRowInput",`${mode}${setIndex}Input`,{
                                        "type":"number",
                                        "min":1,
                                        "placeholder":mode=="Weight"?"W"+setIndex:"S"+setIndex
                                    })
                                    let content = [inputField]
                                    if (mode=="Set") {
                                        let addWeightButton = HTMLComponent("button",SVG.Plus(0.4),"NewRowAddWeightButton",`${prevCol.replace(" ","")}NewRowAddWeightButton`)
                                        addWeightButton.addEventListener("click",()=>{
                                            this.addColumn(Object.keys(this.columns)[Object.keys(this.columns).length-1],"Weight")
                                            addWeightButton.remove()
                                            this.sameWeights = false
                                        })
                                        content.push(addWeightButton)
                                    }
                                    let inputDiv = HTMLComponent("div",content,"NewRowInputDiv",`${mode}${setIndex}InputDiv`)
                                    newCell = HTMLComponent("td",inputDiv,`tableData tableData${mode}`,`tableData${mode}${setIndex}`)
                                    this.inputs[`${mode} ${setIndex}`] = inputField
                                    break
                                default: newCell="";
                            }
                            if (mode=="Set") {
                                cellRow.after(newCell); this.columns[`${mode} ${setIndex}`].push(newCell)
                            } else {
                                cellRow.before(newCell)
                            }
                            break
                        }
                    } 
                }
            }
        }
    }

    get Columns() {
        return this.columns
    }

    get Component() {
        return this.table
    }

    get Inputs() {
        return this.inputs
    }

}


function checkWeights(data) {
    // this checks if at any given day wheights are the same for that day
    let allDates = []
    for (let date of data) {
        let allWeights = []
        for (let d in date.data) {
            if(/weight\d/.test(d)) {
                allWeights.push(date.data[d])
            }
        }
        allDates.push(allWeights.every((el)=>{ return el==allWeights[0] }))
    }
    return allDates.every((el)=>{ return el==true })
}

function getLongestDataObject(data) {
    // this gets the longest object in the array containing the 
    // data of the current exercise
    let lengths = []
    for (let date of data) {
        lengths.push(Object.keys(date.data).length)
    }
    return {
        length: Math.max(...lengths),
        index: lengths.findIndex(el=>{ return el==Math.max(...lengths) })
    }
}

function orderHeaders(headers) {
    // "headers" should be the key names of the longest object in the data 
    // of the current exercise, or any other pair of weight - rep strings
    // would work for any simmilar strings containing values
    let orderedHeaders = {}
    // if weights are different between reps
    // order weights and reps: [weight1,rep1,weight2 ....]
    for (let d in headers) {
        let index = d.replace(/\D/g,"")
        let type = d.replace(/\d/g,"")
        if (!Object.keys(orderedHeaders).includes(index)) {
            orderedHeaders[index] = [d]
        } else {
            if (type=="weight") { orderedHeaders[index].unshift(d) } 
            else { orderedHeaders[index].push(d) } 
        }
    }
    return orderedHeaders
}