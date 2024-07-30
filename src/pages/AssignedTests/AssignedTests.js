import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './AssignedTests.module.css';

const AssignedTests = () => {
    const navigate = useNavigate();
    const { candidateId, candidateName } = useParams();
    const [assignedTests, setAssignedTests] = useState([]);

    useEffect(() => {
        const fetchAssignedTests = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/get-assigned-tests/${candidateId}`);
                console.log(response);
                if (response.status === 200) {
                    const data = response.data; // Since axios automatically parses JSON response
                    setAssignedTests(data);
                } else {
                    console.error('Failed to fetch assigned tests');
                }
            } catch (error) {
                console.error('Error fetching assigned tests:', error);
            }
        };
    
        fetchAssignedTests();
    }, [candidateId]); // Add candidateId to the dependency array

    const handleStartTest = (testId, testName) => {
        navigate(`/quiz-app/${candidateId}/${encodeURIComponent(candidateName)}/${testId}`);
    };

    return (
        <div className={styles.App}>
            <div className={styles.topHeading}>
                <div className={styles.heading}>Assigned Tests</div>
            </div>
            <div className={styles.studentInfo}>
                <p>Candidate ID: {candidateId}</p>
                <p>Candidate Name: {decodeURIComponent(candidateName)}</p>
            </div>
            <div className={styles.assignedTestsContainer}>
                <ul className={styles.testList}>
                    {assignedTests.map((test, index) => (
                        <li key={test.test_id} className={styles.testItem}>
                            <span className={styles.serialNumber}>{index + 1}.</span>
                            <span className={styles.testName}>{test.test_name}</span>
                            <button
                                className={styles.startButton}
                                onClick={() => handleStartTest(test.test_id, test.test_name)}
                            >
                                Start Test
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AssignedTests;
