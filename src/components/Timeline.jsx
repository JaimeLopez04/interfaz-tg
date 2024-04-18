
"use client";
import { Button,Timeline } from "keep-react";
import { ArrowRight } from "phosphor-react";
import PropTypes from 'prop-types'

const TimelineComponent = ({ onShowSummary }) => {

    const  items = [
        {
            'key': 11,
            'date': '2018/09',
            'name_class': 'Holi 1',
            'count_videos': 5,
            'videos': [
                {
                    'url' :  'https://www.youtube.com/watch?v=ytQ5CYE1VZw&list=RDytQ5CYE1VZw&start_radio=1',
                    'key': 1,
                    'dominant_emotion': 'Triste'

                },
                {
                    'url' :  'https://drive.google.com/file/d/13Q2d705uSw8tv5hWHwHEcZJJoROLjZit/view?usp=sharing',
                    'key': 2,
                    'dominant_emotion': 'Triste muchooooooo'
                }
            ]
        },
        {
            'key': 12,
            'date': '2018/08',
            'name_class': 'Holi 2',
            'count_videos': 5,
            'videos': [
                {
                    'url' :  'https://drive.google.com/file/d/13Q2d705uSw8tv5hWHwHEcZJJoROLjZit/view?usp=sharing',
                    'key': 3,
                    'dominant_emotion': 'Triste'
                },
                {
                    'url' :  'https://drive.google.com/file/d/13Q2d705uSw8tv5hWHwHEcZJJoROLjZit/view?usp=sharing',
                    'key': 4,
                    'dominant_emotion': 'Triste'
                },
                {
                    'url' :  'https://drive.google.com/file/d/13Q2d705uSw8tv5hWHwHEcZJJoROLjZit/view?usp=sharing',
                    'key': 5,
                    'dominant_emotion': 'Triste'
                }
            ]
        },
        {
            'key': 13,
            'date': '2018/05',
            'name_class': 'Holi 2',
            'count_videos': 5,
            'videos': [
                
            ]
        }
    ]

    const handleShowSummary = (videos) => {
        onShowSummary(videos);
    };

    return (
        <div className="h-[75vh] overflow-auto">
            {items.length > 0 && 
                <Timeline >
                    {items.map((item) => (
                        <Timeline.Item key={item.key} >
                            <Timeline.Point />
                            <Timeline.Content>
                                <Timeline.Time className="dark:text-white text-black">
                                    {item.date} - {item.name_class}
                                </Timeline.Time>
                                <Timeline.Body className="dark:text-white text-black">
                                    En esta clase hubo {item.count_videos} cambios importantes en los estudiantes
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
            {items.length === 0  &&
                <div className='flex flex-col justify-center items-center gap-4'>
                    No hay aun clases  agregadas
                </div>
            }
        </div>
    );
}

TimelineComponent.propTypes = {
    /** Function to call when the user wants to see the summary of a video */
    onShowSummary: PropTypes.func,
};

export default  TimelineComponent
