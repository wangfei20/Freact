import { useEffect } from "./hooks"
import Element from "./element"

function findProvider(element, context){
    if(element.provider && Object.is(element.provider._context,context)){
        return element.provider
    } else if(element.parentElement) 
        return findProvider(element.parentElement,context)
}

const Context = function(initialValue){
    this.value = initialValue
    let _context = this
    this.providers = []

    this.Provider = function({value, children}){
        useEffect(()=>{
            return ()=>{
                const i = _context.providers.findIndex(p=>p==this.provider)
                _context.providers.splice(i,1)
            }
        },[])
        if(!this.provider){
            this.provider = {
                value:value || initialValue,
                _context
            }
            // consumers: [],
            //     setConsumer:function(consumer){
            //         if(!this.consumers.includes(consumer)){
            //             this.consumers.push(consumer)
            //         }
            //     },
            //     updateConsumers: function(){
            //         //let consumers = _context.providers[this.index].consumers
            //         this.consumers.forEach(c => c.triggerUpdate())
            //     },
            //     index: _context.providers.length,
            _context.providers.push({provider:this,consumers:[]})
            //this.componentParent.childProvider = this
        } else 
            this.provider.value= value

        return children
    }

    this.Provider.cname = "provider"
}

export const createContext = function(initialValue){

    return new Context(initialValue)
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