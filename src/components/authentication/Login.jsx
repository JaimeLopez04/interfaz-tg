import { useState } from "react"

const Login = () => {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const { name, value} = event.target
        setValues({
            ...values,
            [name]:value
        })
    }

    const handleForm = (event) => {
        event.preventDefault();
        console.log(values);
    }

    return (
        <div className='h-[100vh] flex justify-center items-center bg-backgroundAuthentication bg-no-repeat bg-cover'>
            <div 
                className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-30 relative bg-slate-300">
                <h1 className="mb-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-50">
                    Inicio de sesion
                </h1>
                <form className="space-y-6" onSubmit={handleForm}>
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium leading-6 text-white">
                                Correo
                        </label>
                        <div className="mt-2">
                            <input 
                                type="text"
                                name="email"
                                value={values.email}
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-md text-slate-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6 p-2 bg-transparent "
                                onChange={handleInputChange} />
                        </div>
                    </div>

                    <div>
                        <label 
                            htmlFor="user" 
                            className="block text-sm font-medium leading-6 text-white">
                                Contraseña
                        </label>
                        <div className="mt-2">
                            <input 
                                type="password"
                                name="password"
                                value={values.password}
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-md  text-slate-50 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6 p-2 bg-transparent"
                                onChange={handleInputChange} />
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="flex w-full justify-center rounded-md bg-[#0c16ff] hover:bg-[#567dff] hover:text-[#0a0e5c] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <a href="/home"> 
                            Entrar
                        </a>
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-300">
                    ¿Aun no esta registrado?
                    <a 
                        href="/register" 
                        className="font-semibold leading-6 mx-2 text-[#567dff] hover:text-[#f06806] ">
                        Registrate aqui
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Login
