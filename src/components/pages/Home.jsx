import BarComponent from '../BarChart'
import NavbarComponent from '../NavBar'
import PropTypes from 'prop-types'

const Home = ({setTheme, theme}) => {
    return (
        <div className='h-screen'>
            <NavbarComponent setTheme={setTheme}  theme={theme} />
            <div className='dark:bg-slate-950 mx-4 p-4 rounded-lg'>
                <div className='dark:bg-slate-900 bg-[#ecf0ff] mx-4 rounded-lg w-auto'>
                    <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white mt-4 p-5 '>
                        Bienvenido de nuevo, Lorem Ipsum!
                    </h1>
                </div>
                <div className='flex sm:w-full'>
                    <div className='dark:bg-slate-900 bg-[#ecf0ff] m-4 p-4 rounded-lg w-2/3'>
                        <h2 className='dark:text-white text-lg mx-6'>Resumen de la semana</h2>
                        <BarComponent/>
                    </div>
                    <div className='dark:bg-slate-900 bg-[#ecf0ff] m-4 p-4 rounded-lg w-1/3'>
                        <h2 className='dark:text-white text-lg mx-6'>Resumen de la semana</h2>
                    </div>
                </div>
            </div>
        </div>

    )
}

Home.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string,
    setButtonTheme: PropTypes.func
}

export default Home
