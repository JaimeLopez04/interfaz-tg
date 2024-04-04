
"use client";
import { Navbar, Button } from "keep-react";
import { FaMoon , FaReact, FaSun } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiPython } from "react-icons/si";

import Logo from '../assets/LogoTG.png'
import PropTypes from 'prop-types'

const NavbarComponent = ({setTheme, theme}) => {

    const handleChangeTheme = () => {   
        setTheme((prevTheme => prevTheme ==  "light" ? "dark" : "light"))
    }
    
    return (
        <Navbar fluid={true} className="dark:bg-slate-900 bg-opacity-80 dark:bg-opacity-80 backdrop:blur-sm dark:backdrop-blur-sm bg-[#d3ddff]">
            <Navbar.Container className="flex items-center justify-between ">
                <Navbar.Container className="flex items-center">
                    <Navbar.Brand className="m-3">
                        <img src={Logo} alt="logo" width={60}/>
                    </Navbar.Brand>

                    <Navbar.Divider></Navbar.Divider>

                    <Navbar.Container>
                        <ul className="lg:flex  items-center justify-between gap-8 dark:text-white ">
                            <li><a href="/home">Inicio</a></li>
                            <li><a href="/myClasses">Mis clases</a></li>
                            <li><a href="/live">Analisis de clases</a></li>
                        </ul>
                    </Navbar.Container>
                </Navbar.Container>

                <Navbar.Container className="flex gap-2 items-center">

                    <Button size="sm" color="success" circle={true} href="https://github.com/JaimeLopez04/interfaz-tg" target="_blank">
                        <FaGithub className="text-lg mr-1"/> -
                        <FaReact className="text-lg ml-1"/>
                    </Button>

                    <Button size="sm" color="warning" circle={true} href="https://github.com/JaimeLopez04/FastAPI-TG" target="_blank">
                        <FaGithub className="text-lg mr-1"/> -
                        <SiPython className="text-lg ml-1"/>
                    </Button>

                    <Button size="sm" type="primary" circle={true} href="/login" className="px-5">
                        Salir
                    </Button>

                    <Button size="sm"  type="primary" onClick={handleChangeTheme} circle={true} className="items-center justify-center flex">
                        {theme === 'light' ? <FaMoon className="text-lg"/> : <FaSun className="text-lg"/>}
                    </Button>

                    

                </Navbar.Container>
            </Navbar.Container>
        </Navbar>
    );
}

NavbarComponent.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string,
}

export default NavbarComponent
