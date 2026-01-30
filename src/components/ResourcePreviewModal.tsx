'use client';
import { useEffect, useState } from 'react';
import styles from './ResourcePreviewModal.module.css';
import AIChatWindow from './AIChatWindow';
import QuizModal from './QuizModal';

interface ResourcePreviewModalProps {
    isOpen: boolean; // Kept for prop but parent should handle conditional rendering
    onClose: () => void;
    fileUrl: string;
    title: string;
    resourceId?: string; // Made optional for now, but should be passed
}

export default function ResourcePreviewModal({ isOpen, onClose, fileUrl, title, resourceId = "mock-id" }: ResourcePreviewModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);

    // Handle ESC key to close
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

    // Construct full URL if relative
    // In production, we assume fileUrl is likely absolute (Cloudinary), but handle relative for local uploads
    const getDownloadUrl = (url: string) => {
        if (url.startsWith('http')) return url;
        // Use window.location.origin to adapt to Vercel or Localhost dynamically
        if (typeof window !== 'undefined') {
            return `${window.location.origin}${url}`;
        }
        return url;
    };
    const fullUrl = getDownloadUrl(fileUrl);

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
                        {/* Use Google Docs Viewer for reliable PDF rendering without CORS issues */}
                        <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`}
                            className={styles.iframe}
                            title={title}
                        />
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
