import { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './QuizModal.module.css';
import LoadingSpinner from './LoadingSpinner';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

interface QuizModalProps {
    context: {
        title: string;
        subject?: string;
        branch?: string;
    };
    onClose: () => void;
}

export default function QuizModal({ context, onClose }: QuizModalProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.post(`${getApiUrl()}/ai/quiz`, { context });
                setQuestions(res.data.quiz);
            } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                console.error("Failed to fetch quiz", err);
                setErrorMsg(err.response?.data?.error || "We couldn't generate a quiz right now. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnswer = (optionIndex: number) => {
        if (optionIndex === questions[currentStep].correctAnswer) {
            setScore(prev => prev + 1);
        }

        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    if (loading) return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.loadingState}>
                    <LoadingSpinner />
                    <p>Generating Quiz with AI...</p>
                </div>
            </div>
        </div>
    );

    if (questions.length === 0 || errorMsg) return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <div className={styles.errorState}>
                    <h3>😕 Error Generating Quiz</h3>
                    <p>{errorMsg || "User Offline or No Quiz Generated"}</p>
                    <button className={styles.finishBtn} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>

                {!showResult ? (
                    <>
                        <div className={styles.header}>
                            <h3>Question {currentStep + 1} / {questions.length}</h3>
                            <div className={styles.progressBar}>
                                <div style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className={styles.content}>
                            <h2 className={styles.question}>
                                {questions[currentStep]?.question || "Error: Missing Question Text"}
                            </h2>
                            <div className={styles.options}>
                                {Array.isArray(questions[currentStep]?.options) ? (
                                    questions[currentStep].options.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={styles.optionBtn}
                                            onClick={() => handleAnswer(index)}
                                        >
                                            {option}
                                        </button>
                                    ))
                                ) : (
                                    <p className={styles.errorText}>Error: Invalid question format.</p>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.result}>
                        <h2>Quiz Completed! 🎉</h2>
                        <div className={styles.scoreCircle}>
                            <span>{score}</span>
                            <small>/{questions.length}</small>
                        </div>
                        <p>{score === questions.length ? 'Perfect Score!' : 'Keep Learning!'}</p>
                        <button className={styles.finishBtn} onClick={onClose}>Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}
