'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useTimer } from '@/context/TimerContext';

const Navbar = () => {
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();
    const { timeLeft, isActive, formatTime } = useTimer();

    const isActiveLink = (path: string) => pathname === path;

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🎓</span> EduDocs
                </Link>

                <div className={styles.links}>
                    <Link href="/dashboard" className={isActiveLink('/dashboard') ? styles.activeLink : styles.link}>Home</Link>
                    <Link href="/resources" className={isActiveLink('/resources') ? styles.activeLink : styles.link}>Resources</Link>
                    <Link href="/dashboard/pomodoro" className={isActiveLink('/dashboard/pomodoro') ? styles.activeLink : styles.link}>
                        {isActive ? `⏳ ${formatTime(timeLeft)}` : 'Focus Timer'}
                    </Link>
                    <Link href="/about" className={isActiveLink('/about') ? styles.activeLink : styles.link}>About</Link>
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
