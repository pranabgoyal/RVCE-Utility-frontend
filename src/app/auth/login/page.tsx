'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './auth.module.css'; // Shared styles (needs to be copied/moved)

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Login failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Welcome Back</h1>
                <p className={styles.subtitle}>Access your resources</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className={styles.group}>
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
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
