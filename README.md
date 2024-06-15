## Introduction
[Freact](https://github.com/wangfei20/Freact) is a lightweight yet powerful React-like UI library developed by [Fiona Wang](https://fiona-wang.vercel.app). It comes with most core functionalities and almost identical API of React, ensuring a consistent and familiar development experience for developers.

Freact is in rapid development and some features are currently missing. Please try it on non-production projects and report any issues you may encounter. Contributors are welcome!

## Getting started
Start a new Freact project is easy, just download create-freact-app, the Freact scaffolding project.

``` bash
git clone https://github.com/wangfei20/create-freact-app
```

**Node.js version requirement:** `^20.8.0 or ^18.17.0`


## Functional Component

As you can see, it's just like how you would write a React component. And to keep things simple, Freact only supports functional components. 

``` javascript
import React, {render} from 'freact'

const Greeting = ({name, children}) => {
  return (
    <>
        <h1>Greetings, {name}!</h1>      
        {children}
    </>
  )
}

render(
  <Greeting name="Fiona">This is a Freact Component</Greeting>,
  document.getElementById('root')
);
```

## Hooks

What's a component without Hooks? Freact comes with most common Hooks to ensure a smooth development and it will support custom hooks in the near future.

Now let's take a look.

### useState

useState Hook is the most important and fundamental out of all Hooks, allowing you to manage state within functional components.

``` javascript

import React, {useState} from 'freact'

const Example = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const toggleAuth = () => {
    setIsAuthenticated(prevState => !prevState);
  };
  
  return (
    <div>
      { isAuthenticated ? "Hello Fiona"/> : "Please Login" }
      <button onclick={toggleAuth}>
        {
            isAuthenticated ? 'Logout' : 'Login'
    
        }
      </button>
    </div>
  )
}

```

**Note that Freact keeps native DOM event and raw HTML attribute/property names, while also supporting className.** 

### useEffect and useRef

The useEffect Hook allows you to perform side effects in your components, such as data fetching and subscriptions. It accepts a function and a dependency array as arguments. The function is called based on changes to dependencies or lifecycle events.

useRef Hooks allows you to store/access data throughout the component's lifecycle and change it without triggering rerender.

This counter example showcases both at work.

``` javascript

function Counter() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null)

  useEffect(() => {
    startWatch()    
    return () => {
      clearInterval(intervalRef.current);
    };
  },[]);

  function startWatch(){
    intervalRef.current = setInterval(() => {
      setCount(prev=>prev+1);
    }, 1000);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onclick={() => startWatch()}>
        Start 
      </button>
      <button onclick={()=>{clearInterval(intervalRef.current)}}>
        Stop
      </button>
    </div>
  );
}
```

## Context

Freact offers Context to pass data through component tree and manage global state easily. 

Here's an example demonstrating the usage of Context with an authentication scenario:

``` javascript
import React, {useState, createContext, useContext} from 'freact'

const AuthContext = createContext();

const AuthProvider = function({ children }) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
        {children}
      </AuthContext.Provider>
    </div>
  );
}; 

const Example = () => {
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const toggleAuth = (e) => {
    setIsAuthenticated(!isAuthenticated)
  }
  return (
    <div>
      <p>{ isAuthenticated ? "Hello Fiona" : "Please Login" }</p>
      <button onclick={toggleAuth}>
        {
            isAuthenticated ? 'Logout' : 'Login'
        }
      </button>
    </div>
  );
};

const App(){
  return (
    <AuthProvider>
      <Example></Example>
    </AuthProvider>
  )
}

```

## Memoization

Memoization helps optimize component performance by caching the results of expensive computations. Freact provides built-in memo function and 2 Hooks (useMemo and useCallback) to memoize data and prevent unnecessary re-renders.

``` javascript

import React, {memo, useMemo, useCallback} from 'freact'

```
### Memoized Component

The memo function can be used to create a memoized component, preventing unnecessary re-renders when the component receives the same props:

``` javascript
const ExpensiveComponent = memo((props) => {
  // ... expensive computations
});
```

### useMemo

The useMemo Hook is used to memoize the result of a computation, preventing unnecessary recalculations between component re-renders. The Hook updates the memoized value only when the dependencies change.

``` javascript

const Example = ({data}) => {

  const filteredData = useMemo(() => {
    let result;
    // ... expensive computations
    return result;
  }, [data]);
  
  // ...

};

``` 

### useCallback

The useCallback Hook is used to memoize callback functions, ensuring that the function is re-created only when its dependencies change.

``` javascript

const Example = ({data}) => {

  const handleSubmit = useCallback((dataToSubmit) => {
    // ... expensive computations
  }, [data]);
 
  // ...
};

```

## Routing

In addition, Freact also comes with Routing components and useRouter inspired by NextJS, making it a breeze for you to build single page apps.

``` javascript
import {Link, Route} from '@freact/router'

const Layout = ({children}) => {
  return (
    <div>
      <div>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
      <Route path="/" component={Home}/>
      <Route path="/about" component={About}/>
  </div>
  )
}
```

### Pages Router

I have also built a file-system based router system that works like Pages Router of NextJs. It fully supports dynamic routing and SSG, with new features coming soon. Check it out [here](https://github.com/wangfei20/WhatIsNext)!











