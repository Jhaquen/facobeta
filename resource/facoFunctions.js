const url = "http://localhost:3000"

///////////////////////
// Helper Functions //
//////////////////////

function tableRow(content,css_class,css_id) {
    if (typeof(css_class)=="string" & typeof(css_id)=="string") { var row = $(`<tr class="${css_class}" id="${css_id}"></tr>`) }
    else if (css_class==undefined & css_id==undefined) { var row = $(`<tr></tr>`) }
    else if (css_class==undefined) { var row = $(`<tr id="${css_id}"></tr>`) }
    else if (css_id==undefined) { var row = $(`<tr class="${css_class}"></tr>`)}
    switch (typeof(content)) {
        case "string": row.append(content); break;
        case "number": row.append(content); break;
        case "object": for (let cont of content) { row.append(cont) }; break;
    }
    return row
}

function tableData(content,css_class,css_id) {
    if (typeof(css_class)=="string" & typeof(css_id)=="string") { var data = $(`<td class="${css_class}" id="${css_id}"</td>`) }
    else if (css_class==undefined & css_id==undefined) { var data = $(`<td></td>`) }
    else if (css_class==undefined) { var data = $(`<td id="${css_id}"</td>`) }
    else if (css_id==undefined) { var data = $(`<td class="${css_class}"</td>>`)}
    switch (typeof(content)) {
        case "string": data.append(content); break;
        case "number": data.append(content); break;
        case "object": for (let cont of content) { data.append(cont) }; break;
    }
    return data
}

function tableHeader(content,css_class,css_id) {
    if (typeof(css_class)=="string" & typeof(css_id)=="string") { var data = $(`<th class="${css_class}" id="${css_id}"></th>`) }
    else if (css_class==undefined & css_id==undefined) { var data = $(`<th></th>`) }
    else if (css_class==undefined) { var data = $(`<th id="${css_id}"></th>`) }
    else if (css_id==undefined) { var data = $(`<th class="${css_class}"></th>`)}
    switch (typeof(content)) {
        case "string": data.append(content); break;
        case "number": data.append(content); break;
        case "object": for (let cont of content) { data.append(cont) }; break;
    }
    return data
}

function checkWeights(data) {
    let wheigts = []
    for (let el in data) {
        if (el.match(/weight\d/)) { wheigts.push(data[el]) }
    }
    if (wheigts.every((el)=>{ return el == wheigts[0] })) { return true } else { return false }

}
/////////////////////
// Main Functions //
////////////////////

export function setupTable(table,data,configdata,user,category,ex) {
    // creates a new table row for the last 3 entries in exercise data. last 3 rows because i is data.length-3 when forloop starts
    // the confusing mess of symbols in the for loop initialization checks if data.length is greater than 3 and assings i data.length-3
    // if its greater than 3. else i is 0
    // snytax: var=(is this true?) ? if its true do this : else do this
    table.append(tableRow([
        tableHeader("Date"),
        tableHeader("Weight"),
        tableHeader("Set 1"),
        tableHeader("Set 2"),
        tableHeader("Set 3")
    ]))
    for (let i=(data.length>4)?data.length-4:0; i<data.length; i++){
        let date = new Date(data[i].date).toDateString()
        // <tr></tr> -> TableRow | <td></td> -> TableData | <th></th> -> TableHeader (bold)
        // check if the current date (data[i].data) contains a dropset or a normal set
        // appends either a normalset (if == true) or a dropset (else)
        if (checkWeights(data[i].data)) {
            let newRow = tableRow([
                tableData(date),
                tableData(data[i].data.weight1)
            ])
            for (let el of configdata[0].exercise[category][ex]) {
                if (el.match(/rep\d/)) { newRow.append(tableData(data[i].data[el])) }
            }
            table.append(newRow)
        } else {
            let newRow = tableRow([
                tableData(date),
                tableData("-")
            ])
            for (let j=0; j<configdata[0].exercise[category][ex].length-1; j+=2) {
                // this shit gets the i-th key of data[i].data and then retrieves the correspondig value
                newRow.append(tableData(`${data[i].data[Object.keys(data[i].data)[j]]} x ${data[i].data[Object.keys(data[i].data)[j+1]]}`))
            }
            table.append(newRow)
        }
    }
    let InputButtonDiv = $(`<div class="InputButtonDiv"></div>`)
    let NormalSetButton = $(`<button id="NormalSetButton">Normal Set</button>`)
    NormalSetButton.on("click",()=>{
        let {inputRow,confirmButton} = inputRowNormalSet(table,user,configdata,category,ex)
        table.append(inputRow)
        InputButtonDiv.before(confirmButton)
        InputButtonDiv.hide()
    })
    let DropSetButton = $(`<button id="DropSetButton">Drop Set</button>`)
    DropSetButton.on("click",()=>{
        inputRowDropSet()
    })
    InputButtonDiv.append(NormalSetButton); InputButtonDiv.append(DropSetButton)
    $("#TableDiv").append(InputButtonDiv)

    
}

