'use client'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database"; // Pastikan Firebase sudah terkonfigurasi dengan benar
import Time from './time';

const Mission = () => {
    const [ball, setBall] = useState(null); // State untuk menyimpan data dari Firebase
    const [start, setStart] = useState(false); // State untuk status 'start'
    const [finish, setFinish] = useState(false); // State untuk status 'finish'

    useEffect(() => {
        const db = getDatabase();

        // Referensi untuk 'ball'
        const ballRef = ref(db, '/state/ball');
        const startRef = ref(db, '/state/start');
        const finishRef = ref(db, '/state/finish');

        // Mengambil data ball dengan auto-update
        const unsubscribeBall = onValue(ballRef, (snapshot) => {
            const data = snapshot.val();
            setBall(data);
        });

        // Mengambil data start dengan auto-update
        const unsubscribeStart = onValue(startRef, (snapshot) => {
            const data = snapshot.val();
            setStart(data);
        });

        // Mengambil data finish dengan auto-update
        const unsubscribeFinish = onValue(finishRef, (snapshot) => {
            const data = snapshot.val();
            setFinish(data);
        });

        // Membersihkan listener ketika komponen unmount
        return () => {
            unsubscribeBall();
            unsubscribeStart();
            unsubscribeFinish();
        };
    }, []);

    return (
        <div className='shadow p-4'>
            <div className='text-center'>Mission</div>
            <p style={{ fontWeight: start ? 'bold' : 'normal' }}>Start</p>
            <p>Floating Ball {ball !== null ? ball : 'Loading...'}</p>
            <p style={{ fontWeight: finish ? 'bold' : 'normal' }}>Finish</p>
            <Time />
        </div>
    );
};

export default Mission;
