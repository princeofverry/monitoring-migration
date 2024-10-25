"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "../lib/firestore";

const customIcon = new L.Icon({
    iconUrl: "/ship.png",
    iconSize: [20, 20],
    iconAnchor: [12, 25],
    popupAnchor: [1, -34],
});

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
    const [currentTrack, setCurrentTrack] = useState("A");

    useEffect(() => {
        const fetchCoordinates = () => {
            const coordinatesRef = query(ref(db, '/espSensorData'), limitToLast(1));

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
        setCurrentTrack(prevTrack => (prevTrack === "A" ? "B" : "A"));
    };

    // Koordinat untuk lintasan A dan lintasan B
    const ballCoordinatesTrackA = [
        { green: { lat: -7.053805, lon: 110.438335 }, red: { lat: -7.053803, lon: 110.438347 } },
        { green: { lat: -7.053763, lon: 110.438331 }, red: { lat: -7.053766, lon: 110.438356 } },
        // Tambahkan koordinat tambahan untuk lintasan A sesuai kebutuhan
    ];

    const ballCoordinatesTrackB = [
        { green: { lat: -7.053700, lon: 110.438100 }, red: { lat: -7.053710, lon: 110.438120 } },
        { green: { lat: -7.053650, lon: 110.438050 }, red: { lat: -7.053660, lon: 110.438070 } },
        { green: { lat: -7.053600, lon: 110.438000 }, red: { lat: -7.053610, lon: 110.438020 } },
        // Tambahkan koordinat tambahan untuk lintasan B sesuai kebutuhan
    ];

    const ballCoordinates = currentTrack === "A" ? ballCoordinatesTrackA : ballCoordinatesTrackB;

    // Fungsi untuk membuat gridline untuk lintasan A
    const createGridLinesTrackA = () => {
        const latRange = [-7.053800, -7.053600];
        const lonRange = [110.438300, 110.438350];
        const gridLines = [];

        for (let i = 0; i <= 5; i++) {
            const latStep = latRange[0] + ((latRange[1] - latRange[0]) / 5) * i;
            const lonStep = lonRange[0] + ((lonRange[1] - lonRange[0]) / 5) * i;

            gridLines.push([[latStep, lonRange[0]], [latStep, lonRange[1]]]);
            gridLines.push([[latRange[0], lonStep], [latRange[1], lonStep]]);
        }

        return gridLines;
    };

    // Fungsi untuk membuat gridline untuk lintasan B
    const createGridLinesTrackB = () => {
        const latRange = [-7.053700, -7.053500];
        const lonRange = [110.438100, 110.438200];
        const gridLines = [];

        for (let i = 0; i <= 5; i++) {
            const latStep = latRange[0] + ((latRange[1] - latRange[0]) / 5) * i;
            const lonStep = lonRange[0] + ((lonRange[1] - lonRange[0]) / 5) * i;

            gridLines.push([[latStep, lonRange[0]], [latStep, lonRange[1]]]);
            gridLines.push([[latRange[0], lonStep], [latRange[1], lonStep]]);
        }

        return gridLines;
    };

    const gridLines = currentTrack === "A" ? createGridLinesTrackA() : createGridLinesTrackB();

    return (
        <div className="px-6 py-8 rounded-xl flex flex-col md:items-center gap-4">
            <h1 className="mb-6 md:text-xl text-sm text-black font-medium text-center">📍 Monitoring Map Lintasan {currentTrack}</h1>
            <div className="sm:w-[35vw] h-[35vh] shadow-md rounded-xl">
                <MapContainer center={[0, 0]} zoom={1000} style={{ height: "100%", width: "100%", borderRadius: "12px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <AutoZoom coordinates={track} />

                    {gridLines.map((line, index) => (
                        <Polyline key={index} positions={line} color="gray" weight={1} />
                    ))}

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
            <button className="bg-blue-400 text-white hover:bg-blue-600 duration-300 p-2 rounded-lg text-center" onClick={handleTrackChange}>Ganti Lintasan</button>
        </div>
    );
};

export default MonitoringCam;
