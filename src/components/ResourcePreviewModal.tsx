'use client';
import { useEffect, useState } from 'react';
import styles from './ResourcePreviewModal.module.css';
import AIChatWindow from './AIChatWindow';
import QuizModal from './QuizModal';
import { getApiUrl } from '@/utils/api';

interface ResourcePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    title: string;
    resourceId?: string;
}

export default function ResourcePreviewModal({ isOpen, onClose, fileUrl, title, resourceId = "mock-id" }: ResourcePreviewModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

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

    // Construct full URL
    // If relative, point to Backend URL (not Frontend)
    const getDownloadUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        // Remove '/api' from the API URL to get the base backend URL
        const backendBase = getApiUrl().replace(/\/api$/, '');
        return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const fullUrl = getDownloadUrl(fileUrl);

    // Determine file type (enhanced for Cloudinary)
    const isCloudinaryImage = fullUrl.includes('/image/upload/');
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fullUrl) || isCloudinaryImage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isPdf = /\.pdf$/i.test(fullUrl) || fullUrl.includes('pdf');

    // Debug Log
    console.log(`[Preview] FileURL: ${fileUrl}, FullURL: ${fullUrl}, isImage: ${isImage}, isLocal: ${fullUrl.includes('localhost')}`);

    return (
        <div className={styles.overlay} onClick={onClose}>
            {showQuiz && <QuizModal resourceId={resourceId} onClose={() => setShowQuiz(false)} />}

            <div
                className={`${styles.modal} ${isFullScreen ? styles.fullScreen : ''} ${showChat ? styles.withChat : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${showChat ? styles.active : ''}`}
                            onClick={() => setShowChat(!showChat)}
                            title="AI Study Buddy"
                        >
                            🤖 Chat
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => setShowQuiz(true)}
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
                            /* Default to Google Viewer for PDFs and other docs */
                            <div className={styles.iframeContainer}>
                                <iframe
                                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`}
                                    className={styles.iframe}
                                    title={title}
                                />
                                <div className={styles.fallbackControl}>
                                    <span>Preview not loading?</span>
                                    <a href={fullUrl} target="_blank" rel="noopener noreferrer" className={styles.textLink}>
                                        Open in New Tab ↗
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    {showChat && (
                        <div className={styles.chatSidebar}>
                            <AIChatWindow resourceId={resourceId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
