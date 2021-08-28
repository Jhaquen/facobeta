import { HTMLComponent, SetAttributes } from "./mainFunctions.js"

export class Timer {

    constructor(timelimit) {

        this.timelimit = timelimit
        this.svgWrapper = document.createElementNS("http://www.w3.org/2000/svg","svg")
        this.progressBarWrapper = document.createElementNS("http://www.w3.org/2000/svg","g")
        this.progressBarElapsed = document.createElementNS("http://www.w3.org/2000/svg","circle")
        this.progressBarRemaining = document.createElementNS("http://www.w3.org/2000/svg","path")
        this.progressBarWrapper.append(this.progressBarElapsed)
        this.progressBarWrapper.append(this.progressBarRemaining)
        this.svgWrapper.append(this.progressBarWrapper)
        
        SetAttributes(this.progressBarElapsed,{
            "cx":50,"cy":50,"r":45,
            "id":"TimerPathElapsed"
        })
        SetAttributes(this.progressBarRemaining,{
            "d":"M 50, 50 m -45, 0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0",
            "stroke-dasharray":283,
            "id":"TimerPathRemaining"
        })
        SetAttributes(this.progressBarWrapper,{"id":"TimerCircle"})
        SetAttributes(this.svgWrapper,{
            "viewBox":"0 0 100 100",
            "id":"TimerSvg"
        })
        this.time = HTMLComponent("span",this.formatTime(this.timelimit),"timer","TimerTime")
        this.div = HTMLComponent("div",[this.svgWrapper,this.time],"timer","TimerDiv")

        this.timerInterval = undefined

    }

    startTimer() {
        clearInterval(this.timerInterval)
        let timePassed = 0
        let timeLeft = timeLimit
    
        /**
        das hat noch nicht funktioniert
        const color_code = {
            info: {
                color: "green"
            }
        }
        $("#TimerPathRemaining").  color_code.info.color
        */
        
        // take (), do {} every 1000ms = 1 second
        this.timerInterval = setInterval(() => {
            timePassed += 1
            timeLeft = timeLimit-timePassed
            if (timeLeft>0) {
                this.time.html(`${formatTimer(timeLeft)}`)
            } else {
                this.time.css("color","red")
                this.time.html(`${formatTimer(timeLeft)}`)
                clearInterval(this.timerInterval)
            }
        }, 1000)
    } 

    formatTime(time) {
        const minutes = Math.floor(time/60)
        let seconds = time%60
        if (seconds < 10) {seconds = `0${seconds}`}
        return `${minutes}:${seconds}`
    }

    get Component() {
        return this.div
    }
}