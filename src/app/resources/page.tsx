'use client';
import { useEffect, useState, Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './resources.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import FolderCard from '@/components/FolderCard';
import ResourcePreviewModal from '@/components/ResourcePreviewModal';

// Types for GitHub Items
interface GitHubItem {
    name: string;
    type: 'file' | 'dir';
    path: string;
    download_url: string | null;
    size: number;
}

// Year Configuration
const YEARS = [
    { id: '1', label: '1st Year', desc: '2022 Scheme' },
    { id: '2', label: '2nd Year', desc: '2022 Scheme' },
    { id: '3', label: '3rd Year', desc: '2022 Scheme' },
    { id: '4', label: '4th Year', desc: '2022 Scheme' },
];

function ResourcesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- State --
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState<string>(''); // e.g. "Chemistry/Unit1"
    const [items, setItems] = useState<GitHubItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal State
    const resourceIdParam = searchParams.get('resourceId');
    const [previewItem, setPreviewItem] = useState<{ url: string, name: string } | null>(null);

    // -- Effects --

    // 1. Initial Load / Auth Check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router]);

    // 2. Fetch Data when Year or Path changes
    useEffect(() => {
        if (!selectedYear) {
            setItems([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError('');
            try {
                // Construct API URL: /api/github/:year/:path
                // encodeURIComponent is crucial for paths with spaces or special chars
                const pathSegment = currentPath ? `/${currentPath}` : '';
                const url = `${getApiUrl()}/github/${selectedYear}${pathSegment}`;

                const res = await axios.get(url);

                // Sort: Folders first, then Files
                const sorted = (res.data as GitHubItem[]).sort((a, b) => {
                    if (a.type === b.type) return a.name.localeCompare(b.name);
                    return a.type === 'dir' ? -1 : 1;
                });

                setItems(sorted);
            } catch (err) {
                console.error('Fetch Error:', err);
                setError('Failed to load resources. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedYear, currentPath]);

    // -- Handlers --

    const handleYearSelect = (yearId: string) => {
        setSelectedYear(yearId);
        setCurrentPath(''); // Reset path when switching years
    };

    const handleItemClick = (item: GitHubItem) => {
        if (item.type === 'dir') {
            // Navigate into folder (update path)
            // GitHub paths are full like "Chemistry/Unit 1", so we can just use item.path? 
            // Actually item.path is the full path from repo root. perfect.
            setCurrentPath(item.path);
        } else {
            // Open File Preview
            if (item.download_url) {
                setPreviewItem({ url: item.download_url, name: item.name });
            }
        }
    };

    const handleBreadcrumbClick = (index: number, parts: string[]) => {
        // parts = ['Chemistry', 'Unit1']
        // index = 0 -> 'Chemistry'
        const newPath = parts.slice(0, index + 1).join('/');
        setCurrentPath(newPath);
    };

    const handleHomeClick = () => {
        setSelectedYear(null);
        setCurrentPath('');
    };

    const handleRootClick = () => {
        setCurrentPath('');
    };

    // -- Render Helpers --

    const renderBreadcrumbs = () => {
        if (!selectedYear) return null;

        const parts = currentPath.split('/').filter(Boolean);

        return (
            <nav className={styles.breadcrumbs}>
                <span className={styles.breadcrumbLink} onClick={handleHomeClick}>Home</span>
                <span className={styles.separator}>/</span>
                <span
                    className={currentPath === '' ? styles.activeBreadcrumb : styles.breadcrumbLink}
                    onClick={handleRootClick}
                >
                    {YEARS.find(y => y.id === selectedYear)?.label}
                </span>
                {parts.map((part, index) => (
                    <span key={index} className={styles.breadcrumbItem}>
                        <span className={styles.separator}>/</span>
                        <span
                            className={index === parts.length - 1 ? styles.activeBreadcrumb : styles.breadcrumbLink}
                            onClick={() => handleBreadcrumbClick(index, parts)}
                        >
                            {decodeURIComponent(part)}
                        </span>
                    </span>
                ))}
            </nav>
        );
    };

    // -- Main Render --
    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>Engineering Resources</h1>
                    <p className={styles.subtitle}>Curated from GitHub Repositories</p>
                </div>
                {renderBreadcrumbs()}
            </div>

            {loading ? (
                <div className={styles.loadingContainer}><LoadingSpinner /></div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.grid}>
                    {/* Level 0: Year Selection */}
                    {!selectedYear && YEARS.map(year => (
                        <FolderCard
                            key={year.id}
                            label={year.label}
                            type="semester" // Reusing styling
                            onClick={() => handleYearSelect(year.id)}
                        />
                    ))}

                    {/* Level 1+: File/Folder List */}
                    {selectedYear && items.length === 0 && (
                        <div className={styles.emptyState}>This folder is empty.</div>
                    )}

                    {selectedYear && items.map(item => (
                        <FolderCard
                            key={item.path}
                            label={item.name}
                            type={item.type === 'dir' ? 'subject' : 'file'} // Visual distinction
                            onClick={() => handleItemClick(item)}
                        />
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <ResourcePreviewModal
                    isOpen={!!previewItem}
                    onClose={() => setPreviewItem(null)}
                    fileUrl={previewItem.url}
                    title={previewItem.name}
                    resourceId="github-resource" // Dummy ID
                    mode={null}
                    onModeChange={() => { }} // No AI/Quiz mode for raw files yet
                />
            )}
        </main>
    );
}

export default function ResourcesPage() {
    return (
        <Suspense fallback={<div className={styles.loadingContainer}><LoadingSpinner /></div>}>
            <ResourcesContent />
        </Suspense>
    );
}
