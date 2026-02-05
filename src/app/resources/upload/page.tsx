'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './upload.module.css';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';

export default function UploadResource() {
    const router = useRouter();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Notes',
        branch: 'CSE',
        year: '1',
        semester: 'Semester 1',
        subject: ''
    });

    const [file, setFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!file) {
            setToast({ message: 'Please select a file', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setToast({ message: 'You must be logged in!', type: 'error' });
                setTimeout(() => router.push('/auth/login'), 2000);
                return;
            }

            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('branch', formData.branch);
            data.append('year', formData.year);
            data.append('semester', formData.semester);
            data.append('subject', formData.subject);
            data.append('category', formData.category);
            data.append('file', file);

            // POST to /api/upload
            await axios.post(`${getApiUrl()}/upload`, data, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setToast({ message: 'Resource uploaded successfully!', type: 'success' });
            setTimeout(() => router.push('/resources'), 1500); // Redirect to Resources
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            console.error(err);
            const status = err.response?.status;
            const msg = err.response?.data?.msg || 'Upload failed';

            if (status === 401) {
                setToast({ message: `Session expired: ${msg}`, type: 'error' });
                setTimeout(() => {
                    logout();
                }, 2000);
            } else {
                setToast({ message: msg, type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className={styles.card}>
                <h1 className={styles.title}>Upload Resource</h1>
                <p className={styles.subtitle}>Contribute to the community</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label className={styles.label}>Title</label>
                        <input className={styles.input} type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Data Structures Unit 1" />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>Branch</label>
                            <select className={styles.input} name="branch" value={formData.branch} onChange={handleChange}>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="ME">ME</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Year</label>
                            <select className={styles.input} name="year" value={formData.year} onChange={handleChange}>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label className={styles.label}>Semester</label>
                            <select className={styles.input} name="semester" value={formData.semester} onChange={handleChange}>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>Subject</label>
                            <input className={styles.input} type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="e.g. Mathematics" />
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Upload File</label>
                        <div className={styles.fileUploadWrapper}>
                            <input
                                type="file"
                                id="file"
                                className={styles.fileInput}
                                onChange={handleFileChange}
                                accept=".pdf,image/*"
                            />
                            <label htmlFor="file" className={styles.fileLabel}>
                                <span className={styles.uploadIcon}>☁️</span>
                                {file ? `Selected: ${file.name}` : 'Click to browse'}
                            </label>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label className={styles.label}>Description</label>
                        <textarea className={styles.input} name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Optional description..." />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Upload Resource'}
                    </button>
                </form>
            </div>
        </div>
    );
}
