import element from "./52/element";
import { isEvent } from "./util";

const INITIAL = 0;
const WILL_MOUNT = 1;
const MOUNTED = 2;
const WILL_UPDATE = 3;
const UPDATED = 4;
const INVALID_NODE = -1
const DOM_ELEMENT = 0
const FUNCTION_COMPONENT = 1
const CLASS_COMPONENT = 2

export class ClassComponent{
    constructor(props){

    }
    
}

export default Element = function(element, props, children){
        
    this._type = typeof element === "string" ? DOM_ELEMENT: 
                typeof element === "function" ? FUNCTION_COMPONENT : INVALID_NODE
        
    this.type = element;    
    this.props = props || {};

    // Logical Children of Elements
    // HTML element, logical children would all be its visual children
    // all but string literals (TextNode) would be its Virtual Dom Element
    
    this.componentParent = Element.renderingComponent
    this.logicalChildren = children.filter(c=> c != null) 
    this.component = this._type === FUNCTION_COMPONENT && element;
    this.children = this._type === DOM_ELEMENT ? Array.from(this.logicalChildren) : []
    this.name = this._type === DOM_ELEMENT ? element : this.component.cname;        
    
    this.node = 
    this.childNode = 
    this.parentElement =
    this.parentDom = null;
    this.index = -1;

    this.status = INITIAL
    this.stateData = []
    this.stateDataIndex = -1
    this.effects = []
    this.effectIndex = -1
    this.refs = []
    this.refIndex = -1
    this.contextData = []
    this.contextIndex = -1
    this.memo = []
    this.memoIndex = -1
    this.callbacks = []
    this.callbackIndex = -1

    //this.sideEffectsToRun = [] should build a side effect queue

    this.shouldRerender = false;

    this.createVirtualDomTree = function createVirtualDomTree(props,children){
        
        const mount = this.status === INITIAL
        this.status = mount ? WILL_MOUNT : WILL_UPDATE

        // should deep copy children

        // let children = Array.from(this.logicalChildren.length == 1 && Array.isArray(this.logicalChildren[0]) 
        //                             ? this.logicalChildren[0] : this.logicalChildren);
        children = Array.from(children.length == 1 && Array.isArray(children[0]) 
                                     ? children[0] : children);
        Element.renderingComponent = this;

        let vchild = this.component({
            ...props,
            children
        });

        Element.renderingComponent = null
        
        this.status = mount ? MOUNTED : UPDATED

        this.stateDataIndex = -1
        this.effectIndex = -1
        this.refIndex = -1
        this.contextIndex = -1
        this.memoIndex = -1
        this.callbackIndex = -1

        return Array.isArray(vchild) ? vchild[0] : vchild
    }

    this.getNode = function(){
        return this.node || this.parentDom
    }

    this.createVirtualDomTree.instance = this;
}

Element.renderingComponent = null

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

Element.prototype.triggerUpdate = function(){

    if(!this.shouldRerender)
        this.shouldRerender = true
    let self = this
    setTimeout(()=>{
        if(self.shouldRerender){
            self.shouldRerender = false

            let newVChild = self.createVirtualDomTree(self.props,self.logicalChildren);        
            self.children[0].update(newVChild, self)

            // if(self.component && self.childProvider){
            //     console.log("update consumer",self);
            //     self.childProvider.provider.updateConsumers()
            // }
        }
    },0)

}

Element.prototype.render = function render(parentDom){
    this._render(0,parentDom)
}
Element.prototype._render = function _render(index, parentDom, parentElement, prevElement){
    //HTML Element: create self (dom node) and attach to parent Dom, 
    // more than one (Element) children
    
    //Component Element: run component function, create a sub tree of Elements, 
    // only one Child, the top level Element the function returns
    this.index = index
    this.parentElement = parentElement
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
                child._render(index,node,this)
            } else {
                node.appendChild(document.createTextNode(child))                
            }             

        })
        
        try {
            if(prevElement){
                let prevNode = prevElement instanceof Element ? 
                               prevElement.childNode || prevElement.getNode() : prevElement
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
        node = parentDom
        
        //create the virtual dom tree if not already existing
        if(this.status === INITIAL) {
            this.children[0] = this.createVirtualDomTree(this.props,this.logicalChildren)
            // if(Array.isArray(subtree))
            //     this.children = subtree;
            // else this.children[0] = subtree
        }

        //populate/update the actual dom tree
        try {
            //vchild._render(node,this, prevElement)
            let child = this.children[0]
            if (child instanceof Element){
                this.childNode = child._render(0,node,this,prevElement)
            } else {
                let textNode = document.createTextNode(child)
                node.appendChild(textNode)
                this.childNode = textNode                
            }
          
        } catch (error) {
            console.log(error);
        }

        return this.childNode
    }
}

function isDifferent(oldElement,newElement){
    
    if(typeof oldElement !== typeof oldElement)
        return true
    
    
    if (oldElement instanceof Element){

        if(!newElement instanceof Element || 
            oldElement.type !== newElement.type || 
            newElement.logicalChildren.length != oldElement.logicalChildren.length) 
            return true
         
        const newProps = newElement.props
        const prevProps = oldElement.props
        const newKeys = Object.keys(newProps)
        const prevKeys = Object.keys(prevProps)

        if(newKeys.length != prevKeys.length) return true
        for (let key of newKeys) {
            if(newProps[key] !== prevProps[key]) return true                
        }

        for (let i = 0; i < newElement.logicalChildren.length; i++) {
            const newChild = newElement.logicalChildren[i];
            let child = oldElement.logicalChildren[i]
            if(isDifferent(child,newChild))
                return true
        }
            
    } else if (newElement instanceof Element || oldElement != newElement)
        return true
}

function replaceNode(){

}

Element.prototype.update = function(newElement, parentElement){
    
    let shouldUpdate = true
    if(this.component && this.component.memoized){
        shouldUpdate = isDifferent(this,newElement)
        console.log("should update",shouldUpdate, this,newElement);
    }

    if(!shouldUpdate) return;

    if(this.type === newElement.type) {

        let isComponent = this._type === FUNCTION_COMPONENT
        let node = this.getNode()//isComponent ? parentElement.node : this.node;
    
        const newProps = newElement.props
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
        let newChildren = []
        if(isComponent){
            //console.log("Update Component",this,newElement)
            newChildren[0] = this.createVirtualDomTree(newElement.props,newElement.logicalChildren)
        }  else newChildren = newElement.children
        
        // Loop through new children and compare it with previous ones
       
        let len = this.children.length
        let newLen = newChildren.length


        // if(this.props.hasOwnProperty("id")){
        //     console.log("disappear")
        // }

        newChildren.forEach((newChild,index)=>{
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
                        newChild._render(index,node, this,node.childNodes[index])
                       
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
                //     newChild._render(this.node)
                // }
                if(newChild instanceof Element){
                    newChild._render(index,node,this)              
                } else {
                    node.appendChild(document.createTextNode(newChild))
                    
                }
                
                this.children.push(newChild)                    
            }
        })

        //Unmount additional children from previous _render
        if(len > newLen){
            for (let i = newLen; i < len; i++) {
                let toDelete = this.children[i]
                if(toDelete instanceof Element)
                    toDelete.unMount()

                //uproot the node
                node.removeChild(node.childNodes[i])
            }
            this.children.splice(newLen, len - newLen)
        }

        
    } else {
        //_render the new Element, take down old tree and build new one
        newElement._render(this.index,parentElement.getNode(), parentElement, this)
        parentElement.children.splice(this.index,1,newElement)
    }

}
