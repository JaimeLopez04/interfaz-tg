
"use client";
import { Button,Timeline } from "keep-react";
import { ArrowRight } from "phosphor-react";
import axios from "axios";
import PropTypes from 'prop-types'
import { apiUrl } from "../api/apiUrl";
import { useState, useEffect } from "react";

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
        return <div className='flex flex-col justify-center items-center'>...</div>;
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
                <div className='flex flex-col justify-center items-center gap-4 text-white'>
                    No hay aun clases agregadas
                </div>
            }
        </div>
    );
}

TimelineComponent.propTypes = {
    onShowSummary: PropTypes.func,
};

