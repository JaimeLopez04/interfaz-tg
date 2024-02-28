import NavbarComponent from "../NavBar"
import PropTypes from 'prop-types'
import TimelineComponent from "../Timeline"


const MyClasses = ({setTheme, theme}) => {
    return (
        <div className='h-screen'>
            <NavbarComponent setTheme={setTheme}  theme={theme}/>
            <div className="flex sm:w-full">
                <div className=" dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black mx-4 mt-3 p-4 w-1/2">
                    <TimelineComponent/>
                </div>
                <div className=" dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black mx-4 mt-3 p-4 w-1/2">
                    Holi
                </div>
            </div>
        </div>
    )
}

MyClasses.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string
}

export default MyClasses
