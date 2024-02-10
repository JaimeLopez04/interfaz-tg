import NavbarComponent from "../NavBar"
import PropTypes from 'prop-types'

const Live = ({setTheme, theme}) => {
    return (
        <div className='h-screen'>
            <NavbarComponent setTheme={setTheme}  theme={theme}/>
        </div>
    )
}

Live.propTypes = {
    setTheme: PropTypes.func,
    theme: PropTypes.string
}

export default Live
