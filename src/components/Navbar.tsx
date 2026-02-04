'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🎓</span> EduDocs
                </Link>

                <div className={styles.links}>
                    <Link href="/dashboard" className={isActive('/dashboard') ? styles.activeLink : styles.link}>Home</Link>
                    <Link href="/resources" className={isActive('/resources') ? styles.activeLink : styles.link}>Resources</Link>
                    <Link href="/dashboard/pomodoro" className={isActive('/dashboard/pomodoro') ? styles.activeLink : styles.link}>Focus Timer</Link>
                    <Link href="/about" className={isActive('/about') ? styles.activeLink : styles.link}>About</Link>
                </div>

                <div className={styles.auth}>
                    <ThemeToggle />
                    {isAuthenticated && user ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userName}>Hi, {user.fullName.split(' ')[0]}</span>
                            <button onClick={logout} className={styles.logoutBtn}>Logout</button>
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" className={styles.loginBtn}>Log In</Link>
                            <Link href="/auth/signup" className={styles.signupBtn}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
