import NavbarComponent from "../NavBar"
import PropTypes from 'prop-types'
import TimelineComponent from "../Timeline"


const MyClasses = ({setTheme, theme}) => {
    return (
        <div className='h-full'>
            <NavbarComponent setTheme={setTheme}  theme={theme}/>
            <div className="dark:bg-slate-950 mx-4 p-4 rounded-lg ">
                <TimelineComponent/>
            </div>
        </div>
    )
}

MyClasses.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.func
}

export default MyClasses
