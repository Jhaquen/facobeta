const url = "http://localhost:3000"

export function setupTable(table,data,configdata,user,category,ex) {
    // creates a new table row for the last 3 entries in exercise data. last 3 rows because i is data.length-3 when forloop starts
    // the confusing mess of symbols in the for loop initialization checks if data.length is greater than 3 and assings i data.length-3
    // if its greater than 3. else i is 0
    // snytax: var=(is this true?) ? if its true do this : else do this
    for (let i=(data.length>3)?data.length-3:0; i<data.length; i++){
        let date = new Date(data[i].date).toDateString()
        // <tr></tr> -> TableRow | <td></td> -> TableData | <th></th> -> TableHeader (bold)
        let new_row_string = `<td>${date}</td>`
        for (el of configdata.exercise[category][ex]) { new_row_string += `<td>${data[i].data[el]}</td>` }
        let new_row = $(`<tr id="${data[i]._id}"></tr>`).html(new_row_string)
        table.append(new_row)
    }
    inputRow(table,user,configdata,ex)
}

function inputRow (table,user,ex) {
    // Creates a Row (input_row) containing number inputs (input type="number") and appends it to the Table
    let today = new Date().toDateString()
    let today_ISO = new Date().toISOString()

    let input_row_string = `<td>${date}</td>`
    let input_types = []
    for (el of configdata.exercise[category][ex]) { 
        input_row_string += `<td><input type="number" min="1" placeholder="${el}" class="NewRowInput" id="${el}Input"></td>` 
        input_types.push(el)
    }
    let input_row = $(`<tr id="inputRow"></tr`).html(input_row_string)
    
    let confirm_button = $(`<button type="button" id="confirmButton">Confirm</button>`)
    confirm_button.on("click",()=>{
        // this does only happen if the confirm button is clicked! To understand the code u can skip this for now
        let newDocData = {}
        for (el of input_types) { newDocData[el] = $(`${el}Input`).val() }
        let newDoc = {  
            user:user,
            date:today,
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
    table.append(input_row); table.append(confirm_button)
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

/**
export function inputRowWeight (table,user,ex) {
    // Creates a Row (input_row) containing number inputs (input type="number") and appends it to the Table
    let today = new Date().toDateString()
    let today_ISO = new Date().toISOString()
    let input_row = $(`<tr id="inputRow"></tr`).html(`<td>${today}</td>
                                                <td><input type="number" min="1" placeholder="Weight" class="NewRowInput" id="weightInput"></td>
                                                <td><input type="number" min="1" placeholder="Set 1" class="NewRowInput" id="rep1Input"></td>
                                                <td><input type="number" min="1" placeholder="Set 2" class="NewRowInput" id="rep2Input"></td>
                                                <td><input type="number" min="1" placeholder="Set 3" class="NewRowInput" id="rep3Input"></td>`)
    let confirm_button = $(`<button type="button" id="confirmButton">Confirm</button>`)
    confirm_button.on("click",()=>{
        // this does only happen if the confirm button is clicked! To understand the code u can skip this for now
        let weight = $("#weightInput").val()
        let rep1 = $("#rep1Input").val(); let rep2 = $("#rep2Input").val(); let rep3 = $("#rep3Input").val()
        // this gets send to our api! look in staticRouter get("/saveExerciseData") for endpoint
        let newDoc = {  
            user:user,
            date:today,
            exercise:ex,
            data: {
                weight:weight,
                rep1:rep1,
                rep2:rep2,
                rep3:rep3
            }
        }
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
            let new_row = $(`<tr id="newRow${today_ISO}"></tr>`).html(`<td>${today}</td>
                                                                <td>${weight}</td>
                                                                <td>${rep1}</td>
                                                                <td>${rep2}</td>
                                                                <td>${rep3}</td>`)
            input_row.before(new_row)
        })
    })
    // append the input row
    table.append(input_row); table.append(confirm_button)
}
*/

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