import Element from "./element"

const EVERY_RENDER = 0
const ON_MOUNT = 1
const WITH_DEPENDENCIES = 2

Element.prototype.useRef = function(initial){
    const index = ++this.refIndex
    const refs = this.refs
    if(!refs[index])
        refs[index] = {current:initial}
    
    return refs[index]
}

Element.prototype.useState = function(initial){
    const index = ++this.stateDataIndex
    const stateData = this.stateData
    if(!stateData[index]){
        const newData = [initial,(param)=>{
            let prevData = stateData[index][0]
            
            if(prevData != param){
                stateData[index][0] = typeof param == "function" ? 
                                             param(prevData) : param
                //console.log("new state",stateData[index]);
                this.triggerUpdate(index)
            }
        }]
        stateData[index] = newData
    }
    return stateData[index]
}

Element.prototype.useMemo = function(callback, dependencies){

    const index = ++this.memoIndex
    const memo = this.memo

    let shouldCache = false

    if(memo[index]){
        if(dependencies){
            for (let i = 0; i < dependencies.length; i++) {
                const oldValue = memo[index].dependencies[i];
                if(!Object.is(dependencies[i],oldValue)){
                    shouldCache=true
                    break
                }
                
            }
        }
        //     memo[index].dependencies.forEach((d,i)=> {
        //         if(!Object.is(dependencies[i],d)){
        //             return callback()
        //         }
        //     })
    } else shouldCache=true
    
    if(shouldCache) {
        let memorizedValue = callback()
        memo[index] = {
            callback,
            memorizedValue,
            dependencies
        }
    }
    
    return memo[index].memorizedValue
        
}  

Element.prototype.useCallback = function(cachedCallback, dependencies){

    const index = ++this.callbackIndex
    const callbacks = this.callbacks
    
    let shouldCache = false

    //When the dependencies array is empty, useCallback only use cached value
    if(callbacks[index]){
        if(dependencies){
            // callbacks[index].dependencies.forEach((d,i)=> {
            //     if(!Object.is(dependencies[i],d)){
                    
            //     }
            // })
            for (let i = 0; i < dependencies.length; i++) {
                const oldValue = callbacks[index].dependencies[i];
                if(!Object.is(dependencies[i],oldValue)){
                    shouldCache=true
                    break
                }
                
            }
        }
    } else shouldCache = true //first render
    
    if(shouldCache)
        callbacks[index] = {
            cachedCallback,
            dependencies
        }
    //always return the cached
    return callbacks[index].cachedCallback   
}  

Element.prototype.useEffect = function(callback, dependencies){

    const index = ++this.effectIndex
    const effects = this.effects

    if(dependencies && !Array.isArray(dependencies))
        console.error("Only a Dependency Array is accepted") 

    let mode = dependencies ? dependencies.length > 0 ? WITH_DEPENDENCIES : ON_MOUNT : EVERY_RENDER
    let runCallback = mode == EVERY_RENDER;

    if(effects[index]){
        if(mode == WITH_DEPENDENCIES){

            if(dependencies.length !== effects[index].dependencies.length)
                throw "Array length should not change"

            effects[index].dependencies.forEach((d,i)=> {
                if(dependencies[i] !== d){
                    if(!runCallback)
                        runCallback = true
                }
            })
        }
            
        if(runCallback && callback && effects[index].cleanup)
            effects[index].cleanup()
    } else
        runCallback = true
    
    effects[index] = {
        dependencies,
        mode
    }

    if(runCallback){
        setTimeout(()=>{
            effects[index].cleanup = callback()
        },0)
        
    }
        
}   

Element.prototype.useContext = function(context){
    
    let value

    if(context.providers.length > 0 ){
        const provider = findProvider(this.parentElement,context)
        provider.setConsumer(this)
        value = provider.value
    } else value = context.value

    const index = ++this.contextIndex
    const contextData = this.contextData
    contextData[index] = value

    return value
}


function findProvider(element, context){
    if(element.provider && Object.is(element.provider._context,context)){
        return element.provider
    } else if(element.parentElement) 
        return findProvider(element.parentElement,context)
}

export const useRef = function(initial){

    return Element.renderingComponent.useRef(initial)
}

export const useState = function(initial){

    // let caller = arguments.callee.caller.caller
    // if(!caller.instance && !(caller = caller.caller).instance)
    //     throw "Incorrect usage of useState. Should only be called inside top level of Components or Hooks"

    // return caller.instance.useState(initial)
    return Element.renderingComponent.useState(initial)
}

export const useEffect = function(callback, dependencies){
    Element.renderingComponent.useEffect(callback, dependencies)
}


export const useContext = function(context){
    return Element.renderingComponent.useContext(context)
}


export const useCallback = function(callback,dependencies){
    return Element.renderingComponent.useCallback(callback,dependencies)
}

export const useMemo = function(callback,dependencies){
    // let caller = arguments.callee.caller.caller
    // if(!caller.instance && !(caller = caller.caller).instance)
    //     throw "Incorrect usage of useMemo. Should only be called inside top level of Components or Hooks"

    return Element.renderingComponent.useMemo(callback,dependencies)
}