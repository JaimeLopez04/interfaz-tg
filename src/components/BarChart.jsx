import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import axios from 'axios';
import { useState, useEffect } from 'react';

//Local Libraries
import { apiUrl } from '../api/apiUrl'

const chartSetting = {
    width: 800,
    height: 300,    
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        },
    },
};

const valueFormatter = (value) => `${value}%`;

export default function BarsDataset() {
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const [errorMessage, setErrorMessage] = useState(null); // Estado para almacenar el mensaje de error
    const [data, setData] = useState(null); // Estado para almacenar los datos

    useEffect(() => {
        const id_user = JSON.parse(localStorage.getItem('data')).id_user;
        let url = apiUrl + 'emotion_recognizer/get_resumen';
        axios.defaults.headers.get['Content_Type'] = 'application/json';
        axios.get(url, {
            params : {
                id_user: id_user
            }
        }).then((response) => {

            if (response.data.message) {
                setErrorMessage(response.data.message);
                setLoading(false); // Cambia el estado de carga a false
                return;
            }
            console.log(response)
            const emotionsData = response.data.emotions_totals;
            const totalFacesDetected = emotionsData.total_faces_detected;
            const emotionsPercentages = {};

            for (const emotion in emotionsData) {
                if (emotion !== 'total_faces_detected' && emotion !== 'most_dominant_emotion') {
                    const count = emotionsData[emotion];
                    const percentage = Math.ceil((count * 100) / totalFacesDetected);
                    emotionsPercentages[emotion] = percentage;
                }
            }

            const newData = Object.entries(emotionsPercentages).map(([emotion, percentage]) => ({
                porcentaje: percentage,
                emocion: emotion.charAt(0).toUpperCase() + emotion.slice(1)
            }));
            console.log(response)
            setData(newData); // Actualiza el estado de los datos
            setLoading(false); // Cambia el estado de carga a false
        }).catch((error) => {
            console.log(error);
        });
    }, []); // Ejecuta el efecto solo una vez al montar el componente

    if (loading) {
        return <div className='flex flex-col justify-center items-center'>
                    <svg height="108px" width="108px" viewBox="0 0 128 128" className="loader">
                        <defs>
                            <clipPath id="loader-eyes">
                                <circle transform="rotate(-40,64,64) translate(0,-56)" r="8" cy="64" cx="64" className="loader__eye1"></circle>
                                <circle transform="rotate(40,64,64) translate(0,-56)" r="8" cy="64" cx="64" className="loader__eye2"></circle>
                            </clipPath>
                            <linearGradient y2="1" x2="0" y1="0" x1="0" id="loader-grad">
                                <stop stopColor="#000" offset="0%"></stop>
                                <stop stopColor="#fff" offset="100%"></stop>
                            </linearGradient>
                            <mask id="loader-mask">
                                <rect fill="url(#loader-grad)" height="128" width="128" y="0" x="0"></rect>
                            </mask>
                        </defs>
                        <g strokeDasharray="175.93 351.86" strokeWidth="12" strokeLinecap="round">
                            <g>
                                <rect clipPath="url(#loader-eyes)" height="64" width="128" fill="hsl(193,90%,50%)"></rect>
                                <g stroke="hsl(193,90%,50%)" fill="none">
                                    <circle transform="rotate(180,64,64)" r="56" cy="64" cx="64" className="loader__mouth1"></circle>
                                    <circle transform="rotate(0,64,64)" r="56" cy="64" cx="64" className="loader__mouth2"></circle>
                                </g>
                            </g>
                            <g mask="url(#loader-mask)">
                                <rect clipPath="url(#loader-eyes)" height="64" width="128" fill="hsl(223,90%,50%)"></rect>
                                <g stroke="hsl(223,90%,50%)" fill="none">
                                    <circle transform="rotate(180,64,64)" r="56" cy="64" cx="64" className="loader__mouth1"></circle>
                                    <circle transform="rotate(0,64,64)" r="56" cy="64" cx="64" className="loader__mouth2"></circle>
                                </g>
                            </g>
                        </g>
                    </svg>
                    <p className='text-white mt-1'>Tu información se está cargando...</p>
                </div>
        
    }

    if (errorMessage) {
        // return ;
        return <div className='flex flex-col justify-center items-center'>
            <p className='text-white m-3'>{errorMessage}</p>
            <span className="loader-eye"></span>
        </div>

    }

    // Si no hay datos ni mensaje de error, no renderiza nada más
    if (!data) {
        return null;
    }
    
    return (
        <BarChart
            dataset={data}
            xAxis={[{ 
                scaleType: 'band', 
                dataKey: 'emocion', 
                color: 'white', 
                tickLabelStyle: { 
                    fill: 'white',  
                    fontSize: 16, 
                    fontFamily: 'Quicksand' 
                },
            }]}
            yAxis={[{
                tickLabelStyle: {
                    fill: '#fff',
                    fontSize: 16,
                    fontFamily: 'Quicksand'
                }
            }]}
            series={[{ dataKey: 'porcentaje', valueFormatter, color: '#53eae0' }]}
            {...chartSetting}
        />
    );
}
