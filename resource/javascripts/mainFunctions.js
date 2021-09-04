export function HTMLComponent(type,content,css_class,css_id,attrs) {   
    // create HTML Element
    let object = document.createElement(type)
    // set attributes
    let props = {"class":css_class, "id":css_id}
    for (let prop in props) {
        if (props[prop]!=undefined) {
            object.setAttribute(prop,props[prop])
        }
    }
    if (attrs!=undefined) { SetAttributes(object,attrs) }
    // set content
    if (content!=undefined || content=="") {
        if (type=="p" || /h\d/.test(type) || type=="button") {
            if (typeof(content)!="object") { object.innerHTML = content }
            else { object.append(content) }
        } else {
            switch (typeof(content)) {
                case "string": case "number": 
                    object.append(content)
                    break
                case "object": 
                    if (Array.isArray(content)) {
                        for (let c of content) { object.append(c) }
                    } else {
                        object.append(content)
                    }
                    break
            }
        }
    }
    return object
}

export function SetAttributes(el,attrs) {
    for (let attr in attrs) {
        el.setAttribute(attr,attrs[attr])
    }
}