'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './pomodoro.module.css';

const MODES = {
    WORK: { time: 25 * 60, label: 'Focus Time' },
    SHORT_BREAK: { time: 5 * 60, label: 'Short Break' },
    LONG_BREAK: { time: 15 * 60, label: 'Long Break' }
};

export default function PomodoroPage() {
    const [mode, setMode] = useState<keyof typeof MODES>('WORK');
    const [timeLeft, setTimeLeft] = useState(MODES.WORK.time);
    const [isActive, setIsActive] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/sounds/notification.mp3'); // We need to add this file or use a CDN
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound if available, else alert
            if (audioRef.current) {
                audioRef.current.play().catch(() => { });
            }
            // alert('Timer finished!'); 
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const switchMode = (newMode: keyof typeof MODES) => {
        setMode(newMode);
        setTimeLeft(MODES[newMode].time);
        setIsActive(false);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(MODES[mode].time);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const total = MODES[mode].time;
        return ((total - timeLeft) / total) * 100;
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{MODES[mode].label}</h1>

                <div className={styles.modes}>
                    <button
                        className={`${styles.modeBtn} ${mode === 'WORK' ? styles.activeMode : ''}`}
                        onClick={() => switchMode('WORK')}
                    >
                        Focus
                    </button>
                    <button
                        className={`${styles.modeBtn} ${mode === 'SHORT_BREAK' ? styles.activeMode : ''}`}
                        onClick={() => switchMode('SHORT_BREAK')}
                    >
                        Short Break
                    </button>
                    <button
                        className={`${styles.modeBtn} ${mode === 'LONG_BREAK' ? styles.activeMode : ''}`}
                        onClick={() => switchMode('LONG_BREAK')}
                    >
                        Long Break
                    </button>
                </div>

                <div className={styles.timerDisplay}>
                    {formatTime(timeLeft)}
                </div>

                <div className={styles.controls}>
                    <button
                        className={`${styles.btn} ${isActive ? styles.pauseBtn : styles.startBtn}`}
                        onClick={toggleTimer}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                        className={`${styles.btn} ${styles.resetBtn}`}
                        onClick={resetTimer}
                    >
                        Reset
                    </button>
                </div>

                <div className={styles.message}>
                    {isActive ? 'Stay focused! You got this. 🚀' : 'Ready to start?'}
                </div>
            </div>
        </div>
    );
}
