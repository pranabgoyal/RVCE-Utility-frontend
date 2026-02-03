'use client';
import styles from './about.module.css';

interface Contributor {
    name: string;
    usn: string;
    initials: string;
    role: string;
}

const contributors: Contributor[] = [
    { name: 'Isiri', usn: '1RV24CI042', initials: 'IS', role: 'Full Stack Developer' },
    { name: 'Arnav', usn: '1RV24CI022', initials: 'AR', role: 'Full Stack Developer' },
    { name: 'Aryan', usn: '1RV24CI024', initials: 'AY', role: 'Full Stack Developer' },
    { name: 'Aditya', usn: '1RV24CI013', initials: 'AD', role: 'Backend Engineer' },
    { name: 'Aarav', usn: '1RVCI148', initials: 'AA', role: 'Frontend Engineer' },
];

const techStack = [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'Node.js',
    'Express',
    'MongoDB',
    'Gemini AI',
    'Supabase'
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

                    <div style={{ marginTop: '2.5rem' }}>
                        <h3 className={styles.role} style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Built With</h3>
                        <div className={styles.techGrid}>
                            {techStack.map((tech) => (
                                <span key={tech} className={styles.techBadge}>{tech}</span>
                            ))}
                        </div>
                    </div>
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
                            <span className={styles.role}>{member.role}</span>
                            <span className={styles.usn}>{member.usn}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
