import { isEvent } from "./util";

const INITIAL = 0;
const WILL_MOUNT = 1;
const MOUNTED = 2;
const WILL_UPDATE = 3;
const UPDATED = 4;

const EVERY_RENDER = 0
const ON_MOUNT = 1
const WITH_DEPENDENCIES = 2

const INVALID_NODE = -1
const DOM_ELEMENT = 0
const FUNCTION_COMPONENT = 1
const CLASS_COMPONENT = 2

export class ClassComponent{
    constructor(props){

    }
    
}

export const Element = function(element, props, children){
        
    this._type = typeof element === "string" ? DOM_ELEMENT: 
                typeof element === "function" ? FUNCTION_COMPONENT : INVALID_NODE
        
    this.type = element;    
    this.props = props || {};

    this.children = children.filter(c=> c != null) 
    // Logical Children of Elements
    // HTML element, logical children would all be its visual children
    // all but string literals (TextNode) would be its Vnode Element
    // if it's function component, only one child, Vnode Element returned by the function component

    this.functionComponent = this._type === FUNCTION_COMPONENT && element;
    this.name = this._type === DOM_ELEMENT ? element : this.functionComponent.cname;        
    
    this.node = 
    this.vchild = 
    this.parentDom = null;

    this.status = INITIAL
    this.stateData = []
    this.stateDataIndex = -1
    this.effects = []
    this.effectIndex = -1
    this.refs = []
    this.refIndex = -1

    //this.sideEffectsToRun = [] should build a side effect queue

    this.shouldRerender = false;

    this.createVirtualDomTree = function createVirtualDomTree(){
        
        const mount = this.vchild == null 
        this.status = mount ? WILL_MOUNT : WILL_UPDATE

        let vchild = this.functionComponent({
            ...this.props,
            "children": this.children.length == 1 ? this.children[0] : this.children
        });

        
        this.status = mount ? MOUNTED : UPDATED

        this.stateDataIndex = -1
        this.effectIndex = -1
        this.refIndex = -1

        return vchild
    }

    this.createVirtualDomTree.instance = this;
}

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

Element.prototype.triggerUpdate = function(){

    if(!this.shouldRerender)
        this.shouldRerender = true

    setTimeout(()=>{
        if(this.shouldRerender){
            this.shouldRerender = false

            let newVChild = this.createVirtualDomTree(); 
            this.children[0].update(newVChild, this)
        }
    },0)

}

Element.prototype.unMount = function(){
    
    for (let i = 0; i < this.children.length; i++) {
        //Unmount if it's not a text node
        if(this.children[i] instanceof Element)
            this.children[i].unMount()
    }
    for (let i = 0; i < this.effects.length; i++) {
        this.effects[i].cleanup && this.effects[i].cleanup();
    }
}

Element.prototype.render = function render(parentDom, prevElement){
    //HTML Element: create self (dom node) and attach to parent Dom, 
    // more than one (Element) children
    
    //Component Element: run component function, create a sub tree of Elements, 
    // only one Child, the top level Element the function returns

    if(parentDom)
        this.parentDom = parentDom

    let node 

    if(this._type == DOM_ELEMENT){

        // Create a new tree, unmount old tree

        node = this.node = document.createElement(this.type)

        for (const key in this.props) {
            if (Object.hasOwnProperty.call(this.props, key)) {
                if(isEvent(key)){
                    node[key] = this.props[key]
                } else if(key == "ref")
                    this.props[key].current = node
                else
                    node.setAttribute(key,this.props[key])
            }
        }

        this.children.forEach((child,index)=>{
           
            if (child instanceof Element){
                child.render(node)
            } else {
                node.appendChild(document.createTextNode(child))                
            }             

        })
        
        try {
            if(prevElement){
                let prevNode = prevElement instanceof Element ? 
                               prevElement.node : prevElement
                if(parentDom.contains(prevNode)){
                    if(prevElement.unMount)
                        prevElement.unMount()
                    parentDom.replaceChild(node,prevNode)
                }
            } else
                parentDom.appendChild(node) 
        } catch (error) {
            console.log(error);
            console.log(prevElement,parentDom,this);
        }

        return node
    } else {
    
        let vchild = this.vchild
        
        //create the virtual dom tree if not already existing
        if(!vchild) 
            this.children[0] = 
            this.vchild = 
            vchild = this.createVirtualDomTree()

        //populate/update the actual dom tree
        node = this.node = vchild.render(this.parentDom,prevElement)

        return vchild
    }
}

