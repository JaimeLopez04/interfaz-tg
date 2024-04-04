import PropTypes from 'prop-types'
import WebCamRecorder from "../WebCamRecorder"
import NavbarComponent from '../NavBar'

const Live = ({setTheme, theme}) => {

    return (
        <div className='h-full pb-11'>
            <NavbarComponent setTheme={setTheme}  theme={theme}/>

            <WebCamRecorder />
        </div>
    )
}

Live.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string
}

export default Live
