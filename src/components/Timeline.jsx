
"use client";
import { Button,Timeline } from "keep-react";
import { ArrowRight } from "phosphor-react";

const TimelineComponent = () => {
    return (
        <Timeline className="h-[75vh] overflow-auto">
            <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                    <Timeline.Time className="dark:text-white text-black">
                        Febrero 20 de 2024
                    </Timeline.Time>
                    {/* <Timeline.Title className="dark:text-white text-black">
                        Mobile App Development
                    </Timeline.Title> */}
                    <Timeline.Body className="dark:text-white text-black">
                        En esta clase hubo 3 cambios importantes en los estudiantes
                    </Timeline.Body>
                    <Button type="primary" size="sm">
                        Ver resumen
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                    <Timeline.Time className="dark:text-white text-black">
                        Febrero 22 de 2024
                    </Timeline.Time>
                    <Timeline.Body className="dark:text-white text-black">
                        En esta clase hubo 3 cambios importantes en los estudiantes
                    </Timeline.Body>
                    <Button type="primary" size="sm">
                        Ver resumen
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                    <Timeline.Time className="dark:text-white text-black">
                        Febrero 23 de 2024
                    </Timeline.Time>
                    <Timeline.Body className="dark:text-white text-black">
                        En esta clase hubo 3 cambios importantes en los estudiantes
                    </Timeline.Body>
                    <Button type="primary" size="sm">
                        Ver resumen
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                    <Timeline.Time className="dark:text-white text-black">
                        Febrero 23 de 2024
                    </Timeline.Time>
                    <Timeline.Body className="dark:text-white text-black">
                        En esta clase hubo 3 cambios importantes en los estudiantes
                    </Timeline.Body>
                    <Button type="primary" size="sm">
                        Ver resumen
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Timeline.Content>
            </Timeline.Item>
            <Timeline.Item>
                <Timeline.Point />
                <Timeline.Content>
                    <Timeline.Time className="dark:text-white text-black">
                        Febrero 23 de 2024
                    </Timeline.Time>
                    <Timeline.Body className="dark:text-white text-black">
                        En esta clase hubo 3 cambios importantes en los estudiantes
                    </Timeline.Body>
                    <Button type="primary" size="sm">
                        Ver resumen
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Timeline.Content>
            </Timeline.Item>
        </Timeline>
    );
}

export default  TimelineComponent
