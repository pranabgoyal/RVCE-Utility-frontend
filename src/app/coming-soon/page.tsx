'use client';
import Link from 'next/link';
import styles from './coming-soon.module.css';

export default function ComingSoon() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>🚧</div>
                <h1 className={styles.title}>Under Construction</h1>
                <p className={styles.subtitle}>
                    We're working hard to bring this feature to you. <br />
                    Check back soon!
                </p>
                <Link href="/" className={styles.homeBtn}>
                    Return Home
                </Link>
            </div>
        </div>
    );
}
