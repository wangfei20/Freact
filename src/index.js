import { Element } from "./element"

function createElement(node, props, ...children){
    return new Element(node, props, children);
}

function render(element, container){
    element.render(container)
}
export {useRef,useEffect,useState} from "./hooks"

export default {
    createElement,
    render
}