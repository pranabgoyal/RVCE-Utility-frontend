'use client';
import styles from './about.module.css';

interface Contributor {
    name: string;
    usn: string;
    initials: string;
}

const contributors: Contributor[] = [
    { name: 'Isiri', usn: '1RV24CI042', initials: 'IS' },
    { name: 'Arnav', usn: '1RV24CI022', initials: 'AR' },
    { name: 'Aryan', usn: '1RV24CI024', initials: 'AY' },
    { name: 'Aditya', usn: '1RV24CI013', initials: 'AD' },
    { name: 'Aarav', usn: '1RVCI148', initials: 'AA' },
];

export default function AboutPage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Meet the Team</h1>
                <p className={styles.subtitle}>
                    The brilliant minds behind EduDocs. passionate about making engineering resources accessible for everyone.
                </p>
            </div>

            <div className={styles.grid}>
                {contributors.map((member, index) => (
                    <div key={member.usn} className={styles.card}>
                        <div className={styles.avatarWrapper}>
                            {member.initials}
                        </div>
                        <h3 className={styles.name}>{member.name}</h3>
                        <span className={styles.usn}>{member.usn}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
