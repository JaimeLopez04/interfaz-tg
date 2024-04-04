import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

const chartSetting = {
    width: 800,
    height: 300,    
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
        },
    },

};

const dataset = [
    {
        porcentaje: 59,
        emocion: 'Felicidad',
    },
    {
        porcentaje: 50,
        emocion: 'Tristeza',
    },
    {
        porcentaje: 47,
        emocion: 'Disgusto',
    },
    {
        porcentaje: 54,
        emocion: 'Miedo',
    },
    {
        porcentaje: 57,
        emocion: 'Sorpresa',
    },
    {
        porcentaje: 60,
        emocion: 'Enojo',
    },
    {
        porcentaje: 59,
        emocion: 'Neutro',
    }
];

const valueFormatter = (value) => `${value}%`;

export default function BarsDataset() {

    return (
        <BarChart
            dataset={dataset}
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