Element.prototype.update = function update(newVNode, parentVNode){
    //HTML Element: create self (dom node) and attach to parent Dom, 
    // more than one (Element) children
    
    //Component Element: run component function, create a sub tree of Elements, 
    // only one Child, the top level Element the function returns
    
    if(this.type === newVNode.type) {

        let isComponent = this._type == FUNCTION_COMPONENT
        let node = isComponent ? parentVNode.node : this.node;
    
        const newProps = newVNode.props
        const prevProps = this.props
        const newKeys = Object.keys(newProps)
        const prevKeys = Object.keys(prevProps)

        //Update Props
        if(newKeys){
            for (let key of newKeys) {
                if(newProps[key] !== prevProps[key]){
                    
                    prevProps[key] = newProps[key]

                    // Change Dom attributes
                    if(!isComponent){
                        if(isEvent(key)){
                            node[key] = newProps[key]
                        } else if(key == "ref")
                            prevProps[key].current = node
                        else
                            node.setAttribute(key,newProps[key])
                    }

                }
            }
        }
        
        // Delete properties from node that don't exist in newProps
        if(prevKeys){
            for (let key of prevKeys) {
                if (prevProps && !prevProps.hasOwnProperty(key)) {
                    if(!isComponent)
                        node.removeAttribute(key)
                    delete prevProps[key]
                }
            }
        }    

        if(isComponent){
            //console.log("Update Component",this,newVNode)
            newVNode.children[0] = this.createVirtualDomTree()
        }            
        
        // Loop through new children and compare it with previous ones
       
        let len = this.children.length
        let newLen = newVNode.children.length


        // if(this.props.hasOwnProperty("id")){
        //     console.log("disappear")
        // }

        newVNode.children.forEach((newChild,index)=>{
            if(index < len){
                let child = this.children[index]
                

                if(typeof newChild === typeof child){
                    //they're of the same type
                    //so only update is needed
                    if (newChild instanceof Element)
                        child.update(newChild,this)
                    else if (newChild != child) { 
                        // new newChild is a text node                        
                        this.children[index] = node.childNodes[index].nodeValue = newChild                
                    }
                } else {
                    //newChild replaces old child
                    if(typeof newChild instanceof Element)
                    {
                        //typeof child === "string"
                        newChild.render(node, node.childNodes[index])
                       
                    } else {
                        
                        let textNode = document.createTextNode(newChild) 
                        child.unMount()                
                        node.replaceChild(textNode,node.childNodes[index])
                    
                    }
                    this.children.splice(index,1,newChild)  
                    
                }
                            
            } else {
                //add additional children
                // if(typeof newChild === "string"){
                //     node.appendChild(document.createTextNode(newChild))                    
                // } else if (newChild instanceof Element){
                //     newChild.render(this.node)
                // }
                if(newChild instanceof Element){
                    newChild.render(this.node)              
                } else {
                    node.appendChild(document.createTextNode(newChild))
                    
                }
                
                this.children.push(newChild)                    
            }
        })

        //Unmount additional children from previous render
        if(len > newLen){
            for (let i = newLen; i < len; i++) {
                let toDelete = this.children[i]
                if(toDelete instanceof Element)
                    toDelete.unMount()

                //uproot the node
                node.removeChild(node.childNodes[i])
            }
            //console.log("trim children",this.children);
            this.children.splice(newLen, len - newLen)
            //console.log(this.children);
        }

        
    } else {
        //render the new Element, take down old tree and build new one
        const i = parentVNode.children.indexOf(this)
        newVNode.render(parentVNode.node, this)
        parentVNode.children.splice(i,1,newVNode)
    }
}
