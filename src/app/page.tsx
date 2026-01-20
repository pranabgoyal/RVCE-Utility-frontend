import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✨ Your Academic Resources Hub</div>
          <h1 className={styles.title}>
            Access Notes.<br />
            Ace Exams.<br />
            <span className={styles.highlight}>Get Ahead.</span>
          </h1>
          <p className={styles.subtitle}>
            Your one-stop destination for engineering study materials — organized by year, branch, and subject.
          </p>
          <div className={styles.searchContainer}>
            <input type="text" placeholder="Search notes, papers, subjects..." className={styles.searchInput} />
            <button className={styles.searchBtn}>Search</button>
          </div>
          <div className={styles.tags}>
            <span>Popular:</span>
            <span className={styles.tag}>DSA Notes</span>
            <span className={styles.tag}>PYQs</span>
            <span className={styles.tag}>Lab Manuals</span>
            <span className={styles.tag}>DBMS</span>
          </div>
        </div>

        {/* Visual Decoration (Right Side in Screenshot) */}
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <span>📄 notes.pdf</span>
            </div>
            <div className={styles.visualList}>
              <div className={styles.visualItem}>
                <div className={styles.icon}>📚</div>
                <div>
                  <div className={styles.itemTitle}>Data Structures</div>
                  <div className={styles.itemSub}>Complete Notes • 2nd Year</div>
                </div>
                <span className={styles.badgeGreen}>PDF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Year Selection Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Select Your Year</h2>
        <p className={styles.sectionSub}>Get resources tailored to your academic level</p>
        <div className={styles.grid4}>
          {[1, 2, 3, 4].map((year) => (
            <div key={year} className={styles.card}>
              <div className={styles.cardIcon}>{year}</div>
              <h3>{year === 1 ? '1st' : year === 2 ? '2nd' : year === 3 ? '3rd' : '4th'} Year</h3>
              <p className={styles.cardDesc}>{year === 1 ? 'Foundation & Basics' : year === 4 ? 'Final Projects' : 'Core Engineering'}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
