
"use client";
import { Navbar, Button } from "keep-react";
import { FaMoon , FaSun } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";


import Logo from '../assets/LogoTG.png'
import PropTypes from 'prop-types'

const NavbarComponent = ({setTheme, theme}) => {
    const handleChangeTheme = () => {        
        setTheme((prevTheme => prevTheme ==  "light" ? "dark" : "light"))
    }

    const clearLocalStorage = () => {
        localStorage.clear()
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
                            <li><a href="/live">En vivo</a></li>
                        </ul>
                    </Navbar.Container>
                </Navbar.Container>

                <Navbar.Container className="flex gap-2 items-center">
                    
                    <Button size="sm" color="warning">
                        <BsCameraReelsFill className="mr-3" />
                        Iniciar sesion de hoy
                    </Button>
                    <Button size="sm" type="primary" href="/login" onClick={clearLocalStorage}>
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
    theme: PropTypes.string,
}

export default NavbarComponent
