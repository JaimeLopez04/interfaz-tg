import { Button } from "keep-react";
import { useEffect, useRef, useState } from "react";
import { BsCameraReelsFill } from "react-icons/bs";
import { FaArrowCircleDown } from "react-icons/fa";


const WebCamRecorder = () => {
    const [audioSource, setAudioSource] = useState("");
    const [videoSource, setVideoSource] = useState("");
    const [audioSourceOptions, setAudioSourceOptions] = useState([])
    const [videoSourceOptions, setVideoSourceOptions] = useState([])
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false)
    const [downloadLink, setDownloadLink] = useState("")

    const chunks = useRef([]);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const streamRecorderRef = useRef(null)

    function startRecording(){
        if(isRecording){
            return
        }
        if(!streamRef.current){
            return
        }

        streamRecorderRef.current =  new MediaRecorder(streamRef.current)
        streamRecorderRef.current.start() 
        streamRecorderRef.current.ondataavailable = function(event) {
            if (chunks.current) {
                chunks.current.push(event.data);
            }
        };

        setIsRecording(true)
    }

    useEffect(() => {
        if (isRecording) {
            return;
        }
        
        if (chunks.current.length === 0) {
            return;
        }
        var blob = new Blob(chunks.current);
        chunks.current = [];
        var url = URL.createObjectURL(blob);
        setDownloadLink(url)
    }, [isRecording]);
    
    function stopRecording(){
        if (!streamRecorderRef.current ) {
            return;
        }

        streamRecorderRef.current.stop();
        setIsRecording(false)
    }

    useEffect(() => {
        async function prepareStream() {

            // Función para manejar el flujo de la cámara
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
                    audio: {
                        deviceId: audioSource !== "" ? { exact: audioSource } : undefined,
                    },
                    video: {
                        deviceId: videoSource !== "" ? { exact: videoSource } : undefined,
                    },
                };

                try {
                    const stream = await navigator.mediaDevices.getUserMedia(constraints);
                    gotStream(stream)
                } 
                
                catch (error) {
                    setError(error);
                }
            }

            function getDevices(){
                return navigator.mediaDevices.enumerateDevices()
            }

            function gotDevices(deviceInfos) {
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
            }

            await getStream();

            const mediaDevices = await getDevices()
            gotDevices(mediaDevices)
        }

        prepareStream();
        
    }, [audioSource, videoSource]);

    const [date, setDate] = useState('');

    useEffect(() => {
        // Función para obtener la fecha actual en el formato YYYY-MM-DD
        const getCurrentDate = () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
            const day = currentDate.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        // Establecer el estado con la fecha actual
        setDate(getCurrentDate());
    }, []); // Se ejecuta solo una vez al montar el component

    return (
        <div>
            <div className="flex m-3 gap-4 justify-center">
                <div>
                    <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
                        Camara de video
                    </label>
                    <select
                        name="videoSource"
                        id="videoSource"
                        value={videoSource}
                        onChange={(event) => setVideoSource(event.target.value)}
                        className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                        {videoSourceOptions.map(option => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
                        Audio
                    </label>
                    <select
                        name="audioSource"
                        id="audioSource"
                        value={audioSource}
                        onChange={(event) => setAudioSource(event.target.value)}
                        className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                        {audioSourceOptions.map(option => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex m-3 gap-4 justify-center">
                <div>
                    <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
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
                    <label htmlFor="nameClass" className="block text-sm font-medium leading-6 text-white">
                        Nombre de la clase
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                            type="text"
                            name="nameClass"
                            id="nameClass"
                            className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Ingrese el nombre de la clase a analizar"
                        />
                    </div>
                </div>
            </div>

            <div className="flex m-4 gap-4 justify-center items-center">
                <Button 
                    size="sm" 
                    color={isRecording ? "error" : "warning"} 
                    onClick={isRecording ? stopRecording : startRecording}>
                    <BsCameraReelsFill className="mr-3" />
                    {isRecording ? 'Parar sesión de hoy' : 'Iniciar sesión de hoy'}
                </Button>
                
                {downloadLink && 
                    <button className="inline-block h-8 w-8 rounded-full ring-2 ring-white m-2">
                        <a 
                        href={downloadLink} 
                        download="file.mp4" 
                        >
                        <FaArrowCircleDown className="w-8 text-white" />
                        </a>
                    </button>}
            </div>

            <div className="flex m-4 gap-4 justify-center">
                <div className="w-1/3 m-6 flex justify-center items-center shadow-md">
                    <video ref={videoRef} autoPlay muted playsInline></video>
                </div>

                {error && <p>{error.message}</p>}

                {downloadLink && <div className="w-1/3 m-6 flex justify-center shadow-md">
                    <video src={downloadLink} controls></video>                    
                </div>}
            </div>

            <div className="flex m-4 gap-4 justify-center items-center">
                {/* <button 
                    onClick={startRecording} 
                    disabled={isRecording}
                    className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Grabar
                </button>
                <button 
                    onClick={stopRecording} 
                    disabled={!isRecording}
                    className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Parar
                </button> */}
                
            </div>
        </div>
    );
};

export default WebCamRecorder;