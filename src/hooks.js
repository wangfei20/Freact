
export const useRef = function(initial){

    let caller = arguments.callee.caller.caller
    if(!caller.instance && !(caller = caller.caller).instance)
        throw "Incorrect usage of useRef. Should only be called inside top level of Components or Hooks"

    return caller.instance.useRef(initial)
}

export const useState = function(initial){

    let caller = arguments.callee.caller.caller
    if(!caller.instance && !(caller = caller.caller).instance)
        throw "Incorrect usage of useState. Should only be called inside top level of Components or Hooks"

    return caller.instance.useState(initial)
}

export const useEffect = function(callback, dependencies){
    
    let caller = arguments.callee.caller.caller
    if(!caller.instance && !(caller = caller.caller).instance)
        throw "Incorrect usage of useEffect. Should only be called inside top level of Components or Hooks"

    return caller.instance.useEffect(callback, dependencies)
}