import { useEffect, useRef, useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
import fetch from 'isomorphic-fetch';
import { apiUrl } from "../api/apiUrl";

const WebCamRecorder = () => {
    const [audioSource, setAudioSource] = useState("");
    const [videoSource, setVideoSource] = useState("");
    const [audioSourceOptions, setAudioSourceOptions] = useState([]);
    const [videoSourceOptions, setVideoSourceOptions] = useState([]);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const chunks = useRef([]);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const streamRecorderRef = useRef(null);
    const id_user = JSON.parse(localStorage.getItem('data')).id_user
    const class_date = '03-abril-2024'
    const class_name = 'Clase cualquiera'

    useEffect(() => {
        async function prepareStream() {
            function gotStream(stream) {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }

            async function getStream() {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                }

                const constraints = {
                    audio: { deviceId: audioSource !== "" ? { exact: audioSource } : undefined },
                    video: { deviceId: videoSource !== "" ? { exact: videoSource } : undefined }
                };

                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    gotStream(stream);
                } catch (error) {
                    setError(error);
                }
            }

            function gotDevices(deviceInfos) {
                const audioSourceOptions = [];
                const videoSourceOptions = [];
                for (const deviceInfo of deviceInfos) {
                    if (deviceInfo.kind === "audioinput") {
                        audioSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Microphone ${deviceInfo.deviceId}`
                        });
                    } else if (deviceInfo.kind === "videoinput") {
                        videoSourceOptions.push({
                            value: deviceInfo.deviceId,
                            label: deviceInfo.label || `Camera ${deviceInfo.deviceId}`
                        });
                    }
                }
                setAudioSourceOptions(audioSourceOptions);
                setVideoSourceOptions(videoSourceOptions);
            }

            await getStream();

            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            gotDevices(mediaDevices);
        }

        prepareStream();
    }, [audioSource, videoSource]);

    function startRecording() {
        if (isRecording || !streamRef.current) return;
        streamRecorderRef.current = new MediaRecorder(streamRef.current);
        streamRecorderRef.current.start();
        streamRecorderRef.current.ondataavailable = function (event) {
            chunks.current.push(event.data);
        };
        setIsRecording(true);
    }

    async function stopRecording() {
        if (!streamRecorderRef.current) return;
        processVideo();
        streamRecorderRef.current.stop();
        setIsRecording(false);
    }

    async function processVideo() {
        if (chunks.current.length === 0) return;
        const blob = new Blob(chunks.current);
        chunks.current = [];
        const url = URL.createObjectURL(blob);
        setDownloadLink(url);
        await sendVideoToBackend(blob);
    }

    async function sendVideoToBackend(videoBlob) {
        try {
            const formData = new FormData();
            formData.append("file", videoBlob);
            formData.append("id_user", id_user)
            formData.append("class_name", class_name)
            formData.append("class_date", class_date)
            const response = await fetch(`${apiUrl}emotion_recognizer/analyze_video`, {
                method: "POST",
                body: formData
            });
            if (!response.ok) {
                throw new Error("Error al enviar el video al servidor");
            }
            // Leer el cuerpo de la respuesta como JSON
            const responseData = await response.json();
            localStorage.setItem('emotion_resumen', responseData)
            console.log(responseData);
        } catch (error) {
            console.error("Error al enviar el video al servidor:", error);
        }
    }    

    return (
        <div>
            <div className="flex m-3 gap-4 justify-center">
                <select
                    name="videoSource"
                    id="videoSource"
                    value={videoSource}
                    onChange={(event) => setVideoSource(event.target.value)}
                    className="z-10 mt-1 max-h-56 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
                <select
                    name="audioSource"
                    id="audioSource"
                    value={audioSource}
                    onChange={(event) => setAudioSource(event.target.value)}
                    className="z-10 mt-1 max-h-56 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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

            <div className="flex m-4 gap-4 justify-center">
                <div className="w-1/3 m-6 flex justify-center items-center shadow-md">
                    <video ref={videoRef} autoPlay muted playsInline />
                </div>

                {error && <p>{error.message}</p>}

                {downloadLink && (
                    <div className="w-1/3 m-6 flex justify-center shadow-md">
                        <video src={downloadLink} controls />
                    </div>
                )}
            </div>

            <div className="flex m-4 gap-4 justify-center items-center">
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Grabar
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording}
                    className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Parar
                </button>
                {downloadLink && (
                    <button className="inline-block h-8 w-8 rounded-full ring-2 ring-white m-2">
                        <a href={downloadLink} download="file.mp4">
                            <FaArrowCircleDown className="w-8 text-white" />
                        </a>
                    </button>
                )}
            </div>
        </div>
    );
};

export default WebCamRecorder;
