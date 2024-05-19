
"use client";
import { Button,Timeline } from "keep-react";
import { ArrowRight } from "phosphor-react";
import axios from "axios";
import PropTypes from 'prop-types'
import { apiUrl } from "../api/apiUrl";
import { useState, useEffect } from "react";

import './../styles/loading.css'


export default function TimelineComponent({ onShowSummary }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id_user = JSON.parse(localStorage.getItem('data')).id_user;
                const url = apiUrl + 'emotion_recognizer/get_videos';
                const response = await axios.get(url, { params: { id_user: id_user } });
                // Verificar si la respuesta contiene datos y si está estructurada como se espera
                if (response.data && response.data.videos_grouped) {
                    setData(response.data.videos_grouped);
                } else {
                    console.log("La respuesta no contiene datos válidos");
                }
                
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        // Código para mostrar un indicador de carga mientras se carga la información
        return  <div className='flex flex-col justify-center items-center mt-28'>
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
                    <p className='dark:text-white mt-1'>Tu información se está cargando...</p>
                </div>
    }

    const handleShowSummary = (videos) => {
            onShowSummary(videos);
    };

    return (
        <div className="h-[75vh] overflow-auto">
            {data.length > 0 && 
                <Timeline>
                    {data.map((item) => (
                        <Timeline.Item key={item.key}>
                            <Timeline.Point />
                            <Timeline.Content>
                                <Timeline.Time className="dark:text-white text-black">
                                    {item.date} - {item.name_class}
                                </Timeline.Time>
                                <Timeline.Body className="dark:text-white text-black">
                                    En esta clase hubo {item.videos.length} videos
                                </Timeline.Body>
                                <Button type="primary" size="sm" onClick={() => handleShowSummary(item.videos)}>
                                    Ver resumen
                                    <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </Timeline.Content>
                        </Timeline.Item>
                    ))}
                </Timeline>
            }
            {data.length === 0  &&
                <div className='flex flex-col justify-center items-center dark:text-white'>
                    <div className="terminal-loader">
                        <div className="terminal-header">
                            <div className="terminal-title">Estado</div>
                            <div className="terminal-controls">
                            <div className="control close"></div>
                            <div className="control minimize"></div>
                            <div className="control maximize"></div>
                            </div>
                        </div>
                        <div className="text">No hay aun clases agregadas...</div>
                    </div>
                    • Ve a la página En vivo y aprovecha las funciones de FeelingApp •
                </div>
            }
        </div>
    );
}

TimelineComponent.propTypes = {
    onShowSummary: PropTypes.func,
};

