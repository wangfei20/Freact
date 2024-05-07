import React,{useState,useEffect} from "./index"

export function Link({href, children}){
    return <span onclick={function(){
        _Router.push(href)
    }}>{children}</span>
}
class Router extends EventTarget {
    constructor(){
        super()
        this.pathname = window.location.pathname
    }

    push(url){
        window.history.pushState({},"",url)
        this.dispatchEvent(new Event("popstate"));
    }
    
    replace(url){
        window.history.replaceState({},"",url)
    }

}

const _Router = new Router()

export const useRouter = function(){
    const [router,setRouter] = useState(_Router)
    function update(event) {
        setRouter({..._Router, pathname : window.location.pathname})
    }
    useEffect(()=>{
        console.log("listen popstate");
        window.addEventListener('popstate', update);
        _Router.addEventListener('popstate', update);
        return ()=>{
            console.log("stop listen popstate");
            window.removeEventListener('popstate', update);
            _Router.removeEventListener('popstate', update);
        }
    },[])
    return router
}

