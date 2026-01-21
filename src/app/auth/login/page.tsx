'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/utils/api';
import styles from './auth.module.css';

import Toast from '@/components/Toast';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await api.login(formData);
            localStorage.setItem('token', data.token);
            // Optionally store user info like in signup?
            if (data.user) {
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            setToast({ message: 'Login successful!', type: 'success' });
            setTimeout(() => router.push('/dashboard'), 1000);
        } catch (err: any) {
            setToast({ message: err.response?.data?.msg || 'Login failed', type: 'error' });
        }
    };

    return (
        <div className={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Access your resources</p>

                {/* Error paragraph removed, handled by Toast */}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label className={styles.label}>Email</label>
                        <input className={styles.input} type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Password</label>
                        <input className={styles.input} type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Log In</button>
                </form>

                <p className={styles.footer}>
                    Don't have an account? <Link href="/auth/signup" className={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
