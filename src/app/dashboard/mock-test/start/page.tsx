'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from '../mock-test.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Question {
    _id: string;
    text: string;
    options: string[];
    subject: string;
}

function TestContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subject = searchParams.get('subject') || 'Common';

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({}); // { questionId: selectedOptionIndex }
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (!loading && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !loading) {
            submitTest();
        }
    }, [timeLeft, loading]);

    const fetchQuestions = async () => {
        try {
            const res = await axios.post(`${getApiUrl()}/quiz/generate`, { subject });
            setQuestions(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to load quiz", err);
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionIndex: number) => {
        setAnswers({
            ...answers,
            [questions[currentQIndex]._id]: optionIndex
        });
    };

    const submitTest = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${getApiUrl()}/quiz/submit`, { answers });

            // Store result in local storage to show on result page
            localStorage.setItem('quizResult', JSON.stringify(res.data));
            router.push('/dashboard/mock-test/result');
        } catch (err) {
            console.error("Failed to submit", err);
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className={styles.container}><LoadingSpinner /></div>;

    if (questions.length === 0) return (
        <div className={styles.container}>
            <h2 className={styles.title}>No Questions Found</h2>
            <p style={{ textAlign: 'center' }}>We couldn't find any questions for {subject}. Try seeding the database first.</p>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button className={styles.navBtn} onClick={() => router.push('/dashboard/mock-test')}>Go Back</button>
            </div>
        </div>
    );

    const currentQ = questions[currentQIndex];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>Question {currentQIndex + 1} / {questions.length}</div>
                <div className={styles.timer}>⏱ {formatTime(timeLeft)}</div>
            </div>

            <div className={styles.questionCard}>
                <h2 className={styles.questionText}>{currentQ.text}</h2>

                <div className={styles.options}>
                    {currentQ.options.map((option, idx) => (
                        <div
                            key={idx}
                            className={`${styles.option} ${answers[currentQ._id] === idx ? styles.selectedOption : ''}`}
                            onClick={() => handleOptionSelect(idx)}
                        >
                            {String.fromCharCode(65 + idx)}. {option}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.navigation}>
                <button
                    className={styles.navBtn}
                    onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQIndex === 0}
                >
                    Previous
                </button>

                {currentQIndex < questions.length - 1 ? (
                    <button
                        className={styles.navBtn}
                        onClick={() => setCurrentQIndex(prev => prev + 1)}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        className={`${styles.navBtn} ${styles.submitBtn}`}
                        onClick={submitTest}
                    >
                        Submit Test
                    </button>
                )}
            </div>
        </div>
    );
}

export default function TestInterface() {
    return (
        <Suspense fallback={<div className={styles.container}><LoadingSpinner /></div>}>
            <TestContent />
        </Suspense>
    );
}
