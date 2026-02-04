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
        confirmPassword: '',
        year: '1st Year',      // Default
        department: 'CSE'      // Default
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
                password: formData.password,
                year: formData.year,
                department: formData.department
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
                        <label className={styles.label}>Full Name</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={onChange}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>Year</label>
                            <select
                                className={styles.input}
                                name="year"
                                value={formData.year}
                                onChange={onChange}
                            >
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Department</label>
                            <select
                                className={styles.input}
                                name="department"
                                value={formData.department}
                                onChange={onChange}
                            >
                                <option value="CSE">CSE</option>
                                <option value="ISE">ISE</option>
                                <option value="ECE">ECE</option>
                                <option value="EEE">EEE</option>
                                <option value="ME">ME</option>
                                <option value="CV">CV</option>
                                <option value="AI&ML">AI&ML</option>
                                <option value="First Year">First Year</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>USN (University Seat Number)</label>
                        <input
                            className={styles.input}
                            type="text"
                            name="usn"
                            value={formData.usn}
                            onChange={onChange}
                            required
                            placeholder="e.g. 1RV23CS001"
                        />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onChange}
                            required
                            placeholder="john@rvce.edu.in"
                        />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Password</label>
                        <input
                            className={styles.input}
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={onChange}
                            required
                            placeholder="Minimum 6 characters"
                        />
                    </div>
                    <div className={styles.group}>
                        <label className={styles.label}>Confirm Password</label>
                        <input
                            className={styles.input}
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
