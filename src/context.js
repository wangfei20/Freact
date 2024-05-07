const Context = function(initialValue){
    this.value = initialValue
    let _context = this
    this.providers = []

    this.Provider = function({value, children}){
        if(!this.provider){
            this.provider = {
                value:value || initialValue,
                consumers: [],
                setConsumer:function(consumer){
                    if(!this.consumers.includes(consumer)){
                        this.consumers.push(consumer)
                    }
                },
                updateConsumers: function(){
                    //let consumers = _context.providers[this.index].consumers
                    this.consumers.forEach(c => c.triggerUpdate())
                },
                index: _context.providers.length,
                _context
            }
            this.componentParent.childProvider = this
        } else 
            this.provider.value= value
        _context.providers.push({provider:this,consumers:[]})

        return children
    }

    this.Provider.cname = "provider"
}

export const createContext = function(initialValue){

    return new Context(initialValue)
}
