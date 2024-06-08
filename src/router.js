import React,{useState,useEffect} from "./index"

function Link({href, children,className}){
    return <span class={className} onclick={function(){
        _Router.push(href)
    }}>{children}</span>
}


class Router extends EventTarget {
    constructor(){
        super()
        this.pathname = typeof window !== "undefined" ? window.location.pathname : ""
    }

    push(url){
        window.history.pushState({},"",url)
        this.dispatchEvent(new Event("popstate"));
    }
    
    replace(url){
        window.history.replaceState({},"",url)
    }
}

let _Router = new Router()

const useRouter = function(){
    const [router,setRouter] = useState(_Router)
    function update(event) {
        setRouter({..._Router, pathname : window.location.pathname})
    }
    useEffect(()=>{

        window.addEventListener('popstate', update);
        _Router.addEventListener('popstate', update);
        return ()=>{
            window.removeEventListener('popstate', update);
            _Router.removeEventListener('popstate', update);
        }
    },[])
    return router
}

export {
    useRouter,
    Link
}

