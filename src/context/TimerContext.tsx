'use client';
import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';

const MODES = {
    WORK: { time: 25 * 60, label: 'Focus Time' },
    SHORT_BREAK: { time: 5 * 60, label: 'Short Break' },
    LONG_BREAK: { time: 15 * 60, label: 'Long Break' }
};

interface TimerContextProps {
    mode: keyof typeof MODES;
    timeLeft: number;
    isActive: boolean;
    switchMode: (newMode: keyof typeof MODES) => void;
    toggleTimer: () => void;
    resetTimer: () => void;
    getProgress: () => number;
    formatTime: (seconds: number) => string;
    label: string;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<keyof typeof MODES>('WORK');
    const [timeLeft, setTimeLeft] = useState(MODES.WORK.time);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound here
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

    const getProgress = () => {
        const total = MODES[mode].time;
        return ((total - timeLeft) / total) * 100;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <TimerContext.Provider value={{
            mode,
            timeLeft,
            isActive,
            switchMode,
            toggleTimer,
            resetTimer,
            getProgress,
            formatTime,
            label: MODES[mode].label
        }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => {
    const context = useContext(TimerContext);
    if (!context) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
};
