"use client"

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../lib/firestore";

// Importing icons from public folder
const customIcon = new L.Icon({
    iconUrl: "/ship.png",
    iconSize: [20, 20],
    iconAnchor: [12, 25],
    popupAnchor: [1, -34],
});

// Icon hijau dan merah untuk gimmick bola
const greenIcon = new L.Icon({
    iconUrl: "/green-ball.png",
    iconSize: [5, 5],
    iconAnchor: [7, 7],
    popupAnchor: [1, -34],
});

const redIcon = new L.Icon({
    iconUrl: "/red-ball.png",
    iconSize: [5, 5],
    iconAnchor: [7, 7],
    popupAnchor: [1, -34],
});

// Component to auto-zoom to markers and track the path
const AutoZoom = ({ coordinates }) => {
    const map = useMap();

    useEffect(() => {
        if (coordinates.length > 0) {
            const bounds = coordinates.map(coord => [coord.lat, coord.lon]);
            map.fitBounds(bounds);
        }
    }, [coordinates, map]);

    return null;
};

const MonitoringCam = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [track, setTrack] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(1);

    useEffect(() => {
        const fetchCoordinates = () => {
            const coordinatesRef = query(ref(db, '/sensorData'), limitToLast(1));

            onValue(coordinatesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const latestCoordinates = Object.values(data).map(item => ({
                        lat: item.latitude,
                        lon: item.longitude,
                    }));

                    setCoordinates(latestCoordinates);
                    setTrack(prevTrack => [...prevTrack, ...latestCoordinates]);
                } else {
                    console.error("No data available");
                }
            }, (error) => {
                console.error(error);
            });
        };

        fetchCoordinates();
    }, []);

    const handleTrackChange = () => {
        setCurrentTrack(prevTrack => (prevTrack === 1 ? 2 : 1));
    };

    // Koordinat untuk lintasan 1 dan lintasan 2
    const ballCoordinatesTrack1 = [
        { green: { lat: -7.053805, lon: 110.438335 }, red: { lat: -7.053803, lon: 110.438347 } },
        { green: { lat: -7.053763, lon: 110.438331 }, red: { lat: -7.053766, lon: 110.438356 } },
        { green: { lat: -7.053720, lon: 110.438327 }, red: { lat: -7.053723, lon: 110.438365 } },
        { green: { lat: -7.053680, lon: 110.438320 }, red: { lat: -7.053682, lon: 110.438362 } },
        { green: { lat: -7.053640, lon: 110.438314 }, red: { lat: -7.053643, lon: 110.438358 } },
        { green: { lat: -7.053600, lon: 110.438309 }, red: { lat: -7.053603, lon: 110.438354 } },
        { green: { lat: -7.053560, lon: 110.438303 }, red: { lat: -7.053563, lon: 110.438350 } },
        { green: { lat: -7.053520, lon: 110.438298 }, red: { lat: -7.053523, lon: 110.438347 } },
        { green: { lat: -7.053480, lon: 110.438292 }, red: { lat: -7.053483, lon: 110.438344 } },
        { green: { lat: -7.053440, lon: 110.438286 }, red: { lat: -7.053443, lon: 110.438341 } }
        // ... (tambahkan koordinat lainnya untuk lintasan 1)
    ];

    const ballCoordinatesTrack2 = [
        { green: { lat: -7.053763, lon: 110.438331 }, red: { lat: -7.053766, lon: 110.438356 } },
        // ... (tambahkan koordinat lainnya untuk lintasan 2)
    ];

    const ballCoordinates = currentTrack === 1 ? ballCoordinatesTrack1 : ballCoordinatesTrack2;

    return (
        <div className="px-6 py-8 rounded-xl flex flex-col md:items-center gap-4">
            <h1 className="mb-6 md:text-xl text-sm text-black font-medium text-center">📍 Monitoring Map Lintasan {currentTrack}</h1>
            <div className="sm:w-[35vw] h-[35vh] shadow-md rounded-xl">
                <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%", borderRadius: "12px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <AutoZoom coordinates={track} />

                    {track.length > 1 && (
                        <Polyline
                            positions={track.map(coord => [coord.lat, coord.lon])}
                            color="blue"
                            weight={3}
                        />
                    )}

                    {coordinates.map((coord, index) => (
                        <Marker
                            key={index}
                            position={[coord.lat, coord.lon]}
                            icon={customIcon}
                            riseOnHover={true}
                        >
                            <Popup>
                                Kapal #{index + 1}: Latitude: {coord.lat}, Longitude: {coord.lon}
                            </Popup>
                        </Marker>
                    ))}

                    {ballCoordinates.map((ball, index) => (
                        <React.Fragment key={index}>
                            <Marker
                                position={[ball.green.lat, ball.green.lon]}
                                icon={greenIcon}
                            >
                                <Popup>
                                    Bola Hijau #{index + 1}
                                </Popup>
                            </Marker>
                            <Marker
                                position={[ball.red.lat, ball.red.lon]}
                                icon={redIcon}
                            >
                                <Popup>
                                    Bola Merah #{index + 1}
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
            <button className="bg-blue-400 p-2 rounded-lg text-center" onClick={handleTrackChange}>Ganti Lintasan</button>
        </div>
    );
};

export default MonitoringCam;