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