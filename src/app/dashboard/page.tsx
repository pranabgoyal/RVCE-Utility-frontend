'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        } else {
            // Decode token or fetch user profile (mocked for now)
            setUser({ username: 'Student' });
        }
    }, [router]);

    if (!user) return <div className={styles.loading}>Loading...</div>;

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <h1>Welcome back, {user.username}! 👋</h1>
                <p>Track your progress and access your saved resources.</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2>Recent Downloads</h2>
                    <div className={styles.emptyState}>No recent downloads</div>
                </div>

                <div className={styles.card}>
                    <h2>Quick Access</h2>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}>Browse Resources</button>
                        <button className={styles.actionBtn}>Upload New</button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2>Stats</h2>
                    <div className={styles.stat}>
                        <span>Resources Accessed</span>
                        <strong>0</strong>
                    </div>
                </div>
            </div>
        </main>
    );
}
