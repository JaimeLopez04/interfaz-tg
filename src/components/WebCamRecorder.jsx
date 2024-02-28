import { useEffect, useRef, useState } from "react";
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

    // function startRecording(){
    //     if(isRecording){
    //         return
    //     }
    //     if(!streamRef.current){
    //         return
    //     }

    //     streamRecorderRef.current =  new MediaRecorder(streamRef.current)
    //     streamRecorderRef.current.start() 
    //     streamRecorderRef.current.ondataavailable = function(event) {
    //         if (chunks.current) {
    //             chunks.current.push(event.data);
    //         }
    //     };

    //     setIsRecording(true)
    // }

    // useEffect(() => {
    //     if (isRecording) {
    //         return;
    //     }
        
    //     if (chunks.current.length === 0) {
    //         return;
    //     }
    //     var blob = new Blob(chunks.current);
    //     chunks.current = [];
    //     var url = URL.createObjectURL(blob);
    //     setDownloadLink(url)
    // }, [isRecording]);
    
    // function stopRecording(){
    //     if (!streamRecorderRef.current ) {
    //         return;
    //     }

    //     streamRecorderRef.current.stop();
    //     setIsRecording(false)
    // }

    function startRecording() {
        if (isRecording) {
            return;
        }
        if (!streamRef.current) {
            return;
        }
        streamRecorderRef.current = new MediaRecorder(streamRef.current);
        streamRecorderRef.current.start();
        console.log(streamRecorderRef.current);
    
        streamRecorderRef.current.ondataavailable = function (event) {
            chunks.current.push(event.data);
        };
    console.log(streamRecorderRef.current.ondataavailable);
    console.log(chunks.current);
        setIsRecording(true);
    }
    
    function stopRecording() {

        console.log(chunks);
        console.log(streamRecorderRef.current);
        console.log(isRecording);
        if (!streamRecorderRef.current) {
            return;
        }
    
        // Procesar el video después de detener la grabación
        processVideo();

        streamRecorderRef.current.stop();
        setIsRecording(false);
    
        
    }
    
    function processVideo() {
        if (chunks.current.length === 0) {
            return;
        }

        console.log('Holi process');
        var blob = new Blob(chunks.current);
        chunks.current = [];
        var url = URL.createObjectURL(blob);
        setDownloadLink(url);
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
                    {videoSourceOptions.map(option => (
                        <option 
                            key={option.value} 
                            value={option.value}
                            className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
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
                <button 
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
                </button>
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
        </div>
    );
};

export default WebCamRecorder;