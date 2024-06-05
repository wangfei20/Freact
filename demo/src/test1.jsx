import React, {memo,useState,useEffect,
        useRef,useContext,createContext,useMemo} from '@freact'
import {useRouter, Link} from '@freact/router'
import {Route} from './simpleRouter'

function Greeting({name,loading}) {

    return <div>
        {loading ? <p>Loading</p> : null}
        <h1>Hello, {name}!</h1>
    </div>;
  }


function Section({sectionLevel,children }) {
  const [level,setLevel] = useState(sectionLevel)
  return (
    <LevelContext.Provider value={{level,setLevel}}>
    <section class="section bg-slate-300">
        {children}
    </section>
      </LevelContext.Provider>
  );
}

const LevelContext = createContext({level:1})

function LevelProvider({children}){
  return <LevelContext.Provider>
    {children}
  </LevelContext.Provider>
}
LevelProvider.cname="LevelProvider"

function Heading({ children }) {
  const {level,setLevel} = useContext(LevelContext);
  const content = useMemo(()=>{
    if(level < 3)
      return "high Level"
    else 
      return "low level"
  },[level])

  function AddLevel(){
    console.log("add level",level);
    setLevel(level+1)
  }

  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button></h1>;
    case 2:
      return <h2>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button></h2>;
    case 3:
      return <h3>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button>
      </h3>;
    case 4:
      return <h4>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button></h4>;
    case 5:
      return <h5>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button></h5>;
    default:
      return <h6>{`${level}:${children}. this is ${content}`}
      <button onclick={AddLevel}>add</button></h6>;
  }
}
Heading.cname = "Heading"

function Level(){
 
  return <Section sectionLevel={1}>
       <Heading>heading1</Heading>
       <Heading>heading2</Heading>
       <Section sectionLevel={2}>
       <Heading>Sub-heading1</Heading>
       <Heading>Sub-heading2</Heading>
       <Section sectionLevel={3}>
       <Heading>Sub-sub-heading1</Heading>
       <Heading>Sub-sub-heading2</Heading>
  </Section>
  </Section>
  </Section>
}
Level.cname = "Level"

function Layout1({children}) {
  return children

}

export default function Layout({children}) {
  return <div>
    <div>
      <Link href="/page1" className="px-5 font-bold cursor-pointer">Page1</Link>
      <Link href="/page2" className="px-5 font-bold cursor-pointer">Page2</Link>
    </div>
    <Route path="/page1" component={Example}/>
    <Route path="/page2" component={Level}/>
  </div>
}

function ChildComponent(){

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const section = useRef(null)

    console.log("child isAuthenticated",isAuthenticated);

    useEffect(()=>{
      console.log("mount effect")
      return ()=>{
        console.log("mount loading effect")
      }
    },[])

    useEffect(()=>{
      console.log("effect")
      return ()=>{
        console.log("clean effect")
      }
    })

    useEffect(()=>{
      section.current.style=isAuthenticated ? "background-color:red" : "background-color:yellow"
      console.log("loading effect")
      return ()=>{
        console.log("clean loading effect")
      }
    },[isAuthenticated,loading])
   
    const toggleAuth = (e) => {
      setIsAuthenticated(!isAuthenticated)
      
    }

    const toggleLoad = (e) => {
      setLoading(!loading)
    }

    // return <section>
    //   {isAuthenticated ?  
    //   <h1>hi<button onclick={toggleAuth}>change</button></h1>: 
    //   <h2>h2<button onclick={toggleAuth}>change</button></h2>
    //   }</section>

    return <div ref={section} class={isAuthenticated ? 'authenticated' : 'none'}>
      {/* {
        loading ? <Greeting name= "fei" loading={loading}/> :
                  <Content/>
      } */}
      <Greeting name= "fei" loading={loading}/>
      <MemoContent content='school'></MemoContent>
      <p>User is {isAuthenticated ? 'authenticated' : 'not authenticated'}</p>
      <button onclick={toggleAuth} class='button primary'>
        {
            isAuthenticated ? 'Logout' : 'Login'
            
        }
      </button>
      <button onclick={toggleLoad} class='button primary'>
        {
            loading ? 'Stop' : 'Loading'
            
        }
      </button>
    </div>

} 
ChildComponent.cname="ChildComponent"

const MemoContent = memo(Content)

function Content({content}){
  console.log("content");
  return <div class="content" data-set-carousel="true">{content || "hello no"}</div>
}

function Example() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null)


  useEffect(() => {
    
    startWatch()    

    console.log("effect");
    return () => {
      clearInterval(intervalRef.current);
    };
  },[]); // Missing dependency array

  function startWatch(){
    intervalRef.current = setInterval(() => {
      setCount(prev=>prev+1);
    }, 1000);
    console.log("ref",intervalRef.current);
  }
  console.log("example",count);

  return (
    <div>
      <p>Count: {count}</p>
      <button onclick={() => startWatch()}>
        Start 
      </button>
      <br></br>
      <button onclick={()=>{
        console.log("ref",intervalRef.current);
        clearInterval(intervalRef.current)
        }}>Stop</button>
    </div>
  );
}
