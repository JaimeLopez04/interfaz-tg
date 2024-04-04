import BarComponent from '../BarChart'
import NavbarComponent from '../NavBar'
import PropTypes from 'prop-types'

const Home = ({setTheme, theme}) => {
    // const storedData = JSON.parse(localStorage.getItem('data'));
    const nameUser = JSON.parse(localStorage.getItem('data')).name
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
                    <BarComponent/>
                </div>
                <div className=' dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black m-4 p-4 w-1/3'>
                    <h2 className='dark:text-white text-xl font-bold mx-6 tracking-wider'>Nuestro proyecto</h2>
                    <p className='dark:text-white text-base mx-6 mt-4 '>
                        Este proyecto busca explorar y explotar la inteligencia artificial en el entorno académico, proporcionando al docente una visión clara de las emociones de los estudiantes que asisten a sus clases, por lo que puede realizar ajustes a su metodología de enseñanza y encontrar puntos de mejora, así mismo mantener los puntos positivos de su interacción con estos.
                    </p>
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
