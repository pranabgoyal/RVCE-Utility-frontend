'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import api from '@/utils/api';
import styles from './auth.module.css';
import Toast from '@/components/Toast';

export default function Signup() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        year: '1st Year',
        department: 'First Year'
    });
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await api.signup(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
        } catch (err: any) {
            console.error('Signup Error:', err);
            const errorMsg = err.response?.data?.msg || err.message || 'Signup failed';
            setError(errorMsg);
            setShowToast(true);
        }
    };

    return (
        <div className={styles.container}>
            {showToast && <Toast message={error} type="error" onClose={() => setShowToast(false)} />}
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join EduDocs today</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="e.g. John Doe"
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>Year</label>
                            <select name="year" value={formData.year} onChange={handleChange} className={styles.select}>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Department</label>
                            <select name="department" value={formData.department} onChange={handleChange} className={styles.select}>
                                <option value="First Year">First Year (Common)</option>
                                <option value="CSE">CSE</option>
                                <option value="ISE">ISE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="ME">ME</option>
                                <option value="CV">CV</option>
                                <option value="AI&ML">AI&ML</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Email</label>
                        <input className={styles.input} type="email" name="email" placeholder="student@example.com" onChange={handleChange} required />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Password</label>
                        <input className={styles.input} type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
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
