
"use client";
import { BarChart } from "keep-react";

const BarChartData = [
    {
        name: "1",
        emotion: "Enojo",
        sell: 0.14,
    },
    {
        name: "2",
        emotion: "Disgusto",
        sell: 0.14,
    },
    {
        name: "3",
        emotion: "Miedo",
        sell: 0.14,
    },
    {
        name: "4",
        emotion: "Felicidad",
        sell: 0.14,
    },
    {
        name: "5",
        emotion: "Neutro",
        sell: 0.14,
    },
    {
        name: "6",
        emotion: "Tristeza",
        sell: 0.1,
    },
    {
        name: "7",
        emotion: "Sorpresa",
        sell: 0.30,
    }
];
    
const BarComponent = () => {
    return (
        <BarChart
            height={250}
            width={700}
            dataKey="sell"
            chartData={BarChartData}
            barSize={100}
            showBg={true}
            // showLegend={true}
            showTooltip={true}
            barRadius={[4, 4, 0, 0]}
            showXaxis={true}
            XAxisDataKey="emotion"
            active={true}
            // activeIndex={5}
            activeColor="#f06806"
            inActiveColor="#94ABFF"
        />
    );
}

export default BarComponent

