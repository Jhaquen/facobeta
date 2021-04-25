const url = "http://localhost:3000"

function DisplayWindowSetup(data,user,ex) {
    
    let table = $("#ExerciseTable")

    for (let i=0; i<data.length; i++){
        let date = new Date(data[i].date).toDateString()
        let new_row = $(`<tr id="${data[i]._id}"></tr>`).html(`<td>${date}</td>
                                                        <td>${data[i].data.weight}</td>
                                                        <td>${data[i].data.rep1}</td>
                                                        <td>${data[i].data.rep2}</td>
                                                        <td>${data[i].data.rep3}</td>                                                
        `)
        table.append(new_row)
    }
    let today = new Date().toDateString()
    let today_ISO = new Date().toISOString()
    let input_row = $(`<tr id="inputRow"></tr`).html(`<td>${today}</td>
                                                <td><input type="number" min="1" placeholder="Weight" id="weightInput"></td>
                                                <td><input type="number" min="1" placeholder="Set 1" id="rep1Input"></td>
                                                <td><input type="number" min="1" placeholder="Set 2" id="rep2Input"></td>
                                                <td><input type="number" min="1" placeholder="Set 3" id="rep3Input"></td>`)
    let confirm_button = $(`<button type="button" id="confirmButton">Confirm</button>`)
    confirm_button.on("click",()=>{
        let weight = $("#weightInput").val()
        let rep1 = $("#rep1Input").val(); let rep2 = $("#rep2Input").val(); let rep3 = $("#rep3Input").val()
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
            body:JSON.stringify(newDoc)
        }).then(()=>{
            table.children().eq(0).remove()
            let new_row = $(`<tr id="newRow${today_ISO}"></tr>`).html(`<td>${today}</td>
                                                                <td>${weight}</td>
                                                                <td>${rep1}</td>
                                                                <td>${rep2}</td>
                                                                <td>${rep3}</td>`)
            input_row.before(new_row)
        })
    })
    table.append(input_row); table.append(confirm_button)

    let chartObject = document.getElementById("DataChart").getContext("2d")
    let chart = new Chart(chartObject, {
        type: "line",
        data: {
            labels: ["test1","test2","test3","test4"],
            datasets: [{
                label: "TestData",
                data: [123,42,45,123,46],
                tension: 0.1
            }]
        }
    })
}

$(document).ready(()=>{

    $("#mainpage").hide()
    
    $("#LogInButton").on("click", ()=>{
        
        let user = $("#username").val()
        $("#WelcomeMessage").text("Hey "+user)
        fetch(url+"/getUserExercises", {
            method:"POST",
            headers:{"Content-type":"application/json"},
            body:JSON.stringify({
                user:user
            })
        }).then(response => response.json()).then(data => {
            
            for (let ex in data[0].exercise) {
                let exerciseLink = $(`<p id="${ex}_link"></p>`).text(ex)
                exerciseLink.data("ex",ex)
                exerciseLink.on("click",()=>{
                    fetch(url+"/getExerciseData", {
                        method:"POST",
                        headers:{"Content-type":"application/json"},
                        body:JSON.stringify({
                            user:user,
                            exercise:ex
                        })
                    }).then(response => response.json()).then(data => { DisplayWindowSetup(data,user,ex) })
                })
                $("#ExerciseDiv").append(exerciseLink) 
            }
        })
        $("#LoginDiv").fadeOut(400)
        $("#mainpage").fadeIn(200)
    })
})