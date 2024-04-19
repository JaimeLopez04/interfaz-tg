import { useEffect, useRef, useState } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
import fetch from 'isomorphic-fetch';
import { apiUrl } from "../api/apiUrl";
import { Button } from "keep-react";
import { BsCameraReelsFill } from "react-icons/bs";


const WebCamRecorder = () => {
    const [audioSource, setAudioSource] = useState("");
    const [videoSource, setVideoSource] = useState("");
    const [audioSourceOptions, setAudioSourceOptions] = useState([]);
    const [videoSourceOptions, setVideoSourceOptions] = useState([]);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [downloadLink, setDownloadLink] = useState("");
    const [date, setDate] = useState('');
    const [class_name, setClassName] = useState('');


    const chunks = useRef([]);
    const streamRef = useRef(null);
    const videoRef = useRef(null);
    const streamRecorderRef = useRef(null);
    const id_user = JSON.parse(localStorage.getItem('data')).id_user
    const class_date = date


    const handleInputChange = (event) => {
        setClassName(event.target.value);
    };

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
                    <video ref={videoRef} autoPlay muted playsInline />
                </div>

                {error && <p>{error.message}</p>}

                {downloadLink && (
                    <div className="w-1/3 m-6 flex justify-center shadow-md">
                        <video src={downloadLink} controls />
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebCamRecorder;


// import { useEffect, useRef, useState } from "react";
// import { FaArrowCircleDown } from "react-icons/fa";
// import fetch from 'isomorphic-fetch';
// import { apiUrl } from "../api/apiUrl";
// import { Button } from "keep-react";
// import { BsCameraReelsFill } from "react-icons/bs";

// const WebCamRecorder = () => {
//     const [audioSource, setAudioSource] = useState("");
//     const [videoSource, setVideoSource] = useState("");
//     const [audioSourceOptions, setAudioSourceOptions] = useState([]);
//     const [videoSourceOptions, setVideoSourceOptions] = useState([]);
//     const [error, setError] = useState(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const [downloadLink, setDownloadLink] = useState("");
//     const [date, setDate] = useState('');
//     const [class_name, setClassName] = useState('');

//     const chunks = useRef([]);
//     const streamRef = useRef(null);
//     const videoRef = useRef(null);
//     const id_user = JSON.parse(localStorage.getItem('data')).id_user
//     const class_date = date

//     const handleInputChange = (event) => {
//         setClassName(event.target.value);
//     };

//     useEffect(() => {
//         async function prepareStream() {
//             function gotStream(stream) {
//                 streamRef.current = stream;
//                 if (videoRef.current) {
//                     videoRef.current.srcObject = stream;
//                 }
//             }

//             async function getStream() {
//                 if (streamRef.current) {
//                     streamRef.current.getTracks().forEach((track) => track.stop());
//                 }

//                 const constraints = {
//                     audio: { deviceId: audioSource !== "" ? { exact: audioSource } : undefined },
//                     video: { deviceId: videoSource !== "" ? { exact: videoSource } : undefined }
//                 };

//                 try {
//                     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//                     gotStream(stream);
//                 } catch (error) {
//                     setError(error);
//                 }
//             }

//             function gotDevices(deviceInfos) {
//                 const audioSourceOptions = [];
//                 const videoSourceOptions = [];
//                 for (const deviceInfo of deviceInfos) {
//                     if (deviceInfo.kind === "audioinput") {
//                         audioSourceOptions.push({
//                             value: deviceInfo.deviceId,
//                             label: deviceInfo.label || `Microphone ${deviceInfo.deviceId}`
//                         });
//                     } else if (deviceInfo.kind === "videoinput") {
//                         videoSourceOptions.push({
//                             value: deviceInfo.deviceId,
//                             label: deviceInfo.label || `Camera ${deviceInfo.deviceId}`
//                         });
//                     }
//                 }
//                 setAudioSourceOptions(audioSourceOptions);
//                 setVideoSourceOptions(videoSourceOptions);
//             }

//             await getStream();

//             const mediaDevices = await navigator.mediaDevices.enumerateDevices();
//             gotDevices(mediaDevices);
//         }

//         prepareStream();
//     }, [audioSource, videoSource]);

//     async function startRecording() {
//         if (isRecording || !streamRef.current) return;
//         chunks.current = []; // Limpiar los chunks
//         const recorder = new MediaRecorder(streamRef.current);
//         recorder.ondataavailable = function (event) {
//             chunks.current.push(event.data);
//         };
//         recorder.onstop = async function () {
//             const blob = new Blob(chunks.current);
//             chunks.current = [];
//             const url = URL.createObjectURL(blob);
//             setDownloadLink(url);
//             await sendVideoToBackend(blob);
//             setIsRecording(false);
//         };
//         recorder.start();
//         setIsRecording(true);
//     }

//     async function stopRecording() {
//         if (!streamRef.current) return;
//         streamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     async function sendVideoToBackend(videoBlob) {
//         try {
//             const formData = new FormData();
//             formData.append("file", videoBlob);
//             formData.append("id_user", id_user)
//             formData.append("class_name", class_name)
//             formData.append("class_date", class_date)
//             const response = await fetch(`${apiUrl}emotion_recognizer/analyze_video`, {
//                 method: "POST",
//                 body: formData
//             });
//             if (!response.ok) {
//                 throw new Error("Error al enviar el video al servidor");
//             }
//             // Leer el cuerpo de la respuesta como JSON
//             const responseData = await response.json();
//             localStorage.setItem('emotion_resumen', responseData)
//             console.log(responseData);
//         } catch (error) {
//             console.error("Error al enviar el video al servidor:", error);
//         }
//     }    

//     useEffect(() => {
//         // Función para obtener la fecha actual en el formato YYYY-MM-DD
//         const getCurrentDate = () => {
//             const currentDate = new Date();
//             const year = currentDate.getFullYear();
//             const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//             const day = currentDate.getDate().toString().padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         };

//         // Establecer el estado con la fecha actual
//         setDate(getCurrentDate());
//     }, []); // Se ejecuta solo una vez al montar el component

//     return (
//         <div>
//             <div className="flex m-3 gap-4 justify-center">
//             <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Camara de video
//                     </label>
//                     <select
//                         name="videoSource"
//                         id="videoSource"
//                         value={videoSource}
//                         onChange={(event) => setVideoSource(event.target.value)}
//                         className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
//                     >
//                         {videoSourceOptions.map(option => (
//                             <option 
//                                 key={option.value} 
//                                 value={option.value}
//                                 className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Audio
//                     </label>
//                     <select
//                         name="audioSource"
//                         id="audioSource"
//                         value={audioSource}
//                         onChange={(event) => setAudioSource(event.target.value)}
//                         className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
//                     >
//                         {audioSourceOptions.map(option => (
//                             <option 
//                                 key={option.value} 
//                                 value={option.value}
//                                 className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div className="flex m-3 gap-4 justify-center items-center">
//                 <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Fecha de la clase
//                     </label>
//                     <div className="relative mt-2 rounded-md shadow-sm">
//                         <input
//                             type="date"
//                             name="dateClass"
//                             id="dateClass"
//                             className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             value={date} // Establecer el valor del input con el estado date
//                             readOnly // Para evitar que el usuario cambie la fecha
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="nameClass" className="block text-sm font-medium leading-6 text-white">
//                         Nombre de la clase
//                     </label>
//                     <div className="relative mt-2 rounded-md shadow-sm">
//                         <input
//                             type="text"
//                             name="nameClass"
//                             id="nameClass"
//                             value={class_name}
//                             onChange={handleInputChange} // Asignamos el controlador de eventos al evento onChange
//                             className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             placeholder="Ingrese el nombre de la clase a analizar"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="flex m-4 gap-4 justify-center items-center">
//                 <Button 
//                     size="sm" 
//                     color={isRecording ? "error" : "warning"} 
//                     onClick={isRecording ? stopRecording : startRecording}>
//                     <BsCameraReelsFill className="mr-3" />
//                     {isRecording ? 'Parar sesión de hoy' : 'Iniciar sesión de hoy'}
//                 </Button>
                
//                 {downloadLink && 
//                     <button className="inline-block h-8 w-8 rounded-full ring-2 ring-white m-2">
//                         <a 
//                         href={downloadLink} 
//                         download="file.mp4" 
//                         >
//                         <FaArrowCircleDown className="w-8 text-white" />
//                         </a>
//                     </button>}
//             </div>

//             <div className="flex m-4 gap-4 justify-center">
//                 <div className="w-1/3 m-6 flex justify-center items-center shadow-md">
//                     <video ref={videoRef} autoPlay muted playsInline />
//                 </div>

//                 {error && <p>{error.message}</p>}

//                 {downloadLink && (
//                     <div className="w-1/3 m-6 flex justify-center shadow-md">
//                         <video src={downloadLink} controls />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WebCamRecorder;

// import { useEffect, useRef, useState } from "react";
// import { FaArrowCircleDown } from "react-icons/fa";
// import fetch from 'isomorphic-fetch';
// import { apiUrl } from "../api/apiUrl";
// import { Button } from "keep-react";
// import { BsCameraReelsFill } from "react-icons/bs";

// const WebCamRecorder = () => {
//     const [audioSource, setAudioSource] = useState("");
//     const [videoSource, setVideoSource] = useState("");
//     const [audioSourceOptions, setAudioSourceOptions] = useState([]);
//     const [videoSourceOptions, setVideoSourceOptions] = useState([]);
//     const [error, setError] = useState(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const [downloadLink, setDownloadLink] = useState("");
//     const [date, setDate] = useState('');
//     const [class_name, setClassName] = useState('');

//     const chunks = useRef([]);
//     const streamRef = useRef(null);
//     const videoRef = useRef(null);
//     const mediaRecorderRef = useRef(null);
//     const id_user = JSON.parse(localStorage.getItem('data')).id_user;
//     const class_date = date;

//     const handleInputChange = (event) => {
//         setClassName(event.target.value);
//     };

//     useEffect(() => {
//         async function prepareStream() {
//             async function getStream() {
//                 if (streamRef.current) {
//                     streamRef.current.getTracks().forEach((track) => track.stop());
//                 }

//                 const constraints = {
//                     audio: { deviceId: audioSource !== "" ? { exact: audioSource } : undefined },
//                     video: { deviceId: videoSource !== "" ? { exact: videoSource } : undefined }
//                 };

//                 try {
//                     const stream = await navigator.mediaDevices.getUserMedia(constraints);
//                     streamRef.current = stream;
//                     if (videoRef.current) {
//                         videoRef.current.srcObject = stream;
//                     }
//                 } catch (error) {
//                     setError(error);
//                 }
//             }

//             function gotDevices(deviceInfos) {
//                 const audioSourceOptions = [];
//                 const videoSourceOptions = [];
//                 for (const deviceInfo of deviceInfos) {
//                     if (deviceInfo.kind === "audioinput") {
//                         audioSourceOptions.push({
//                             value: deviceInfo.deviceId,
//                             label: deviceInfo.label || `Microphone ${deviceInfo.deviceId}`
//                         });
//                     } else if (deviceInfo.kind === "videoinput") {
//                         videoSourceOptions.push({
//                             value: deviceInfo.deviceId,
//                             label: deviceInfo.label || `Camera ${deviceInfo.deviceId}`
//                         });
//                     }
//                 }
//                 setAudioSourceOptions(audioSourceOptions);
//                 setVideoSourceOptions(videoSourceOptions);
//             }

//             await getStream();

//             const mediaDevices = await navigator.mediaDevices.enumerateDevices();
//             gotDevices(mediaDevices);
//         }

//         prepareStream();
//     }, [audioSource, videoSource]);

//     async function startRecording() {
//         if (isRecording || !streamRef.current) return;
//         mediaRecorderRef.current = new MediaRecorder(streamRef.current);
//         mediaRecorderRef.current.ondataavailable = function (event) {
//             chunks.current.push(event.data);
//         };
//         mediaRecorderRef.current.onstop = async function () {
//             const blob = new Blob(chunks.current);
//             chunks.current = [];
//             const url = URL.createObjectURL(blob);
//             setDownloadLink(url);
//             await sendVideoToBackend(blob);
//         };
//         mediaRecorderRef.current.start();
//         setIsRecording(true);
//     }

//     async function stopRecording() {
//         if (!isRecording || !mediaRecorderRef.current) return;
//         mediaRecorderRef.current.stop();
//         setIsRecording(false);
//         // Detener el stream de la cámara
//         if (streamRef.current) {
//             streamRef.current.getTracks().forEach(track => track.stop());
//             streamRef.current = null;
//         }
//         // Reiniciar la captura de la cámara
//         await prepareStream();
//     }

//     async function sendVideoToBackend(videoBlob) {
//         try {
//             const formData = new FormData();
//             formData.append("file", videoBlob);
//             formData.append("id_user", id_user);
//             formData.append("class_name", class_name);
//             formData.append("class_date", class_date);
//             const response = await fetch(`${apiUrl}emotion_recognizer/analyze_video`, {
//                 method: "POST",
//                 body: formData
//             });
//             if (!response.ok) {
//                 throw new Error("Error al enviar el video al servidor");
//             }
//             // Leer el cuerpo de la respuesta como JSON
//             const responseData = await response.json();
//             localStorage.setItem('emotion_resumen', responseData);
//             console.log(responseData);
//         } catch (error) {
//             console.error("Error al enviar el video al servidor:", error);
//         }
//     }    

//     useEffect(() => {
//         // Función para obtener la fecha actual en el formato YYYY-MM-DD
//         const getCurrentDate = () => {
//             const currentDate = new Date();
//             const year = currentDate.getFullYear();
//             const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
//             const day = currentDate.getDate().toString().padStart(2, '0');
//             return `${year}-${month}-${day}`;
//         };

//         // Establecer el estado con la fecha actual
//         setDate(getCurrentDate());
//     }, []); // Se ejecuta solo una vez al montar el componente

//     return (
//         <div>
//             <div className="flex m-3 gap-4 justify-center">
//                 <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Camara de video
//                     </label>
//                     <select
//                         name="videoSource"
//                         id="videoSource"
//                         value={videoSource}
//                         onChange={(event) => setVideoSource(event.target.value)}
//                         className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
//                     >
//                         {videoSourceOptions.map(option => (
//                             <option 
//                                 key={option.value} 
//                                 value={option.value}
//                                 className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Audio
//                     </label>
//                     <select
//                         name="audioSource"
//                         id="audioSource"
//                         value={audioSource}
//                         onChange={(event) => setAudioSource(event.target.value)}
//                         className="z-10 mt-1 max-h-56 w-80 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
//                     >
//                         {audioSourceOptions.map(option => (
//                             <option 
//                                 key={option.value} 
//                                 value={option.value}
//                                 className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9">
//                                 {option.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//             </div>

//             <div className="flex m-3 gap-4 justify-center items-center">
//                 <div>
//                     <label htmlFor="dateClass" className="block text-sm font-medium leading-6 text-white">
//                         Fecha de la clase
//                     </label>
//                     <div className="relative mt-2 rounded-md shadow-sm">
//                         <input
//                             type="date"
//                             name="dateClass"
//                             id="dateClass"
//                             className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             value={date} // Establecer el valor del input con el estado date
//                             readOnly // Para evitar que el usuario cambie la fecha
//                         />
//                     </div>
//                 </div>

//                 <div>
//                     <label htmlFor="nameClass" className="block text-sm font-medium leading-6 text-white">
//                         Nombre de la clase
//                     </label>
//                     <div className="relative mt-2 rounded-md shadow-sm">
//                         <input
//                             type="text"
//                             name="nameClass"
//                             id="nameClass"
//                             value={class_name}
//                             onChange={handleInputChange} // Asignamos el controlador de eventos al evento onChange
//                             className="block rounded-md border-0 py-1.5 px-3 w-80 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                             placeholder="Ingrese el nombre de la clase a analizar"
//                         />
//                     </div>
//                 </div>
//             </div>

//             <div className="flex m-4 gap-4 justify-center items-center">
//                 <Button 
//                     size="sm" 
//                     color={isRecording ? "error" : "warning"} 
//                     onClick={isRecording ? stopRecording : startRecording}>
//                     <BsCameraReelsFill className="mr-3" />
//                     {isRecording ? 'Parar sesión de hoy' : 'Iniciar sesión de hoy'}
//                 </Button>
                
//                 {downloadLink && 
//                     <button className="inline-block h-8 w-8 rounded-full ring-2 ring-white m-2">
//                         <a 
//                         href={downloadLink} 
//                         download="file.mp4" 
//                         >
//                         <FaArrowCircleDown className="w-8 text-white" />
//                         </a>
//                     </button>}
//             </div>

//             <div className="flex m-4 gap-4 justify-center">
//                 <div className="w-1/3 m-6 flex justify-center items-center shadow-md">
//                     <video ref={videoRef} autoPlay muted playsInline />
//                 </div>

//                 {error && <p>{error.message}</p>}

//                 {downloadLink && (
//                     <div className="w-1/3 m-6 flex justify-center shadow-md">
//                         <video src={downloadLink} controls />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WebCamRecorder;
