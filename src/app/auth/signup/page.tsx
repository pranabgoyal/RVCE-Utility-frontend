'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/utils/api';
import styles from '../login/auth.module.css'; // Reusing login styles
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        fullName: '',
        usn: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${getApiUrl()}/auth/signup`, {
                fullName: formData.fullName,
                usn: formData.usn,
                email: formData.email,
                password: formData.password
            });

            // res.data.token, res.data.user
            login(res.data.token, res.data.user);

        } catch (err: any) {
            setError(err.response?.data?.msg || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join RVCE Engineering Platform</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={onSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={onChange}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className={styles.group}>
                        <label>USN (University Seat Number)</label>
                        <input
                            type="text"
                            name="usn"
                            value={formData.usn}
                            onChange={onChange}
                            required
                            placeholder="e.g. 1RV23CS001"
                        />
                    </div>
                    <div className={styles.group}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="john@rvce.edu.in"
                        />
                    </div>
                    <div className={styles.group}>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            placeholder="Minimum 6 characters"
                        />
                    </div>
                    <div className={styles.group}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={onChange}
                            required
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account? <Link href="/auth/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}
