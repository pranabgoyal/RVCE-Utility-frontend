'use client';
import { useRouter } from 'next/navigation';
import styles from './mock-test.module.css';

const SUBJECTS = [
    { name: 'Common', icon: '🌍' },
    { name: 'CSE', icon: '💻' },
    { name: 'ECE', icon: '📡' },
    { name: 'EEE', icon: '⚡' },
    { name: 'ISE', icon: '💾' },
    { name: 'ME', icon: '⚙️' },
    { name: 'CV', icon: '🏗️' },
    { name: 'AI&ML', icon: '🤖' }
];

export default function MockTestDashboard() {
    const router = useRouter();

    const startTest = (subject: string) => {
        // Encode subject to handle "&" in AI&ML
        router.push(`/dashboard/mock-test/start?subject=${encodeURIComponent(subject)}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Mock Test Platform</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Select a subject to start a 10-minute quick fire quiz.</p>

            <div className={styles.grid}>
                {SUBJECTS.map((sub) => (
                    <div key={sub.name} className={styles.card} onClick={() => startTest(sub.name)}>
                        <div className={styles.cardIcon}>{sub.icon}</div>
                        <div className={styles.cardTitle}>{sub.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
