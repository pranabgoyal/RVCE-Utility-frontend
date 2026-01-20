'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './auth.module.css';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
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
            const res = await axios.post('http://localhost:5000/api/auth/signup', formData);
            // Save token (in real app using Context/NextAuth)
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Signup failed');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join EduDocs today</p>

                {error && <p className={styles.error}>{error}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Username</label>
                        <input type="text" name="username" onChange={handleChange} required />
                    </div>
                    <div className={styles.group}>
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className={styles.group}>
                        <label>Password</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <button type="submit" className={styles.submitBtn}>Sign Up</button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link href="/auth/login" className={styles.link}>Log In</Link>
                </p>
            </div>
        </div>
    );
}
