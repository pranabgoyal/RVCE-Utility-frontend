'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './upload.module.css';
import Toast from '@/components/Toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function UploadResource() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Notes',
        branch: 'CSE',
        year: 1,
        semester: 'Semester 1',
        subject: '',
        fileUrl: ''
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
            data.append('year', formData.year.toString());
            data.append('semester', formData.semester);
            data.append('subject', formData.subject);
            data.append('category', formData.category);

            if (file) {
                data.append('file', file);
            } else if (formData.fileUrl) {
                data.append('fileUrl', formData.fileUrl);
            }

            // Note: We use axios directly here for FormData content-type handling
            await axios.post(`${getApiUrl()}/resources`, data, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setToast({ message: 'Resource uploaded successfully!', type: 'success' });
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err: any) {
            setToast({ message: err.response?.data?.msg || 'Upload failed', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className={styles.card}>
                <h1 className={styles.title}>Upload Resource</h1>
                <p className={styles.subtitle}>Share your notes with the community</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.group}>
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Data Structures Unit 1" />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Branch</label>
                            <select name="branch" value={formData.branch} onChange={handleChange}>
                                <option value="CSE">CSE</option>
                                <option value="ECE">ECE</option>
                                <option value="ME">ME</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label>Year</label>
                            <select name="year" value={formData.year} onChange={handleChange} className={styles.select}>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.group}>
                            <label>Semester</label>
                            <select name="semester" value={formData.semester} onChange={handleChange} className={styles.select}>
                                <option value="Semester 1">Semester 1</option>
                                <option value="Semester 2">Semester 2</option>
                                <option value="Semester 3">Semester 3</option>
                                <option value="Semester 4">Semester 4</option>
                                <option value="Semester 5">Semester 5</option>
                                <option value="Semester 6">Semester 6</option>
                                <option value="Semester 7">Semester 7</option>
                                <option value="Semester 8">Semester 8</option>
                            </select>
                        </div>
                        <div className={styles.group}>
                            <label>Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={styles.select}>
                                <option value="Notes">Notes</option>
                                <option value="Paper">Paper</option>
                                <option value="Lab Manual">Lab Manual</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.group}>
                        <label>Subject</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="e.g. Mathematics" />
                    </div>

                    <div className={styles.group}>
                        <label>Upload File (PDF/Image)</label>
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
                                {file ? `Selected: ${file.name}` : 'Click to browse or drag file here'}
                            </label>
                        </div>
                        <p className={styles.orText}>OR</p>
                        <label>File URL (Optional)</label>
                        <input type="url" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="https://..." />
                    </div>

                    <div className={styles.group}>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Optional description..." />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Upload Resource'}
                    </button>
                </form>
            </div>
        </div>
    );
}
