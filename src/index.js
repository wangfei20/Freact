import Element from "./element"

function createElement(node, props, ...children){
    return new Element(node, props, 
            children.length == 1 && Array.isArray(children[0])   
            ? children[0] : children);
}

function render(element, container){
    element.render(container)
}
function memo(component){
    function MemoComponent(props){
        return createElement(component,props)
    }

    MemoComponent.memoized = true
    return MemoComponent
}

export {useRef,useEffect,useState,
    useContext,useMemo,useCallback} from "./hooks"
export {createContext} from "./context"
export {memo}
export default {
    createElement,
    render
}