// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import styles from './AssignedTests.module.css';

// const AssignedTests = () => {
//     const navigate = useNavigate();
//     const { candidateId, candidateName } = useParams();

//     const assignedTests = [
//         { testId: 1, testName: 'Math Test' },
//         { testId: 2, testName: 'Science Test' },
//         { testId: 3, testName: 'History Test' },
//     ];

//     const handleStartTest = (testId, testName) => {
//         navigate(`/quiz-app/${candidateId}/${encodeURIComponent(candidateName)}/${testId}`);
//     };

//     return (
//         <div className={styles.App}>
//             <div className={styles.topHeading}>
//                 <div className={styles.heading}>Assigned Tests</div>
//             </div>
//             <div className={styles.studentInfo}>
//                 <p>Candidate ID: {candidateId}</p>
//                 <p>Candidate Name: {decodeURIComponent(candidateName)}</p>
//             </div>
//             <div className={styles.assignedTestsContainer}>
//                 <ul className={styles.testList}>
//                     {assignedTests.map((test, index) => (
//                         <li key={test.testId} className={styles.testItem}>
//                             <span className={styles.serialNumber}>{index + 1}.</span>
//                             <span className={styles.testName}>{test.testName}</span>
//                             <button
//                                 className={styles.startButton}
//                                 onClick={() => handleStartTest(test.testId, test.testName)}
//                             >
//                                 Start Test
//                             </button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default AssignedTests;

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
                if (response.ok) {
                    const data = await response.json();
                    setAssignedTests(data);
                } else {
                    console.error('Failed to fetch assigned tests');
                }
            } catch (error) {
                console.error('Error fetching assigned tests:', error);
            }
        };

        fetchAssignedTests();
    }, [candidateId]);

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
