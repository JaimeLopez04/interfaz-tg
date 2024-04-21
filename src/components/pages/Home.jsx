import BarComponent from '../BarChart'
import { CarouselComponent } from '../Carrusel'
import NavbarComponent from '../NavBar'
import PropTypes from 'prop-types'


const Home = ({setTheme, theme}) => {
    const nameUser = JSON.parse(localStorage.getItem('data')).name
    const id_user = JSON.parse(localStorage.getItem('data')).id_user

    return (
        <div className='h-screen'>
            <NavbarComponent setTheme={setTheme}  theme={theme} />

            <div className='w-auto mx-4 mt-4 dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black'>
                <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white  p-5 '>
                    Bienvenido de nuevo, {nameUser}
                </h1>
            </div>
            <div className='flex sm:w-full'>
                <div className=' dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black m-4 p-4 w-2/3'>
                    <h2 className='dark:text-white text-xl ml-2 mb-2 font-bold tracking-wider'>Resumen de la semana</h2>
                    <BarComponent id_user={id_user} />
                </div>
                <div className=' dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black m-4 p-4 w-1/3'>
                    <CarouselComponent/>
                </div>
            </div>
        </div>
    )
}

Home.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string,
}

export default Home
