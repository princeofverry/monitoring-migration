'use client'
import React, { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { db } from "@/lib/firestore";

const Aterkia = () => {
  const [ball, setBall] = useState(0);
  const [start, setStart] = useState(false);
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    // Real-time listener untuk 'ball'
    const ballRef = ref(db, '/state/ball');
    const unsubscribeBall = onValue(ballRef, (snapshot) => {
      setBall(snapshot.val() || 0);
    });

    // Real-time listener untuk 'start'
    const startRef = ref(db, '/state/start');
    const unsubscribeStart = onValue(startRef, (snapshot) => {
      setStart(snapshot.val() || false);
    });

    // Real-time listener untuk 'finish'
    const finishRef = ref(db, '/state/finish');
    const unsubscribeFinish = onValue(finishRef, (snapshot) => {
      setFinish(snapshot.val() || false);
    });

    // Bersihkan listener saat komponen tidak digunakan lagi
    return () => {
      unsubscribeBall();
      unsubscribeStart();
      unsubscribeFinish();
    };
  }, []);

  // Fungsi untuk mengubah nilai 'ball' di Firebase
  const updateBall = async (e) => {
    const newBall = Number(e.target.value);
    try {
      await set(ref(db, '/state/ball'), newBall);
    } catch (error) {
      console.error("Error updating ball:", error);
    }
  };

  // Fungsi untuk mengubah status 'start' di Firebase
  const updateStart = async () => {
    const newStart = !start;
    try {
      await set(ref(db, '/state/start'), newStart);
    } catch (error) {
      console.error("Error updating start:", error);
    }
  };

  // Fungsi untuk mengubah status 'finish' di Firebase
  const updateFinish = async () => {
    const newFinish = !finish;
    try {
      await set(ref(db, '/state/finish'), newFinish);
    } catch (error) {
      console.error("Error updating finish:", error);
    }
  };

  return (
    <div className="shadow p-4">
      <div className="mt-4">
        <label htmlFor="ball" className="block mb-2">Ball (Number):</label>
        <input
          type="number"
          id="ball"
          value={ball}
          onChange={updateBall}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mt-4">
        <label className="block mb-2">Start (Boolean):</label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={start}
            onChange={updateStart}
            className="mr-2"
          />
          Toggle Start
        </label>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Finish (Boolean):</label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={finish}
            onChange={updateFinish}
            className="mr-2"
          />
          Toggle Finish
        </label>
      </div>
    </div>
  );
};

export default Aterkia;
