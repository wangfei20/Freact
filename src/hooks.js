import Element from "./element"

const EVERY_RENDER = 0
const ON_MOUNT = 1
const WITH_DEPENDENCIES = 2

function findProvider(element, context){
    if(element.provider && Object.is(element.provider._context,context)){
        return element.provider
    } else if(element.parentElement) 
        return findProvider(element.parentElement,context)
}

export const useRef = function(initial){
    return useState({current:initial})[0]
    //return Element.renderingComponent.useRef(initial)
}

export const useState = function(initial){
    const component = Element.renderingComponent
    const index = ++component.stateDataIndex
    const stateData = component.stateData
    if(!stateData[index]){
        const newData = [initial,(param)=>{
            let prevData = stateData[index][0]
            
            if(prevData != param){
                stateData[index][0] = typeof param == "function" ? 
                                             param(prevData) : param
                //console.log("new state",stateData[index]);
                component.triggerUpdate(index)
            }
        }]
        stateData[index] = newData
    }
    return stateData[index]
}

export const useEffect = function(callback, dependencies){
    const component = Element.renderingComponent

    const index = ++component.effectIndex
    const effects = component.effects

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

    //Element.renderingComponent.useEffect(callback, dependencies)
}

export const useContext = function(context){
    const component = Element.renderingComponent
    let value

    if(context.providers.length > 0 ){
        const provider = findProvider(component.parentElement,context)
        //provider.setConsumer(component)
        value = provider.value
    } else value = context.value

    const index = ++component.contextIndex
    const contextData = component.contextData
    contextData[index] = value

    return value
}

function _useMemo(callback,dependencies, runCallback){
    const component = Element.renderingComponent
    const index = ++component.memoIndex
    const memo = component.memos

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
    } else shouldCache=true
    
    if(shouldCache) {
        memo[index] = {
            callback,
            dependencies
        }
        if(runCallback){
            let memorizedValue = callback()
            memo[index].memorizedValue = memorizedValue
        }
    }
    
    return runCallback ? memo[index].memorizedValue : memo[index].callback
}

export const useCallback = function(callback,dependencies){
    return _useMemo(callback,dependencies)
}

export const useMemo = function(callback,dependencies){
    return _useMemo(callback,dependencies,true)
}