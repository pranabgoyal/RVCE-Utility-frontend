import styles from './ResourceCard.module.css';
import { Resource } from '@/types';

interface ResourceCardProps {
    resource: Resource;
    onPreview: (url: string, title: string) => void;
}

import { getApiUrl } from '@/utils/api';

export default function ResourceCard({ resource, onPreview }: ResourceCardProps) {
    const getDownloadUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;

        const backendBase = getApiUrl().replace(/\/api$/, '');
        return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };
    const fullUrl = getDownloadUrl(resource.fileUrl);

    return (
        <div className={styles.card}>
            <div className={styles.icon}>📄</div>
            <div className={styles.content}>
                <h3 className={styles.title} title={resource.title}>{resource.title}</h3>
                <p className={styles.meta}>
                    {resource.branch} • {resource.category}
                </p>
                {resource.subject && <p className={styles.subMeta}>{resource.subject}</p>}
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.actionBtn}
                    onClick={() => onPreview(fullUrl, resource.title)}
                    title="Preview"
                >
                    👁️
                </button>
                <a
                    href={fullUrl}
                    download
                    className={styles.actionBtn}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download"
                >
                    ⬇
                </a>
            </div>
        </div>
    );
}
