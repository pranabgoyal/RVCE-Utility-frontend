import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.brandSection}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🎓</span> EduDocs
                    </div>
                    <p className={styles.description}>
                        Your one-stop destination for engineering study materials.
                        Access notes, papers, and resources organized by year and branch.
                    </p>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialIcon}>🐦</a>
                        <a href="#" className={styles.socialIcon}>🐙</a>
                        <a href="#" className={styles.socialIcon}>📧</a>
                    </div>
                </div>

                <div className={styles.linksSection}>
                    <div className={styles.column}>
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="/resources">Browse Documents</a></li>
                            <li><a href="/subjects">Subjects</a></li>
                            <li><a href="/papers">Previous Papers</a></li>
                            <li><a href="/lab-manuals">Lab Manuals</a></li>
                        </ul>
                    </div>
                    <div className={styles.column}>
                        <h3>Support</h3>
                        <ul>
                            <li><a href="/help">Help Center</a></li>
                            <li><a href="/contact">Contact Us</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                            <li><a href="/terms">Terms of Use</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <p>&copy; 2024 EduDocs. Helping engineering students succeed.</p>
                <p>Made with ❤️ for students</p>
            </div>
        </footer>
    );
};

export default Footer;
