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
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>About EduDocs</h1>
                <p className={styles.subtitle}>
                    Bridging the gap between students and resources with meaningful technology.
                </p>
            </header>

            {/* Mission Section */}
            <section className={styles.section}>
                <div className={styles.cardBox}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.missionText}>
                        To empower engineering students with a centralized, intelligent platform for academic resources.
                        We believe in open access to knowledge, peer-to-peer collaboration, and using AI to enhance
                        the learning experience.
                    </p>


                </div>
            </section>

            {/* Team Section */}
            <section className={styles.section} style={{ maxWidth: '1200px' }}>
                <h2 className={styles.sectionTitle}>Meet the Team</h2>
                <div className={styles.grid}>
                    {contributors.map((member) => (
                        <div key={member.usn} className={styles.card}>
                            <div className={styles.avatarWrapper}>
                                {member.initials}
                            </div>
                            <h3 className={styles.name}>{member.name}</h3>
                            <span className={styles.usn}>{member.usn}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
