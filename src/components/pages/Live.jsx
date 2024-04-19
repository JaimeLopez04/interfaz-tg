import NavbarComponent from "../NavBar"
import PropTypes from 'prop-types'
import WebCamRecorder from "../WebCamRecorder"

const Live = ({setTheme, theme}) => {
    return (
        <div className='h-full pb-36'>
            <NavbarComponent setTheme={setTheme}  theme={theme}/>
            <WebCamRecorder/>
        </div>
    )
}

Live.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string
}

export default Live