function inputRowNormalSet (table,user,configdata,category,ex) {
    // Creates a Row (input_row) containing number inputs (input type="number") and appends it to the Table
    let today = new Date().toDateString()
    let today_ISO = new Date().toISOString()

    let input_row = tableRow([
        tableData(today),
        tableData(`<input type="number" min="1" placeholder="weight" class="NewRowInput" id="weightInput">`)
    ],"inputRow")
    // input_types is an array of all input field ids (kind of). counts how many sets (rep1,2,...) the exercise has
    // possibility to add more sets later?
    let input_types = ["weight"]
    for (let el of configdata[0].exercise[category][ex]) {
        if (el.match(/rep\d/)) {
            input_row.append(tableData(`<input type="number" min="1" placeholder="${el}" class="NewRowInput" id="${el}Input">`))
            input_types.push(el)
        } 
    }
    
    let confirm_button = $(`<button type="button" id="confirmButton">Confirm</button>`)
    confirm_button.on("click",()=>{
        // this does only happen if the confirm button is clicked! To understand the code u can skip this for now
        let newDocData = {}
        let sets = 0
        for (let el of input_types) {
            if (el.match(/rep\d/)) { 
                newDocData[el] = $(`#${el}Input`).val()
                sets ++ //counts n of sets
            } 
        }
        // appends value of wheight input as many times as there are sets (rep inputs)
        for (let set=0; set<sets; set++) { newDocData[`weight${set}`] = $(`#weightInput`).val() }
        console.log(newDocData)
        let newDoc = {  
            user:user,
            date:today_ISO,
            exercise:ex,
            data:newDocData
        }
        // this gets send to our api! look in staticRouter get("/saveExerciseData") for endpoint
        fetch(url+"/saveExerciseData",{
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify(newDoc) // here it gets send. 
        }).then(()=>{
            if (table.children().length > 5) {
                //remove first row of table if row longer than header + 4 rows + inputrow
                // eq(0) is header! so its acutally the second element thats removed
                table.children().eq(1).remove()
            }
            // append new Data to table
            let new_row = tableRow([
                tableData(today),
                tableData(newDocData.weight1)
            ],"NormalSetTableRow",`newData${today_ISO}`)
            for (let el of input_types) { 
                if (el.match(/rep\d/)) { new_row.append(tableData(newDocData[el])) }
             }
            table.append(new_row); input_row.remove(); confirm_button.remove(); $(".InputButtonDiv").show() 
        })
    })
    // append the input row
    return {inputRow:input_row, confirmButton:confirm_button}
}

function inputRowDropSet() {
    console.log("nothing to see here")
}

export function setupChart (chartContainer,data) {
    let chartData = setupChartData(data)
    new Chart(chartContainer, {
        type: "line",
        data: {
            labels: chartData[1],
            datasets: [{
                label: "Faço Score",
                data: chartData[0],
                tension: 0.1
            }]
        }
    })
}

function setupChartData(data) {
    let data_array = []
    let label_array = []
    for (let i=0; i<data.length; i++) {
        let score = data[i].data.weight1 * data[i].data.rep1 * data[i].data.rep2 * data[i].data.rep3 
        data_array.push({x:i,y:score})
        label_array.push(new Date(data[i].date).toDateString())
    }
    return [data_array,label_array]
}