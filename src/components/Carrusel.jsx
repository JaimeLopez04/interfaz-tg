
"use client";
import { Carousel } from "keep-react";
import emociones1 from '../assets/1.png';
import emociones2 from '../assets/2.png';
import emociones3 from '../assets/3.png';

export const CarouselComponent = () => {
    return (
        <Carousel
            slideInterval={6000}
            indicatorsType="ring" 
            indicators={true}>
                <img src={emociones1} alt="slider-1" className="w-auto" />
                <img src={emociones2} alt="slider-2" className="w-auto"/>
                <img src={emociones3} alt="slider-3" className="w-auto"/>
        </Carousel>
    )
}