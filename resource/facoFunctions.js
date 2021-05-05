const url = "http://localhost:3000"

///////////////////////
// Helper Functions //
//////////////////////

function tableRow(content,css_class,css_id) {
    if (typeof(css_class)=="string" & typeof(css_id)=="string") { var row = $(`<tr class="${css_class} id="${css_id}"></tr>`) }
    else if (css_class==undefined) { var row = $(`<tr id="${css_id}"></tr>`) }
    else if (css_id==undefined) { var row = $(`<tr class="${css_class}"></tr>`)}
    else if (css_class==undefined & css_id==undefined) { var row = $(`<tr></tr>`) }
    row.append(content)
    return row
}
/////////////////////
// Main Functions //
////////////////////

export function setupTable(table,data,configdata,user,category,ex) {
    // creates a new table row for the last 3 entries in exercise data. last 3 rows because i is data.length-3 when forloop starts
    // the confusing mess of symbols in the for loop initialization checks if data.length is greater than 3 and assings i data.length-3
    // if its greater than 3. else i is 0
    // snytax: var=(is this true?) ? if its true do this : else do this
    for (let i=(data.length>3)?data.length-3:0; i<data.length; i++){
        let date = new Date(data[i].date).toDateString()
        // <tr></tr> -> TableRow | <td></td> -> TableData | <th></th> -> TableHeader (bold)
        let new_row_string = `<td>${date}</td>`
        for (let el of configdata[0].exercise[category][ex]) { new_row_string += `<td>${data[i].data[el]}</td>` }
        table.append(tableRow(new_row_string,undefined,data[i]._id))
    }
    let InputButtonDiv = $(`<div class="InputButtonDiv"></div>`)
    let NormalSetButton = $(`<button id="NormalSetButton">Add Normal Set</button>`)
    NormalSetButton.on("click",()=>{
        let inputRowDiv = inputRowNormalSet(table,user,configdata,category,ex)
        InputButtonDiv.before(inputRowDiv)
    })
    InputButtonDiv.append(NormalSetButton)
    $("#TableDiv").append(InputButtonDiv)

    
}

function inputRowNormalSet (table,user,configdata,category,ex) {
    // Creates a Row (input_row) containing number inputs (input type="number") and appends it to the Table
    let today = new Date().toDateString()
    let today_ISO = new Date().toISOString()

    let input_row_string = `<td>${today}</td>`
    let input_types = []
    for (let el of configdata[0].exercise[category][ex]) { 
        input_row_string += `<td><input type="number" min="1" placeholder="${el}" class="NewRowInput" id="${el}Input"></td>` 
        input_types.push(el)
    }
    let input_row = tableRow(input_row_string,"inputRow")
    console.log(input_row)
    
    let confirm_button = $(`<button type="button" id="confirmButton">Confirm</button>`)
    confirm_button.on("click",()=>{
        // this does only happen if the confirm button is clicked! To understand the code u can skip this for now
        let newDocData = {}
        for (let el of input_types) { newDocData[el] = $(`${el}Input`).val() }
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
            if (table.children().length >= 5) {
                //remove first row of table
                table.children().eq(0).remove()
            }
            // set Value of Input fields to none -> Placeholder
            input_row.find("input").each((i,child)=>{
                child.value = ""
            })
            // append new Data to table
            let new_row_string = `<td>${today}</td>`
            for (el of input_types) { new_row_string += `<td>${$(`${el}`).val()}</td>` }
            input_row.before(new_row)
        })
    })
    // append the input row
    let inputRowDiv = $(`<div class="InputRow"></div>`)
    inputRowDiv.append(input_row); inputRowDiv.append(confirm_button)
    return inputRowDiv
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
        let score = data[i].data.weight * data[i].data.rep1 * data[i].data.rep2 * data[i].data.rep3 
        data_array.push({x:i,y:score})
        label_array.push(new Date(data[i].date).toDateString())
    }
    return [data_array,label_array]
}