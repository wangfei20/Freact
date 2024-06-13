import React from "freact"
import {useRouter} from 'freact/router'

export function Route({path,component,exact}){
    const router = useRouter()
    let show = exact ? router.pathname == path : new RegExp(`^${path}`,"img").test(router.pathname)
    console.log("route",show,path);
    return show ? React.createElement(component) : <div/> 
}
