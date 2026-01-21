'use client';
import { useState, useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
    );
};

export default Toast;
