import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';
import axios from 'axios';

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

    let data = ''


    let url = apiUrl + 'emotion_recognizer/get_resumen'
    axios.defaults.headers.get['Content_Type'] = 'application/json'
    axios.get(url, {
        params : {
            id_user : 2
        }
    }).then((response) =>{  
        // Obtener los datos de emociones totales de la respuesta
    const emotionsData = response.data.emotions_totals;

    // Calcular el porcentaje para cada emoción
    const totalFacesDetected = emotionsData.total_faces_detected;
    const emotionsPercentages = {};

    for (const emotion in emotionsData) {
        if (emotion !== 'total_faces_detected' && emotion !== 'most_dominant_emotion') {
            const count = emotionsData[emotion];
            const percentage = Math.ceil((count * 100) / totalFacesDetected);
            emotionsPercentages[emotion] = percentage;
        }
    }

    // Crear un array de objetos de datos para cada emoción
    data = Object.entries(emotionsPercentages).map(([emotion, percentage]) => ({
        porcentaje: percentage,
        emocion: emotion.charAt(0).toUpperCase() + emotion.slice(1)
    }));

    console.log(data);
    console.log("Respuesta: ", response);
    }).catch((error)=>{
        console.log(error)} 
    ) 

export default function BarsDataset() {

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
                    fontFamily: 'Quicksand' },
                }]
            }
            yAxis={[{
                tickLabelStyle: {
                    fill: '#fff',
                    fontSize: 16,
                    fontFamily: 'Quicksand'
                }
            }]}
            series={
                [{ dataKey: 'porcentaje', valueFormatter, color: '#53eae0' }]
            }
            {...chartSetting}
        />
    );
}
