'use client'
import React, { useEffect, useState } from "react";
// import Footer from "./footer";
// import MonitoringCam from "./monitoring";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../lib/firestore";
// import Result from "./result";

const Circular = () => {
    const [sensorData, setSensorData] = useState(null); // State untuk menyimpan data terbaru

    useEffect(() => {
        const sensorDataRef = query(ref(db, '/espSensorData'), limitToLast(1)); // Query untuk mengambil data terbaru

        // Memasang listener untuk memantau perubahan data
        const unsubscribe = onValue(sensorDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const latestData = Object.values(data)[0]; // Ambil data terbaru dari object
                setSensorData(latestData); // Update state dengan data terbaru
                console.log("Updated Sensor Data: ", latestData); // Log data ke console
            } else {
                console.log("No data available");
            }
        }, (error) => {
            console.error("Error fetching data: ", error); // Handle error jika ada
        });

        // Cleanup listener ketika komponen di-unmount
        return () => unsubscribe();

    }, []); // Hanya jalankan sekali saat komponen di-mount

    return (
        <>
            <div className="flex md:flex-row flex-col justify-center items-center md:gap-8 md:my-16 my-4 h-full">
                <div>
                    {/* <h1 className="text-center mb-2 font-semibold text-2xl">Lintasan A/B</h1> */}
                    {/* <MonitoringCam /> */}
                </div>
                <div className="flex flex-col items-center md:gap-8">
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col items-center text-lg">
                            <h1 className="font-semibold mb-2">Longitude</h1>
                            <div className="border border-gray-500 rounded-3xl p-2">
                                {sensorData ? sensorData.longitude : "Loading..."}
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-lg">
                            <h1 className="font-semibold mb-2">Latitude</h1>
                            <div className="border border-gray-500 rounded-3xl p-2">
                                {sensorData ? sensorData.latitude : "Loading..."}
                            </div>
                        </div>
                        <div className="flex flex-col items-center text-lg">
                            <p className="font-semibold mb-2">Voltase Batre</p>
                            <div className="border border-gray-500 rounded-3xl p-2">
                                14.8 V
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-x-12 md:text-lg text-base">
                        <div className="flex flex-col items-center gap-2">
                            <p className="font-semibold">COG</p>
                            <div className="border border-gray-500 md:text-lg text-sm md:w-20 md:h-20 w-16 h-16 rounded-full flex items-center justify-center">
                                {sensorData ? `${sensorData.heading}°` : "Loading..."}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="font-semibold">SOG</p>
                            <div className="border border-gray-500 text-sm md:w-20 md:h-20 w-16 h-16 rounded-full flex items-center justify-center">
                                {sensorData ? `${(sensorData.speed_ms / 0.514444).toFixed(2)} knot` : "Loading..."}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <p className="font-semibold">SOG</p>
                            <div className="border border-gray-500 text-sm md:w-20 md:h-20 w-16 h-16 rounded-full flex items-center justify-center">
                                {sensorData ? `${(sensorData.speed_ms * 3.6).toFixed(2)} km/h` : "Loading..."}
                            </div>
                        </div>
                    </div>
                    <h1>
                        Latest data: {sensorData ? sensorData.timestamp : "Loading..."}
                    </h1>
                </div>
                {/* <Result /> */}
            </div>
            {/* <Footer /> */}
        </>
    );
};

export default Circular;