'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './resources.module.css';

export default function Resources() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                // Fetch from backend
                const res = await axios.get('http://localhost:5000/api/resources');
                setResources(res.data);
            } catch (err) {
                console.error('Failed to fetch resources');
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <h1>Browse Resources</h1>
                <p>Find notes, papers, and lab manuals for your branch.</p>
            </div>

            {loading ? (
                <div className={styles.loading}>Loading resources...</div>
            ) : (
                <div className={styles.grid}>
                    {resources.map((res: any) => (
                        <div key={res._id} className={styles.card}>
                            <div className={styles.icon}>📄</div>
                            <div className={styles.content}>
                                <h3>{res.title}</h3>
                                <p className={styles.meta}>
                                    {res.branch} • Year {res.year} • {res.category}
                                </p>
                            </div>
                            <a href={res.fileUrl} target="_blank" className={styles.downloadBtn}>
                                ⬇
                            </a>
                        </div>
                    ))}
                    {resources.length === 0 && (
                        <div className={styles.empty}>No resources found yet.</div>
                    )}
                </div>
            )}
        </main>
    );
}
