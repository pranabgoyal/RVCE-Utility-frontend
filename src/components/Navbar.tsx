'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🎓</span> EduDocs
                </Link>

                <div className={styles.links}>
                    <Link href="/courses" className={styles.link}>Courses</Link>
                    <Link href="/resources" className={isActive('/resources') ? styles.activeLink : styles.link}>Resources</Link>
                    <Link href="/about" className={styles.link}>About</Link>
                </div>

                <div className={styles.auth}>
                    <Link href="/auth/login" className={styles.loginBtn}>Log In</Link>
                    <Link href="/auth/signup" className={styles.signupBtn}>Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
