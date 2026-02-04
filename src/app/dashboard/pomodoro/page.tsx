'use client';
import { useTimer } from '@/context/TimerContext';
import styles from './pomodoro.module.css';

export default function PomodoroPage() {
    const {
        mode,
        timeLeft,
        isActive,
        switchMode,
        toggleTimer,
        resetTimer,
        label,
        formatTime
    } = useTimer();

    // Removed local state and effects as they are now handled globally

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>{label}</h1>

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
