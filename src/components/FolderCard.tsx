import styles from './FolderCard.module.css';

interface FolderCardProps {
    label: string;
    type: 'semester' | 'subject' | 'file';
    onClick: () => void;
}

const FolderCard = ({ label, type, onClick }: FolderCardProps) => {
    // Determine icon based on type
    let icon = '📁';
    if (type === 'file') {
        if (label.endsWith('.pdf')) icon = '📄';
        else if (label.match(/\.(jpg|jpeg|png)$/i)) icon = '🖼️';
        else icon = '📃';
    } else if (type === 'semester') {
        icon = '📚';
    }

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.label} title={label}>{label}</div>
        </div>
    );
};

export default FolderCard;
