'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/resources?search=${encodeURIComponent(search)}`);
    }
  };

  const handleYearClick = (year: number) => {
    router.push(`/resources?year=${year}`);
  };

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
            <input
              type="text"
              placeholder="Search notes, papers, subjects..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
          </div>
          <div className={styles.tags}>
            <span>Popular:</span>
            <span className={styles.tag} onClick={() => router.push('/resources?category=Notes')}>DSA Notes</span>
            <span className={styles.tag} onClick={() => router.push('/resources?category=Paper')}>PYQs</span>
            <span className={styles.tag} onClick={() => router.push('/resources?category=Lab Manual')}>Lab Manuals</span>
            <span className={styles.tag} onClick={() => router.push('/resources?search=DBMS')}>DBMS</span>
          </div>
        </div>

        {/* Visual Decoration (Right Side in Screenshot) */}
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <span>🚀 Student Success</span>
            </div>
            <div className={styles.visualList}>
              <div className={styles.visualItem}>
                <div className={styles.icon}>🎯</div>
                <div>
                  <div className={styles.itemTitle}>Academic Excellence</div>
                  <div className={styles.itemSub}>Learn • Collaborate • Succeed</div>
                </div>
                <span className={styles.badgeGreen}>GOAL</span>
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
            <div key={year} className={styles.card} onClick={() => handleYearClick(year)}>
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
