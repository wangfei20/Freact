import { useEffect, useState,cloneElement,Children, useRef } from "react";

const enter = '-enter';
const enterActive = '-enter-active';
const enterDone = '-enter-done';
const exit = '-exit';
const exitActive = '-exit-active';
const exitDone = '-exit-done';

const NONE = 0
const ENTER_ACTIVE = 1
const ENTER_DONE = 2
const EXIT_ACTIVE = 3
const EXIT_DONE = 4

export default function CSSTransition({ timeout, in: inProp, classNames, unmountOnExit, children}){
    const [classes, setClasses] = useState()
    const [state,setState] = useState(NONE)
    const timerRef = useRef()

    useEffect(()=>{
        if(state == NONE && !inProp && unmountOnExit)
            return

        const initial = `${classNames}${inProp ? enter : exit}`
        const active = `${classNames}${inProp ? enterActive : exitActive}`
        const done = `${classNames}${inProp ? enterDone : exitDone}`

        if(timerRef.current)
            clearTimeout(timerRef.current)

        setClasses(`${initial}`)
        setState(inProp ? ENTER_ACTIVE : EXIT_ACTIVE)
        requestAnimationFrame(()=>{
            setClasses(`${initial} ${active}`)
        })
        
        timerRef.current = setTimeout(() => {
            setClasses(done)
            setState(inProp ? ENTER_DONE : EXIT_DONE)
            timerRef.current = null
        }, timeout);
    }, [inProp])

    if((state == NONE && !inProp) || (state === EXIT_DONE && unmountOnExit))
        return null
    
    let newChildren = Children.map(children,child => {
        return cloneElement(child,{
            ...child.props,
            className:`${child.props.className} ${classNames} ${classes}`})
    })
    
    return newChildren
}