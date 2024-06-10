import Element from "./element"
import { flattenArray, deepCompare } from "./util"

const Fragment = ({children})=>{
    console.log("fragment",children);
    return children
}

function createElement(type, props, ...children){
    if(Array.isArray(children))
        children = flattenArray(children)
    return new Element(type, props, children)
}

// function cloneElement(element, props){    
//     element.props = props
//     return element
// }

function cloneElement(type, props,children){
    
    if(!children){
        children = props.children
        delete props.children
    }
        
    return new Element(type, props, children)
}

function render(element, container){
    element.render(container)
}

function memo(component){
    function MemoComponent(props){
        let element = Element.renderingComponent.children[0]
        let children = props.children
        delete props.children
        if(!element || !deepCompare(element.props,props)){
            element = createElement(component,props,...children)
            component.memoized = true
        }
        return element
    }

    return MemoComponent
}

export {useRef,useEffect,useState,
        useMemo,useCallback} from "./hooks"
export {createContext,useContext} from "./context"
export {cloneElement,memo,render}
export default {
    createElement,
    
    Fragment
}