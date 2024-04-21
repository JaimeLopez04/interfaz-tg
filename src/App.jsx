import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Login from './components/authentication/Login';
import Register from './components/authentication/Register';
import Home from './components/pages/Home';
import { useEffect, useState } from 'react';
import MyClasses from './components/pages/MyClasses';
import Live from './components/pages/Live';

// Color: #0c16ff azul marino
//        #0a0e5c azul oscuro
//        #567dff azul claro
//        #f06806 naranja intenso
//        #46003A morado
//        ##0c0c0f negro background

function App() {

  const temaActual = localStorage.getItem('theme');

  const [theme, setTheme] = useState(() => {
    if(window.matchMedia("(prefers-color-scheme:dark)").matches){
      if(temaActual &&  temaActual === "dark") {
        localStorage.setItem('theme','dark')
      }
      return "dark";
    }
    localStorage.setItem('theme','ligth')
    return "ligth"
  });

  useEffect(() => {
    if (localStorage.getItem('theme') == "dark"){
      setTheme(localStorage.getItem('theme'));
      document.querySelector("html").classList.add("dark")
    }else{
      setTheme(localStorage.getItem('theme'))
      document.querySelector("html").classList.remove("dark")
    }
  }, [theme])
  
  
  return (
    <div className='dark:bg-slate-900 bg-neutral-50  bg-backgroundAplication bg-no-repeat bg-cover'>      
      <Routes>
        <Route  path="/" element={<Navigate to="/login"/>} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/home' element={<Home setTheme={setTheme}  theme={theme} />}/>
        <Route path='/myClasses' element={<MyClasses setTheme={setTheme}  theme={theme} />}/>
        <Route path='/live' element={<Live setTheme={setTheme}  theme={theme} />}/>
      </Routes>
    </div>
  )

}

export default App
