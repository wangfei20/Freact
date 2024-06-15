import React,{ useEffect, useState,cloneElement, useRef } from "../src/";

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
        
        setClasses(`${initial} ${active}`)
        setState(inProp ? ENTER_ACTIVE : EXIT_ACTIVE)
        timerRef.current = setTimeout(() => {
            setClasses(done)
            setState(inProp ? ENTER_DONE : EXIT_DONE)
            timerRef.current = null
        }, timeout);

        return ()=>{
            if(timerRef.current)
                clearTimeout(timerRef.current)
        }
    }, [inProp])

    if((state == NONE && !inProp) || (state === EXIT_DONE && unmountOnExit))
        return <div/>

    const child = children[0]
    const newProps = {...child.props,className:`${child.props.className} ${classNames} ${classes}`}
    return cloneElement(child,newProps)

}