'use client';
import { useEffect, useState } from 'react';
import styles from './ResourcePreviewModal.module.css';
import AIChatWindow from './AIChatWindow';
import QuizModal from './QuizModal';
import { getApiUrl } from '@/utils/api';

interface ResourcePreviewModalProps {
    onClose: () => void;
    fileUrl: string;
    title: string;
    mode: 'chat' | 'quiz' | null;
    onModeChange: (mode: 'chat' | 'quiz' | null) => void;
}

export default function ResourcePreviewModal({ onClose, fileUrl, title, mode, onModeChange }: ResourcePreviewModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isFullScreen) setIsFullScreen(false);
                else onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose, isFullScreen]);

    const getDownloadUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        const backendBase = getApiUrl().replace(/\/api$/, '');
        return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const fullUrl = getDownloadUrl(fileUrl);

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fullUrl);

    // Context for AI
    const aiContext = {
        title: title,
        subject: "Engineering Resource",
        branch: "General",
        fileUrl: fullUrl // passing the direct download URL
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            {mode === 'quiz' && (
                <QuizModal
                    context={aiContext}
                    onClose={() => onModeChange(null)}
                />
            )}

            <div
                className={`${styles.modal} ${isFullScreen ? styles.fullScreen : ''} ${mode === 'chat' ? styles.withChat : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${mode === 'chat' ? styles.active : ''}`}
                            onClick={() => onModeChange(mode === 'chat' ? null : 'chat')}
                            title="AI Study Buddy"
                        >
                            🤖 Chat
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => onModeChange('quiz')}
                            title="Generate Quiz"
                        >
                            📝 Quiz
                        </button>
                        <div className={styles.divider}></div>
                        <button
                            className={styles.actionBtn}
                            onClick={() => setIsFullScreen(!isFullScreen)}
                            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                        >
                            {isFullScreen ? '↙️' : '↗️'}
                        </button>
                        <a href={fullUrl} download className={styles.downloadBtn} target="_blank" rel="noopener noreferrer">
                            Download
                        </a>
                        <button className={styles.closeBtn} onClick={onClose}>×</button>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>
                        {isImage ? (
                            <div className={styles.imageContainer}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={fullUrl} alt={title} className={styles.previewImage} />
                            </div>
                        ) : fullUrl.includes('localhost') || fullUrl.includes('127.0.0.1') ? (
                            <div className={styles.errorState}>
                                <h3>📂 Local File - No Preview</h3>
                                <p>Google Viewer cannot preview files hosted on Localhost.</p>
                                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className={styles.accentBtn}>
                                    Open File Directly ↗️
                                </a>
                            </div>
                        ) : (
                            <div className={styles.iframeContainer}>
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`}
                                    className={styles.iframe}
                                    title={title}
                                />
                                <div className={styles.fallbackControl}>
                                    <p>Preview not working?</p>
                                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                                        Open Document ↗
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    {mode === 'chat' && (
                        <div className={styles.chatSidebar}>
                            <AIChatWindow context={aiContext} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
