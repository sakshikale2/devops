import React, { useState } from 'react';
import styles from './TestCodeGenerator.module.css';
import { useParams } from 'react-router-dom';

function TestCodeGenerator() {
    const [emailIds, setEmailIds] = useState('');
    const [message, setMessage] = useState('');
    const { testId } = useParams();

    const handleAssignCodes = async () => {
        if (!testId.trim()) {
            setMessage('Please enter Test ID.');
            return;
        }
        if (!emailIds.trim()) {
            setMessage('Please enter email IDs.');
            return;
        }
        
        const emailsArray = emailIds.split(',').map(email => email.trim());

        try {
            const response = await fetch('http://localhost:5000/assgnCodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    candidateEmails: emailsArray,
                    testId: testId.trim()
                })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'test_codes.csv');

                // Remove existing file if it exists
                const existingFile = document.querySelector('a[download="test_codes.csv"]');
                if (existingFile) {
                    document.body.removeChild(existingFile);
                }

                document.body.appendChild(link);
                link.click();
                setMessage('Successfully assigned test codes and downloaded the sheet.');
            } else {
                setMessage('Failed to assign test codes.');
            }
        } catch (error) {
            setMessage('Failed to assign test codes.');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Test Assignment</h1>
            <div className={styles.instructions}>
                <ol>
                    <li>Enter comma-separated list of email IDs of candidates.</li>
                    <li>The maximum allowed number of email IDs is 500.</li>
                    <li>On click of "Assign/Fetch Test Codes", the sheet of email IDs and their test codes will be downloaded.</li>
                    <li>You can share it with candidates for taking the test.</li>
                </ol>
            </div>
            <div className={styles.testIdLabel}>
                <label htmlFor="testId">Test ID:</label>
                <div id="testId" className={styles.testIdValue}>{testId}</div>
            </div>
            <textarea
                className={styles.emailList}
                placeholder="Enter email IDs separated by commas..."
                value={emailIds}
                onChange={(e) => setEmailIds(e.target.value)}
                maxLength="5000"
            />
            <button className={styles.button} onClick={handleAssignCodes}>Assign/Fetch Test Codes</button>
            {message && <div className={styles.message}>{message}</div>}
        </div>
    );
}

export default TestCodeGenerator;
