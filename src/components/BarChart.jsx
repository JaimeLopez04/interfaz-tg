// import { BarChart } from '@mui/x-charts/BarChart';
// import { axisClasses } from '@mui/x-charts';
// import axios from 'axios';

// //Local Libraries
// import { apiUrl } from '../api/apiUrl'


// const chartSetting = {
//     width: 800,
//     height: 300,    
//     sx: {
//         [`.${axisClasses.left} .${axisClasses.label}`]: {
//             transform: 'translate(-20px, 0)',
//         },
//     },

// };

// const valueFormatter = (value) => `${value}%`;

//     let data = ''


//     let url = apiUrl + 'emotion_recognizer/get_resumen'
//     axios.defaults.headers.get['Content_Type'] = 'application/json'
//     axios.get(url, {
//         params : {
//             id_user : 2
//         }
//     }).then((response) =>{  
//         // Obtener los datos de emociones totales de la respuesta
//     const emotionsData = response.data.emotions_totals;

//     // Calcular el porcentaje para cada emoción
//     const totalFacesDetected = emotionsData.total_faces_detected;
//     const emotionsPercentages = {};

//     for (const emotion in emotionsData) {
//         if (emotion !== 'total_faces_detected' && emotion !== 'most_dominant_emotion') {
//             const count = emotionsData[emotion];
//             const percentage = Math.ceil((count * 100) / totalFacesDetected);
//             emotionsPercentages[emotion] = percentage;
//         }
//     }

//     // Crear un array de objetos de datos para cada emoción
//     data = Object.entries(emotionsPercentages).map(([emotion, percentage]) => ({
//         porcentaje: percentage,
//         emocion: emotion.charAt(0).toUpperCase() + emotion.slice(1)
//     }));

//     console.log(data);
//     console.log("Respuesta: ", response);
//     }).catch((error)=>{
//         console.log(error)} 
//     ) 

// export default function BarsDataset() {

//     return (
//         <BarChart
//             dataset={data}
//             xAxis={[{ 
//                 scaleType: 'band', 
//                 dataKey: 'emocion', 
//                 color: 'white', 
//                 tickLabelStyle: { 
//                     fill: 'white',  
//                     fontSize: 16, 
//                     fontFamily: 'Quicksand' },
//                 }]
//             }
//             yAxis={[{
//                 tickLabelStyle: {
//                     fill: '#fff',
//                     fontSize: 16,
//                     fontFamily: 'Quicksand'
//                 }
//             }]}
//             series={
//                 [{ dataKey: 'porcentaje', valueFormatter, color: '#53eae0' }]
//             }
//             {...chartSetting}
//         />
//     );
// }

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
        return <p>Tu información se está cargando...</p>;
    }

    return (
        <div className=' dark:border-slate-600 border-slate-300  border rounded-md shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 bg-black m-4 p-4 w-2/3'>
            <h2 className='dark:text-white text-xl ml-2 mb-2 font-bold tracking-wider'>Resumen de la semana</h2>
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
        </div>
    );
}
