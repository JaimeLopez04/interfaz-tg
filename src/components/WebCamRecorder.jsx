import { useState, useEffect, useRef } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
import { BsCameraReelsFill } from "react-icons/bs";
import { Button } from "keep-react";
import fetch from "isomorphic-fetch";
import { apiUrl } from "../api/apiUrl";

const WebCamRecorder = () => {
    const [audioSource, setAudioSource] = useState("");
    const [videoSource, setVideoSource] = useState("");
    const [audioSourceOptions, setAudioSourceOptions] = useState([]);
    const [videoSourceOptions, setVideoSourceOptions] = useState([]);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(false);
    const [dominantEmotion, setDominantEmotion] = useState("");
    const [downloadLink, setDownloadLink] = useState("");
    const [class_name, setClassName] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Current date in 'YYYY-MM-DD' format

    const chunks = useRef([]);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const streamRecorderRef = useRef(null);
    const id_user = JSON.parse(localStorage.getItem("data")).id_user;

    useEffect(() => {
        const prepareStream = async () => {
                const gotStream = (stream) => {
                    streamRef.current = stream;
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                };

            const getStream = async () => {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                }   

                const constraints = {
                    audio: {
                        deviceId: audioSource !== "" ? { exact: audioSource } : undefined,
                    },
                    video: {
                        deviceId: videoSource !== "" ? { exact: videoSource } : undefined,
                    },
                };

                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    gotStream(stream);
                } catch (error) {
                    setError(error);
                }
            };

            const gotDevices = (deviceInfos) => {
                const audioSourceOptions = [];
                const videoSourceOptions = [];
                for (const deviceInfo of deviceInfos) {
                    if (deviceInfo.kind === "audioinput") {
                        audioSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Microphone ${deviceInfo.deviceId}`,
                        });
                    } else if (deviceInfo.kind === "videoinput") {    
                        videoSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Camera ${deviceInfo.deviceId}`,
                        });
                    }
                }
                setAudioSourceOptions(audioSourceOptions);
                setVideoSourceOptions(videoSourceOptions);
            };

            await getStream();

            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            gotDevices(mediaDevices);
        };

        prepareStream();
    }, [audioSource, videoSource]);

    const startRecordingButton = () => {
        setIsRecording(true);
        setRecording(true);
        startRecording();
    };

    const stopRecordingButton = () => {
        setIsRecording(false);
        setRecording(false);
        stopRecording();
    };

    const startRecording = () => {
        console.log("Si inicia");
        if (isRecording || !streamRef.current) return;
        streamRecorderRef.current = new MediaRecorder(streamRef.current);
        streamRecorderRef.current.start();
        streamRecorderRef.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };
        console.log("setea la variable en true");
    };

    const stopRecording = async () => {
        console.log("Si para");
        if (!isRecording || !streamRecorderRef.current) return;
        streamRecorderRef.current.stop();
        console.log("setea la variable en false");
        // Agregamos un timeout de 1000 milisegundos (1 segundo) para dar tiempo a que se acumulen los chunks
        await new Promise((resolve) => setTimeout(resolve, 1000));
        processVideo();
    };

    const processVideo = async () => {
        console.log("Si entra");
        console.log(chunks); // Esto debería mostrar el objeto con la propiedad current
        console.log(chunks.current); // Esto debería mostrar el array de chunks actual
        console.log(chunks.current.length); // Esto debería mostrar la longitud del array de chunks actual
        if (chunks.current.length === 0) return;
        // Obtener el último elemento del array
        const lastIndex = chunks.current.length - 1;
        const lastChunk = chunks.current[lastIndex];
        const blob = new Blob([lastChunk], { type: "video/webm" });
        await sendVideoToBackend(blob);
    };

    const sendVideoToBackend = async (videoBlob) => {
        try {
            const formData = new FormData();
            formData.append("file", videoBlob);
            formData.append("id_user", id_user);
            formData.append("class_name", class_name);
            formData.append("class_date", date);
            const response = await fetch(
                `${apiUrl}emotion_recognizer/analyze_video`,
                {
                method: "POST",
                body: formData,
                }
            );
            if (!response.ok) {
                throw new Error("Error al enviar el video al servidor");
            }
            const responseData = await response.json();
            
            // Acceder a la propiedad dominan_emotion
            const dominanEmotion = responseData.emotions_detected.dominan_emotion;

            // Acceder a la propiedad video_link
            const videoLink = responseData.video_link;

            console.log(dominanEmotion); // Output: "Enojo"
            console.log(videoLink); // Output: "http://localhost:8000/app\storage\videos\1_prueba_2024-04-20_17.mp4"

            if (
                // El dominan_emotion es diferente de Neutral, Felicidad y Sorpresa
                responseData.emotions_detected.dominan_emotion !== "Neutral" &&
                responseData.emotions_detected.dominan_emotion !== "Felicidad" &&
                responseData.emotions_detected.dominan_emotion !== "Sorpresa"
            ) {
                setDownloadLink(videoLink);
                setDominantEmotion(dominanEmotion)
            }
            
            localStorage.setItem("emotion_resumen", responseData);
            console.log(responseData);
        } catch (error) {
            console.error("Error al enviar el video al servidor:", error);
        }
    };

    useEffect(() => {
        // Función para obtener la fecha actual en el formato YYYY-MM-DD
        const getCurrentDate = () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
            const day = currentDate.getDate().toString().padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        // Establecer el estado con la fecha actual
        setDate(getCurrentDate());
    }, []); // Se ejecuta solo una vez al montar el component

    const handleInputChange = (event) => {
        setClassName(event.target.value);
    };

    useEffect(() => {
        let recordingInterval;
        let restartInterval;

        const stopRecordingAfter30Seconds = () => {
        if (recording) {
            stopRecording();
        }
        };

        const restartRecordingAfter120Seconds = () => {
        if (!recording) {
            startRecording();
        }
        };

        if (isRecording) {
        // Detener la grabación después de 30 segundos
        recordingInterval = setInterval(stopRecordingAfter30Seconds, 30000);

        // Reiniciar la grabación después de 120 segundos
        restartInterval = setInterval(restartRecordingAfter120Seconds, 120000);
        }

        return () => {
        clearInterval(recordingInterval);
        clearInterval(restartInterval);
        };
    }, [isRecording, recording]);

    return (
        <div>
        <div className="flex m-3 gap-4 justify-center">
            <div>
            <label
                htmlFor="dateClass"
                className="block text-sm font-medium leading-6 text-white"
            >
                Camara de video
            </label>
            <select
                name="videoSource"
                id="videoSource"
                value={videoSource}
                onChange={(event) => setVideoSource(event.target.value)}
                className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                {videoSourceOptions.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9"
                >
                    {option.label}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label
                htmlFor="dateClass"
                className="block text-sm font-medium leading-6 text-white"
            >
                Audio
            </label>
            <select
                name="audioSource"
                id="audioSource"
                value={audioSource}
                onChange={(event) => setAudioSource(event.target.value)}
                className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                {audioSourceOptions.map((option) => (
                <option
                    key={option.value}
                    value={option.value}
                    className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9"
                >
                    {option.label}
                </option>
                ))}
            </select>
            </div>
        </div>

        <div className="flex m-3 gap-4 justify-center">
            <div>
            <label
                htmlFor="dateClass"
                className="block text-sm font-medium leading-6 text-white"
            >
                Fecha de la clase
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                type="date"
                name="dateClass"
                id="dateClass"
                className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={date} // Establecer el valor del input con el estado date
                readOnly // Para evitar que el usuario cambie la fecha
                />
            </div>
            </div>

            <div>
            <label
                htmlFor="nameClass"
                className="block text-sm font-medium leading-6 text-white"
            >
                Nombre de la clase
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                type="text"
                name="nameClass"
                id="nameClass"
                value={class_name}
                onChange={handleInputChange} // Asignamos el controlador de eventos al evento onChange
                className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Ingrese el nombre de la clase a analizar"
                />
            </div>
            </div>
        </div>

        <div className="flex m-4 gap-4 justify-center items-center">
            <Button
            size="sm"
            color={recording ? "error" : "warning"}
            onClick={recording ? stopRecordingButton : startRecordingButton}
            >
            <BsCameraReelsFill className="mr-3" />
                {recording ? "Parar sesión de hoy" : "Iniciar sesión de hoy"}
            </Button>

            {downloadLink && (
            <button className="inline-block h-8 w-8 rounded-full ring-2 ring-white m-2">
                <a href={downloadLink} download="file.mp4">
                <FaArrowCircleDown className="w-8 text-white" />
                </a>
            </button>
            )}
        </div>

        <div className="flex m-4 gap-4 justify-center">
            <div className="w-1/3 m-6 flex justify-center items-center shadow-md">
            <video ref={videoRef} autoPlay muted playsInline />
            </div>

            {error && <p>{error.message}</p>}

            {downloadLink && (
            <div className="w-1/3 m-6 flex justify-center shadow-md">
                <video src={downloadLink} controls />
                <h5>En este momento tus estudiantes sienten : {dominantEmotion}</h5>
            </div>
            )}
        </div>
        </div>
    );
};

export default WebCamRecorder;
