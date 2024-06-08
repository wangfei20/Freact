export function isEvent(attr){
    return attr == "onclick"
        || attr == "ondblclick"
        || attr == "onmousedown"
        || attr == "onmouseup"
        || attr == "onmouseover"
        || attr == "onmousemove"
        || attr == "onmouseout"
        || attr == "onkeypress"
        || attr == "onkeydown"
        || attr == "onkeyup"
        || attr == "onfocus"
        || attr == "onblur"
        || attr == "onchange"
        || attr == "onselect"
        || attr == "onsubmit"
        || attr == "onreset"
        || attr == "onerror"
        || attr == "onload"
        || attr == "onunload"
        || attr == "onscroll"
        || attr == "oncontextmenu"
        || attr == "ondragstart"
        || attr == "ondragend"
        || attr == "ondragover"
        || attr == "ondragenter"
        || attr == "ondragleave"
        || attr == "ondrop"
}

export function flattenArray(arr){
    return arr.reduce(function(flattened,current){
        if(Array.isArray(current)){
            return [...flattened,...flattenArray(current)]
        } else 
            return [...flattened, current]
    }, [])
}


export function deepCompare(obj1, obj2) {
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);
  
    if (obj1Keys.length !== obj2Keys.length) {
      return false;
    }
  
    for (let i = 0; i < obj1Keys.length; i++) {
      const key = obj1Keys[i];
  
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }
  
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        if (!deepCompare(obj1[key], obj2[key])) {
          return false
        }
      } else if (obj1[key] !== obj2[key]) {
        return false
      }
    }
  
    return true;
}