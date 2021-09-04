import { SetAttributes } from "./mainFunctions.js"

export class SVG {

    static createSVGWrapper(width, height, viewbox) {
        let svgWrapper = document.createElementNS("http://www.w3.org/2000/svg","svg")
        SetAttributes(svgWrapper,{width:width,height:height,viewbox:viewbox})
        return svgWrapper
    }

    static createPath(attrs) {
        let path = document.createElementNS("http://www.w3.org/2000/svg","path")
        SetAttributes(path,attrs)
        return path
    }

    static Plus(scale) {
        let svgWrapper = this.createSVGWrapper("24","24","0 0 24 24")
        let path1 = this.createPath({
            "d":"M12 22V2",
            "stroke":"black",
            "stroke-width":4,
            "stroke-linecap":"round"
        })
        let path2 = this.createPath({
            "d":"M2 12L22 12",
            "stroke":"black",
            "stroke-width":4,
            "stroke-linecap":"round"
        })
        svgWrapper.append(path1)
        svgWrapper.append(path2)
        svgWrapper.style.transform = `scale(${scale})`
        return svgWrapper
    }
}