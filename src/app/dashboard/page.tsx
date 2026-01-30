'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getApiUrl } from '@/utils/api';
import axios from 'axios';
import { Resource } from '@/types';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ fullName: string } | null>(null);
    const [recentResources, setRecentResources] = useState<Resource[]>([]);
    const [stats, setStats] = useState({ totalResources: 0, totalSubjects: 0, totalDownloads: 124 }); // Mock downloads for now
    const [greeting, setGreeting] = useState('Welcome');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!token) {
            router.push('/auth/login');
        } else {
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            } else {
                setUser({ fullName: 'Student' });
            }
            fetchDashboardData();
            setTimeGreeting();
        }
    }, [router]);

    const setTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    };

    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${getApiUrl()}/resources`);
            const allResources: Resource[] = res.data;

            setRecentResources(allResources.slice(0, 5)); // Top 5

            // Calculate unique subjects
            const subjects = new Set(allResources.map(r => r.subject));

            setStats({
                totalResources: allResources.length,
                totalSubjects: subjects.size,
                totalDownloads: 120 + allResources.length * 2 // Fake downloads algo
            });
        } catch (err) {
            console.error("Failed to fetch resources");
        }
    };

    if (!user) return <div className={styles.loading}><LoadingSpinner /></div>;

    return (
        <main className={styles.main}>
            {/* ... rest of component ... */}
            <h1 className={styles.title}>Welcome back, {user.fullName}!</h1>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h2>Recent Activity</h2>
                    <p>No recent downloads.</p>
                </div>

                <div className={styles.card}>
                    <h2>Quick Actions</h2>
                    <button className={styles.actionBtn} onClick={() => router.push('/resources/upload')}>Upload New</button>
                    <button className={styles.actionBtn} onClick={() => router.push('/resources')}>Browse All</button>
                    <button className={styles.actionBtn} onClick={() => router.push('/dashboard/pomodoro')}>Focus Timer</button>
                </div>
            </div>
        </div>
        </main >
    );
}
