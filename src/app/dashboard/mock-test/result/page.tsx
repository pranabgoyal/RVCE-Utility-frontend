'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../mock-test.module.css';

interface Result {
    score: number;
    total: number;
    percentage: number;
    results: Array<{
        questionId: string;
        text: string;
        userAnswer: string;
        correctAnswer: string;
        isCorrect: boolean;
        explanation?: string;
    }>;
}

export default function ResultPage() {
    const router = useRouter();
    const [result, setResult] = useState<Result | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('quizResult');
        if (!stored) {
            router.push('/dashboard/mock-test');
        } else {
            setResult(JSON.parse(stored));
        }
    }, [router]);

    if (!result) return null;

    return (
        <div className={styles.container}>
            <div className={styles.resultCard}>
                <h1 className={styles.title}>Test Results</h1>
                <div className={styles.score}>
                    {result.score} / {result.total}
                </div>
                <div className={styles.analytics}>
                    <div className={styles.statItem}>
                        <h3>{result.percentage}%</h3>
                        <p>Accuracy</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3 style={{ color: '#ef4444' }}>{result.total - result.score}</h3>
                        <p>Wrong</p>
                    </div>
                </div>

                <button
                    className={`${styles.navBtn} ${styles.submitBtn}`}
                    style={{ marginTop: '2rem' }}
                    onClick={() => router.push('/dashboard/mock-test')}
                >
                    Take Another Test
                </button>
            </div>

            <div className={styles.reviewSection}>
                <h2 style={{ marginBottom: '1.5rem' }}>Detailed Analysis</h2>
                <div style={{ background: 'var(--card-bg)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                    {result.results.map((item, idx) => (
                        <div key={idx} className={styles.reviewItem}>
                            <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Q{idx + 1}: {item.text}</p>
                            <p>Your Answer: <span className={item.isCorrect ? styles.correct : styles.wrong}>{item.userAnswer || 'Skipped'}</span></p>
                            {!item.isCorrect && (
                                <p>Correct Answer: <span className={styles.correct}>{item.correctAnswer}</span></p>
                            )}
                            {item.explanation && (
                                <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                    💡 {item.explanation}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
