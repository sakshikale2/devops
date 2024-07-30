// Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Examiner Dashboard</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <Link to="/test-platform" className={styles.link}>
            <h2>Test Generation</h2>
            <p>Create new tests for candidates</p>
          </Link>
        </div>
        <div className={styles.card}>
          <Link to="/view-test" className={styles.link}>
            <h2>View Tests</h2>
            <p>View and manage existing tests</p>
          </Link>
        </div>
        <div className={styles.card}>
          <Link to="/view-scores" className={styles.link}>
            <h2>View Scores</h2>
            <p>Check the scores of completed tests</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;