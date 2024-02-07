
"use client";
// import Image from "next/image";
import { MagnifyingGlass } from "phosphor-react";
import { Navbar, Button } from "keep-react";
import { FaMoon , FaSun } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";


import Logo from '../assets/LogoTG.png'
import PropTypes from 'prop-types'

const NavbarComponent = ({setTheme, theme}) => {
    const handleChangeTheme = () => {        
        setTheme((prevTheme => prevTheme ==  "light" ? "dark" : "light"))
    }
    
    return (
        <Navbar fluid={true} className="dark:bg-slate-900 bg-[#ecf0ff]">
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
                            <li><a href="/live">En vivo</a></li>
                        </ul>
                    </Navbar.Container>
                </Navbar.Container>

                <Navbar.Container className="flex gap-2 items-center">
                    <Button size="sm" type="link">
                        <span>
                            <MagnifyingGlass size={20} className="dark:text-white"/>
                        </span>
                        <span className="ml-2 text-metal-600 dark:text-stone-100">Buscar</span>
                    </Button>
                    <Button size="sm" color="warning">
                        <BsCameraReelsFill className="mr-3" />
                        Iniciar sesion de hoy
                    </Button>
                    <Button size="sm" type="primary" href="/login">
                        Salir
                    </Button>
                    <Button size="sm"  type="primary" onClick={handleChangeTheme} circle={true} className="items-center justify-center flex">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </Button>
                </Navbar.Container>
            </Navbar.Container>
        </Navbar>
    );
}

NavbarComponent.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.func,
}

export default NavbarComponent
