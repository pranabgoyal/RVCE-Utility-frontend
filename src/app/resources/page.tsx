'use client';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { getApiUrl } from '@/utils/api';
import styles from './resources.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResourceCard from '@/components/ResourceCard';
import FolderCard from '@/components/FolderCard';
import ResourcePreviewModal from '@/components/ResourcePreviewModal';
import { Resource } from '@/types';

export default function Resources() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewFile, setPreviewFile] = useState<{ url: string, title: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('All');

    // Navigation State: [] = Home, ['Sem 1'] = Sem 1, ['Sem 1', 'Math'] = Math
    const [currentPath, setCurrentPath] = useState<string[]>([]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                console.log('Fetching resources from:', `${getApiUrl()}/resources`);
                const res = await axios.get(`${getApiUrl()}/resources`);
                console.log('Fetched resources:', res.data);
                setResources(res.data);
            } catch (err) {
                console.error('Failed to fetch resources', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    // Filter Logic
    const filteredResources = useMemo(() => {
        return resources.filter(res => {
            const matchesBranch = selectedBranch === 'All' || res.branch === selectedBranch;
            const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                res.subject.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesBranch && matchesSearch;
        });
    }, [resources, selectedBranch, searchTerm]);

    // Grouping Logic (Only for Folder View)
    const groupedData = useMemo(() => {
        const data: Record<string, Record<string, Resource[]>> = {};
        filteredResources.forEach(res => {
            if (!data[res.semester]) data[res.semester] = {};
            if (!data[res.semester][res.subject]) data[res.semester][res.subject] = [];
            data[res.semester][res.subject].push(res);
        });
        return data;
    }, [filteredResources]);

    // Navigation Handlers
    const enterFolder = (name: string) => {
        setCurrentPath([...currentPath, name]);
    };

    const navigateToBreadcrumb = (index: number) => {
        setCurrentPath(currentPath.slice(0, index + 1));
    };

    const resetNavigation = () => {
        setCurrentPath([]);
        setSearchTerm(''); // Clear search when going home if desired, or keep it. Let's keep it independent.
    };

    const getCurrentView = () => {
        // 1. Search Mode: Flat List
        if (searchTerm) {
            if (filteredResources.length === 0) return <div className={styles.empty}>No matching results found.</div>;
            return filteredResources.map(res => (
                <ResourceCard
                    key={res._id}
                    resource={res}
                    onPreview={(url, title) => setPreviewFile({ url, title })}
                />
            ));
        }

        // 2. Folder Mode
        if (currentPath.length === 0) {
            // Level 0: Semesters
            const semesters = Object.keys(groupedData).sort();
            if (semesters.length === 0) return <div className={styles.empty}>No resources found for this filter.</div>;

            return semesters.map(sem => (
                <FolderCard
                    key={sem}
                    label={sem}
                    type="semester"
                    onClick={() => enterFolder(sem)}
                />
            ));
        }

        const [selectedSem, selectedSub] = currentPath;

        if (currentPath.length === 1) {
            // Level 1: Subjects
            const subjects = groupedData[selectedSem] ? Object.keys(groupedData[selectedSem]).sort() : [];
            if (subjects.length === 0) return <div className={styles.empty}>Folder is empty.</div>;

            return subjects.map(sub => (
                <FolderCard
                    key={sub}
                    label={sub}
                    type="subject"
                    onClick={() => enterFolder(sub)}
                />
            ));
        }

        if (currentPath.length === 2 && groupedData[selectedSem] && groupedData[selectedSem][selectedSub]) {
            // Level 2: Files
            return groupedData[selectedSem][selectedSub].map(res => (
                <ResourceCard
                    key={res._id}
                    resource={res}
                    onPreview={(url, title) => setPreviewFile({ url, title })}
                />
            ));
        }

        return <div className={styles.empty}>No items found.</div>;
    };

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1>Browse Resources</h1>
                    <div className={styles.controls}>
                        <div className={styles.searchWrapper}>
                            <span className={styles.searchIcon}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search by title or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className={styles.branchSelect}
                        >
                            <option value="All">All Branches</option>
                            <option value="CSE">CSE</option>
                            <option value="ISE">ISE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="ME">ME</option>
                            <option value="CV">CV</option>
                            <option value="AI&ML">AI&ML</option>
                        </select>
                    </div>
                </div>

                {!searchTerm && (
                    <nav className={styles.breadcrumbs}>
                        <span
                            className={currentPath.length === 0 ? styles.activeBreadcrumb : styles.breadcrumb}
                            onClick={resetNavigation}
                        >
                            Home
                        </span>
                        {currentPath.map((item, index) => (
                            <span key={item} className={styles.breadcrumbItem}>
                                <span className={styles.separator}>/</span>
                                <span
                                    className={index === currentPath.length - 1 ? styles.activeBreadcrumb : styles.breadcrumb}
                                    onClick={() => navigateToBreadcrumb(index)}
                                >
                                    {item}
                                </span>
                            </span>
                        ))}
                    </nav>
                )}
            </div>

            {loading ? (
                <div className={styles.loading}><LoadingSpinner /></div>
            ) : (
                <div className={styles.grid}>
                    {getCurrentView()}
                </div>
            )}

            {!!previewFile && (
                <ResourcePreviewModal
                    isOpen={!!previewFile}
                    onClose={() => setPreviewFile(null)}
                    fileUrl={previewFile.url}
                    title={previewFile.title}
                />
            )}
        </main>
    );
}
