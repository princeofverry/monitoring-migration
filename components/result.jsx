'use client'

import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage, db } from '../lib/firestore';
import { query, ref as dbRef, onValue, limitToLast } from 'firebase/database';

const Result = () => {
    const [camera1Images, setCamera1Images] = useState({
        surface: null,
        underwater: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        const sensorDataRef = query(dbRef(db, '/sensorData'), limitToLast(2));

        const unsubscribe = onValue(sensorDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const sensorValues = Object.values(data);
                setSensorData(sensorValues);
                console.log("Updated Sensor Data: ", sensorValues);
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching data: ", error);
        });

        return () => unsubscribe();
    }, []);

    // Fungsi untuk mengambil gambar dari bucket Firebase Storage
    const fetchImages = async (folderPath, sensorIndex) => {
        try {
            const folderRef = ref(storage, folderPath); // folderPath adalah path ke folder dalam bucket
            const result = await listAll(folderRef);
            const sortedItems = result.items.sort((a, b) => b.name.localeCompare(a.name));
            const latestItem = sortedItems[0]; // Ambil file paling baru
            const imageUrl = await getDownloadURL(latestItem);

            const geotagData = sensorData[sensorIndex] ? {
                day: new Date(sensorData[sensorIndex].timestamp).toLocaleString('en-US', { weekday: 'long' }),
                date: new Date(sensorData[sensorIndex].timestamp).toLocaleDateString('en-GB'),
                time: new Date(sensorData[sensorIndex].timestamp).toLocaleTimeString('en-GB'),
                coordinates: {
                    lat: sensorData[sensorIndex].latitude,
                    lon: sensorData[sensorIndex].longitude,
                },
            } : null;

            return { url: imageUrl, geotag: geotagData };
        } catch (error) {
            console.error(`Error fetching image from ${folderPath}:`, error);
            throw error;
        }
    };

    const fetchLatestImages = async () => {
        try {
            setLoading(true);
            const surfaceImage = await fetchImages('/GreenBox', 0);
            const underwaterImage = await fetchImages('/BlueBox', 1);

            setCamera1Images({
                surface: surfaceImage,
                underwater: underwaterImage,
            });
        } catch (error) {
            setError('Failed to load images.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestImages();
        const interval = setInterval(fetchLatestImages, 5000);

        return () => clearInterval(interval);
    }, [sensorData]);


    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex md:flex-row flex-col gap-8 justify-center mb-4">
                {loading ? (
                    <p>Loading Kamera images...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        {/* Div untuk gambar Surface */}
                        {camera1Images.surface && (
                            <div className="w-[200px] h-[200px] flex flex-col items-center justify-center">
                                <h1>Surface</h1>
                                <div className="mb-4">
                                    <img src={camera1Images.surface.url} alt="Kamera 1 - Surface" className="w-full h-full object-cover" />
                                    <div className="text-black text-xs">
                                        {camera1Images.surface.geotag && (
                                            <>
                                                <p>{camera1Images.surface.geotag.day}</p>
                                                <p>{camera1Images.surface.geotag.date}</p>
                                                <p>{camera1Images.surface.geotag.time}</p>
                                                <p>S {camera1Images.surface.geotag.coordinates.lat}, E {camera1Images.surface.geotag.coordinates.lon}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Div untuk gambar Underwater */}
                        {camera1Images.underwater && (
                            <div className="w-[200px] h-[200px] flex flex-col items-center justify-center">
                                <h1>Under water</h1>
                                <div className="mb-4">
                                    <img src={camera1Images.underwater.url} alt="Kamera 1 - Underwater" className="w-full h-full object-cover" />
                                    <div className="text-black text-xs">
                                        {camera1Images.underwater.geotag && (
                                            <>
                                                <p>{camera1Images.underwater.geotag.day}</p>
                                                <p>{camera1Images.underwater.geotag.date}</p>
                                                <p>{camera1Images.underwater.geotag.time}</p>
                                                <p>S {camera1Images.underwater.geotag.coordinates.lat}, E {camera1Images.underwater.geotag.coordinates.lon}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Result;
