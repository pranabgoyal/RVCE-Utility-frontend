'use client';
import { useEffect, useState, Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
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
    uploadedBy: string;
    createdAt: string;
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
    const { user } = useAuth();

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

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchResults, setSearchResults] = useState<{ github: GitHubItem[], community: UserResource[] }>({ github: [], community: [] });

    // -- Effects --

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router]);

    // Handle Search Params
    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
            setIsSearchMode(true);
            performSearch(query);
        } else {
            setIsSearchMode(false);
            setSearchQuery('');
        }
    }, [searchParams]);

    const performSearch = async (query: string) => {
        setLoading(true);
        setError('');
        try {
            // 1. Fetch GitHub Search Results
            const githubRes = await axios.get(`${getApiUrl()}/github/search?q=${encodeURIComponent(query)}`);

            // 2. Fetch Community Uploads (if not already loaded, though we can fetch fresh)
            const communityRes = await axios.get(`${getApiUrl()}/upload`);
            const communityAll = communityRes.data as UserResource[];

            // Filter Community Results Client-Side (title, subject, description)
            const lowerQ = query.toLowerCase();
            const communityMatches = communityAll.filter(item =>
                item.title.toLowerCase().includes(lowerQ) ||
                item.subject.toLowerCase().includes(lowerQ) ||
                (item.description && item.description.toLowerCase().includes(lowerQ))
            );

            setSearchResults({
                github: githubRes.data,
                community: communityMatches
            });

        } catch (err: unknown) {
            console.error('Search Error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Unknown Error';
            setError(`Search failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    // Fetch GitHub Data (Browse Mode)
    useEffect(() => {
        if (!isSearchMode && activeTab === 'curated') {
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
                } catch (err: unknown) {
                    console.error('Fetch Error:', err);
                    const errorMessage = err instanceof Error ? err.message : 'Unknown Error';
                    setError(`Failed to load: ${errorMessage}`);
                } finally {
                    setLoading(false);
                }
            };
            fetchGitHub();
        }
    }, [selectedYear, currentPath, activeTab, isSearchMode]);

    // Fetch Community Data (Browse Mode)
    useEffect(() => {
        if (!isSearchMode && activeTab === 'community') {
            const fetchCommunity = async () => {
                setLoading(true);
                try {
                    const res = await axios.get(`${getApiUrl()}/upload`);
                    setUserResources(res.data);
                } catch (err: unknown) {
                    console.error(err);
                    const errorMessage = err instanceof Error ? err.message : 'Unknown Error';
                    setError(`Failed to load community resources: ${errorMessage}`);
                } finally {
                    setLoading(false);
                }
            }
            fetchCommunity();
        }
    }, [activeTab, isSearchMode]);


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

    const handleDeleteResource = async (e: React.MouseEvent, resourceId: string) => {
        e.stopPropagation(); // Prevent opening the resource
        if (!confirm('Are you sure you want to delete this resource?')) return;

        setLoading(true);
        try {
            await axios.delete(`${getApiUrl()}/upload/${resourceId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') || '' }
            });

            // Remove from state
            setUserResources(prev => prev.filter(res => res._id !== resourceId));

            // Update search results if in search mode
            if (isSearchMode) {
                setSearchResults(prev => ({
                    ...prev,
                    community: prev.community.filter(res => res._id !== resourceId)
                }));
            }
        } catch (err: any) {
            console.error('Delete Error:', err);
            const status = err.response?.status;
            const backendMsg = err.response?.data?.msg || err.message || 'Unknown Error';

            if (status === 401) {
                alert(`Session expired or unauthorized: ${backendMsg}. Please log in again.`);
                // Optional: router.push('/auth/login');
            } else {
                alert(`Failed to delete: ${backendMsg}`);
            }
        } finally {
            setLoading(false);
        }
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
                        📚 Curated Resources
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

            {!loading && isSearchMode ? (
                <div className={styles.contentArea}>
                    <div className={styles.searchHeader}>
                        <h2>results for "{searchQuery}"</h2>
                        <button className={styles.clearSearchBtn} onClick={() => router.push('/resources')}>Clear Search</button>
                    </div>

                    <div className={styles.searchResults}>
                        {/* GitHub Matches */}
                        {searchResults.github.length > 0 && (
                            <div className={styles.resultSection}>
                                <h3>📚 From Curated Resources</h3>
                                <div className={styles.grid}>
                                    {searchResults.github.map((item, idx) => (
                                        <FolderCard
                                            key={`${item.path}-${idx}`}
                                            label={item.name}
                                            type="file" // Search only returns files for now
                                            onClick={() => handleItemClick(item)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Community Matches */}
                        {searchResults.community.length > 0 && (
                            <div className={styles.resultSection}>
                                <h3>👥 From Community</h3>
                                <div className={styles.communityGrid}>
                                    {searchResults.community.map(res => (
                                        <div key={res._id} className={styles.resourceCard} onClick={() => handleUserResourceClick(res)}>
                                            <div className={styles.icon}>📄</div>
                                            <div className={styles.details}>
                                                <h3>{res.title}</h3>
                                                <p>{res.subject} • {res.branch}</p>
                                                <span className={styles.meta}>Variable {res.year} Year</span>
                                            </div>
                                            {user && user.id === res.uploadedBy && (
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={(e) => handleDeleteResource(e, res._id)}
                                                    title="Delete Resource"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {searchResults.github.length === 0 && searchResults.community.length === 0 && (
                            <div className={styles.emptyState}>
                                No results found for "{searchQuery}". Try a different keyword.
                            </div>
                        )}
                    </div>
                </div>
            ) : !loading && (
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
                                        {user && user.id === res.uploadedBy && (
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={(e) => handleDeleteResource(e, res._id)}
                                                title="Delete Resource"
                                            >
                                                🗑️
                                            </button>
                                        )}
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
                    onClose={() => {
                        setPreviewItem(null);
                        setAiMode(null);
                    }}
                    fileUrl={previewItem.url}
                    title={previewItem.name}
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
