import { HTMLComponent } from "./mainFunctions.js"

export class Table {

    constructor(data,exconfigExData) {
        this.data = data
        this.exType = exconfigExData
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
        console.log(this.Component)
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
            let colComp = HTMLComponent("th",h,"tableHeader")
            headerComponents.push(colComp)
            this.columns[h] = [colComp]
        }
        let header = HTMLComponent("tr",headerComponents)
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
                let weightTableData = HTMLComponent("td",this.data[i].data.weight1,"tableData tableDataWeight")
                newRowData.push(weightTableData); this.columns["Weight"].push(weightTableData)
                for (let el in this.data[i].data) {
                    if (/rep\d/.test(el)) {
                        let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataRep")
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
                                    let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataWeight")
                                    newRowData.push(repTableData); this.columns["Weight "+el.replace(/\D/g,"")].push(repTableData)
                                } else {
                                    let repTableData = HTMLComponent("td",this.data[i].data[el], "tableData tableDataRep")
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

        for (let column in this.columns) {
            if (column!="Date") {
                let inputField = HTMLComponent("input",undefined,"NewRowInput",`${column.replace(" ","")}Input`,{
                    "type":"number",
                    "min":1,
                    "placeholder":column[0]+column.replace(/\D/g,"")
                })
                this.inputs[column] = inputField
                let inputTableData = HTMLComponent("td",inputField)
                inputRow.push(inputTableData); this.columns[column].push(inputTableData)
            }
        }

        let inputTableRow = HTMLComponent("tr",inputRow,"tableRow inputRow")
        this.table.append(inputTableRow)
    }

    setupAccept() {

        let acceptButton = HTMLComponent("button","SAVE","acceptButton")
        let acceptTableRow = HTMLComponent("tr",acceptButton, "tableRow")
        this.table.append(acceptTableRow)
        acceptButton.addEventListener("click",()=>{
            let newDocData = {}
            let sets = 0
            for (let input in this.inputs) {
                if (/Set \d/.test(input)) {
                    newDocData[`rep${input.replace(/\D/g,"")}`] = parseInt(this.inputs[input].value)
                    sets++
                }
            }
            if (this.sameWeights) {
                for (let set=0; set<sets; set++) { newDocData[`weight${set+1}`] = parseInt(this.inputs["Weight"].value) }
            } else {
                for (let set=0; set<sets; set++) { newDocData[`weight${set+1}`] = parseInt(this.inputs[`Weight ${set+1}`].value) }
            }
            console.log(newDocData,this.data)
            
        })
    
    }

    update(data,exconfigExData) {
        this.table.innerHTML = ""
        this.data = data
        console.log(this.data)
        this.exType = exconfigExData
        if (this.exType == "W") {
            this.sameWeights = checkWeights(this.data)
        } else {
            this.sameWeights = false
        }
        this.longest = getLongestDataObject(this.data)
        console.log(this.exType=="W"&&this.sameWeights,this.exType,this.sameWeights)
        this.setupHeader()
        this.setupRows()
        if (this.data.length>0) { this.setupInput() }
        this.setupAccept()
        console.log(this.Component)
        
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