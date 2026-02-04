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
    size?: number;
}

// Types for User Uploads
interface UserResource {
    _id: string;
    title: string;
    description: string;
    subject: string;
    year: string;
    branch: string;
    fileUrl: string;
    fileType: string;
    createdAt: string;
}

// Year Configuration
const YEARS = [
    { id: '1', label: '1st Year', desc: '2022 Scheme' },
    { id: '2', label: '2nd Year', desc: '2022 Scheme' },
    { id: '3', label: '3rd Year', desc: '2022 Scheme' },
    { id: '4', label: '4th Year', desc: '2022 Scheme' },
    { id: 'mock-papers', label: 'Mock Papers', desc: 'AI & ML' },
];

function ResourcesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- State --
    const [activeTab, setActiveTab] = useState<'curated' | 'community'>('curated');

    // Curated (GitHub) State
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [items, setItems] = useState<GitHubItem[]>([]);

    // Community (User) State
    const [userResources, setUserResources] = useState<UserResource[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Modal State
    const [previewItem, setPreviewItem] = useState<{ url: string, name: string } | null>(null);
    const [aiMode, setAiMode] = useState<'chat' | 'quiz' | null>(null);

    // -- Effects --

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router]);

    // Fetch GitHub Data
    useEffect(() => {
        if (activeTab === 'curated') {
            if (!selectedYear) {
                setItems([]);
                return;
            }
            const fetchGitHub = async () => {
                setLoading(true);
                setError('');
                try {
                    const pathSegment = currentPath ? `/${currentPath}` : '';
                    const url = `${getApiUrl()}/github/${selectedYear}${pathSegment}`;
                    const res = await axios.get(url);
                    const sorted = (res.data as GitHubItem[]).sort((a, b) => {
                        if (a.type === b.type) return a.name.localeCompare(b.name);
                        return a.type === 'dir' ? -1 : 1;
                    });
                    setItems(sorted);
                } catch (err: any) {
                    console.error('Fetch Error:', err);
                    setError(`Failed to load: ${err.message || 'Unknown Error'}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchGitHub();
        }
    }, [selectedYear, currentPath, activeTab]);

    // Fetch Community Data
    useEffect(() => {
        if (activeTab === 'community') {
            const fetchCommunity = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${getApiUrl()}/upload`);
                    setUserResources(res.data);
                } catch (err: any) {
                    console.error(err);
                    setError(`Failed to load community resources: ${err.message}`);
                } finally {
                    setLoading(false);
                }
            }
            fetchCommunity();
        }
    }, [activeTab]);


    // -- Handlers --

    const handleYearSelect = (yearId: string) => {
        setSelectedYear(yearId);
        setCurrentPath('');
    };

    const handleItemClick = (item: GitHubItem) => {
        if (item.type === 'dir') {
            setCurrentPath(item.path);
        } else {
            if (item.download_url) {
                setPreviewItem({ url: item.download_url, name: item.name });
                setAiMode(null); // Reset AI mode on new item
            }
        }
    };

    const handleUserResourceClick = (res: UserResource) => {
        setPreviewItem({ url: res.fileUrl, name: res.title });
        setAiMode(null); // Reset AI mode on new item
    };

    const handleBreadcrumbClick = (index: number, parts: string[]) => {
        const newPath = parts.slice(0, index + 1).join('/');
        setCurrentPath(newPath);
    };

    const handleHomeClick = () => {
        setSelectedYear(null);
        setCurrentPath('');
    };

    // -- Render Helpers --

    const renderBreadcrumbs = () => {
        if (activeTab !== 'curated' || !selectedYear) return null;
        const parts = currentPath.split('/').filter(Boolean);
        return (
            <nav className={styles.breadcrumbs}>
                <span className={styles.breadcrumbLink} onClick={handleHomeClick}>Home</span>
                <span className={styles.separator}>/</span>
                <span className={currentPath === '' ? styles.activeBreadcrumb : styles.breadcrumbLink} onClick={() => setCurrentPath('')}>
                    {YEARS.find(y => y.id === selectedYear)?.label}
                </span>
                {parts.map((part, index) => (
                    <span key={index} className={styles.breadcrumbItem}>
                        <span className={styles.separator}>/</span>
                        <span className={index === parts.length - 1 ? styles.activeBreadcrumb : styles.breadcrumbLink} onClick={() => handleBreadcrumbClick(index, parts)}>
                            {decodeURIComponent(part)}
                        </span>
                    </span>
                ))}
            </nav>
        );
    };

    return (
        <main className={styles.main}>
            {/* Header & Tabs */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>Engineering Resources</h1>
                    <button className={styles.uploadBtn} onClick={() => router.push('/resources/upload')}>+ Upload Content</button>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'curated' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('curated')}
                    >
                        📚 Curated (GitHub)
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'community' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('community')}
                    >
                        👥 Community Uploads
                    </button>
                </div>

                {renderBreadcrumbs()}
            </div>

            {loading && <div className={styles.loadingContainer}><LoadingSpinner /></div>}

            {!loading && (
                <div className={styles.contentArea}>
                    {/* CURATED TAB */}
                    {activeTab === 'curated' && (
                        <div className={styles.grid}>
                            {!selectedYear && YEARS.map(year => (
                                <FolderCard
                                    key={year.id}
                                    label={year.label}
                                    type="semester"
                                    onClick={() => handleYearSelect(year.id)}
                                />
                            ))}

                            {selectedYear && items.length === 0 && !error && (
                                <div className={styles.emptyState}>This folder is empty.</div>
                            )}

                            {selectedYear && items.map(item => (
                                <FolderCard
                                    key={item.path}
                                    label={item.name}
                                    type={item.type === 'dir' ? 'subject' : 'file'}
                                    onClick={() => handleItemClick(item)}
                                />
                            ))}
                        </div>
                    )}

                    {/* COMMUNITY TAB */}
                    {activeTab === 'community' && (
                        <div className={styles.communityGrid}>
                            {userResources.length === 0 ? (
                                <div className={styles.emptyState}>No community uploads yet. Be the first!</div>
                            ) : (
                                userResources.map(res => (
                                    <div key={res._id} className={styles.resourceCard} onClick={() => handleUserResourceClick(res)}>
                                        <div className={styles.icon}>📄</div>
                                        <div className={styles.details}>
                                            <h3>{res.title}</h3>
                                            <p>{res.subject} • {res.branch}</p>
                                            <span className={styles.meta}>Variable {res.year} Year</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Preview Modal */}
            {previewItem && (
                <ResourcePreviewModal
                    isOpen={!!previewItem}
                    onClose={() => {
                        setPreviewItem(null);
                        setAiMode(null);
                    }}
                    fileUrl={previewItem.url}
                    title={previewItem.name}
                    resourceId="resource"
                    mode={aiMode}
                    onModeChange={setAiMode}
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
