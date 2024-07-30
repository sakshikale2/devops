import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Student.css';

function Student() {
    const [candidateName, setCandidateName] = useState('');
    const [candidateEmail, setCandidateEmail] = useState('');
    const [candidateNumber, setCandidateNumber] = useState('');
    const [candidateTestCode, setCandidateTestCode] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/check-code?email=${encodeURIComponent(candidateEmail)}&testCode=${encodeURIComponent(candidateTestCode)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP status ${response.status}`);
            }

            const data = await response.json(); // Get response as text

            // Verify the test code and email
            if (data.message === "Allow") {
                const { candidateId, candidateName } = data;
                navigate(`/assigned-tests/${candidateId}/${encodeURIComponent(candidateName)}`)
            } else {
                alert('Invalid email ID or test code.');
            }
        } catch (error) {
            console.error('API Call Failed:', error);
            alert('Failed to start test: ' + error.message);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Candidate Test Portal</h2>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="candidateName" className="label">Your Name</label>
                        <input
                            type="text"
                            id="candidateName"
                            className="input"
                            placeholder="Enter your name"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="candidateEmail" className="label">Your Email</label>
                        <input
                            type="email"
                            id="candidateEmail"
                            className="input"
                            placeholder="Enter your email"
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="candidateNumber" className="label">Contact Number</label>
                        <input
                            type="tel"
                            id="candidateNumber"
                            className="input"
                            placeholder="Enter your contact number"
                            value={candidateNumber}
                            onChange={(e) => setCandidateNumber(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="candidateTestCode" className="label">Test Code</label>
                        <input
                            type="text"
                            id="candidateTestCode"
                            className="input"
                            placeholder="Enter your Test Code"
                            value={candidateTestCode}
                            onChange={(e) => setCandidateTestCode(e.target.value)}
                        />
                    </div>
                    <div className="guidelines">
                        <p>Please read the following guidelines carefully before starting the test:</p>
                        <ul>
                            <li>Ensure you have a stable internet connection</li>
                            <li>Do not reload or navigate away from the test page</li>
                            <li>Do not use any unfair means</li>
                            <li>Kindly finish the test in one sitting only</li>
                        </ul>
                    </div>
                    <div className="form-group button-container">
                        <button type="submit" className="button">View Assigned Tests</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Student;