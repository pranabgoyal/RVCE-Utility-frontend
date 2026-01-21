import styles from './FolderCard.module.css';

interface FolderCardProps {
    label: string;
    type: 'semester' | 'subject';
    count?: number;
    onClick: () => void;
}

export default function FolderCard({ label, type, count, onClick }: FolderCardProps) {
    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.icon}>
                {type === 'semester' ? '📅' : '📁'}
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{label}</h3>
                {type === 'subject' && <p className={styles.meta}>View Resources →</p>}
            </div>
        </div>
    );
}
