import React, { useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FaCamera, FaImage } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Scanner() {
    const [details, setDetails] = useState(null);
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const html5QrcodeRef = useRef(null); 

    function onScanSuccess(decodedText) {
        try {
            const parsedDetail = JSON.parse(decodedText);
            console.log(parsedDetail);
            setDetails(parsedDetail);
            let result = Object.keys(parsedDetail).map((key) => parsedDetail[key]);
            console.log(result);
            stopCamera(); 
        } catch (error) {
            console.error('Error parsing QR code data:', error);
        }
    }

    function onScanFailure(error) {
        console.error('Scan failed:', error);
    }

    const initializeCamera = () => {
        const html5Qrcode = new Html5Qrcode("reader");
        html5QrcodeRef.current = html5Qrcode; // Store the instance in the ref
        const config = { fps: 20, qrbox: { width: 150, height: 150 } }; // Smaller box for contact

        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    const cameraId = devices[1] ? devices[1].id : devices[0].id; // Use the first camera
                    return html5Qrcode.start(
                        cameraId,
                        config,
                        onScanSuccess,
                        onScanFailure
                    );
                }
                throw new Error('No cameras found');
            })
            .then(() => {
                setIsCameraInitialized(true);
            })
            .catch(err => {
                console.error('Camera access error:', err);
                setCameraError('Failed to initialize camera. Please ensure camera access is allowed.');
            });
    };

    const stopCamera = () => {
        if (html5QrcodeRef.current) {
            html5QrcodeRef.current.stop().then(() => {
                console.log('Camera stopped');
                setIsCameraInitialized(false); // Reset camera initialization state
            }).catch(err => {
                console.error('Failed to stop camera:', err);
            });
        }
    };

    const handleImageScan = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const newScanner = new Html5Qrcode("reader");
            const decodedText = await newScanner.scanFile(file, true);
            console.log(decodedText);
            onScanSuccess(decodedText);
        } catch (err) {
            setCameraError('Invalid QR code in image');
        }
    };

    const handleScanAgain = () => {
        setDetails(null);
        setIsCameraInitialized(false)
        stopCamera(); 
    };

    return (
        <>
            {!details && (
                <div className="scanner-container">
                    {
                        !isCameraInitialized  &&
                         <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-6 text-center">
                        {/* Heading */}
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold mb-6"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            Vehicle Owner QR Scanner
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            Scan the code to get owner details. Use your camera to scan instantly or upload an image.
                        </motion.p>

                        {/* Buttons */}
                       
                            <motion.div
                                className="flex flex-col md:flex-row items-center justify-center gap-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                {/* Camera Button */}
                                <button
                                    onClick={initializeCamera}
                                    className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                                >
                                    <FaCamera className="text-4xl mb-2" />
                                    <span className="text-lg font-medium">Scan with Camera</span>
                                </button>
                                {/* Image Upload Button */}
                                <label className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                                    <FaImage className="text-4xl mb-2" />
                                    <span className="text-lg font-medium">Upload QR Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageScan}
                                    />
                                </label>
                            </motion.div>
                        
                    </div>
                    }

                    <div
                        id="reader"
                        style={{
                            position: 'relative',
                            background: 'black'
                        }}
                    >
                    </div>

                  {
                    isCameraInitialized &&   
                    <label className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
                    <FaImage className="text-4xl mb-2" />
                    <span className="text-lg font-medium">Upload QR Image</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageScan}
                    />
                </label>
                  }
                    
                </div>
            )}

{details && (
    <div className="flex flex-col items-center">
        <motion.article
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 max-w-sm mx-auto mt-24 shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <motion.img
                src="https://ww2.comsats.edu.pk/ee_swl/slides/2.jpg"
                alt="Comsats University Sahiwal"
                className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>

            {/* Profile Picture (Conditional Rendering) */}
            {details.imageUrl && (
                <motion.div
                    className="absolute top-5 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <motion.img
                        src={details.imageUrl}
                        alt="Profile Picture"
                        className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.div>
            )}

            <motion.div
                className="z-10 space-y-2 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
            >
                {/* Name (Conditional Rendering) */}
                {details.name && (
                    <motion.h3
                        className="text-3xl font-bold text-white"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                    >
                        {details.name}
                    </motion.h3>
                )}

                {/* contact Number (Conditional Rendering) */}
                {details.contact && (
                   <a href= {details.contact.includes('@') ? `mailto:${details.contact}` : `tel:${details.contact}` }>
                     <motion.div
                        className="flex items-center justify-center gap-2 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1.1 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span>{details.contact}</span>
                    </motion.div>
                   </a>
                )}

                {/* Department (Conditional Rendering) */}
                {details.dept && (
                    <motion.div
                        className="flex items-center justify-center gap-2 text-sm text-gray-300"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1.3 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        <span>{details.dept}</span>
                    </motion.div>
                )}
            </motion.div>
        </motion.article>
        {/* Scan Again Button */}
        <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
        >
            <button
                onClick={handleScanAgain}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
                Scan Again
            </button>
        </motion.div>

     
    </div>
)}
        </>
    );
}