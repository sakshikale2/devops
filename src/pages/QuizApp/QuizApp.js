import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './QuizApp.css';

function QuizApp() {
    const { candidateId, candidateName, testId } = useParams(); 
    const [questions, setQuestions] = useState([]);
    const [currentSection, setCurrentSection] = useState('');
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(300);
    const [studentName] = useState(decodeURIComponent(candidateName));
    const [testID] = useState(testId);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [questionTypes, setQuestionTypes] = useState([]);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [disabledButtons, setDisabledButtons] = useState({});

    useEffect(() => {
        console.log('Current section:', currentSection);
    }, [currentSection]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchQuestionTypes = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/question-types/${testID}`);
                setQuestionTypes(response.data.question_types);
            } catch (error) {
                console.error("There was an error fetching the question types!", error);
            }
        };
        fetchQuestionTypes();
    }, [testID]);
    

    const handleSectionClick = async (section) => {
        setCurrentSection(section);
        try {
            const response = await axios.get('http://localhost:5000/test/qapaper', {
                params: {
                    testId: testID,
                    questionType: section,
                    candidateId: candidateId 
                }
            });
            console.log(response.data);
            if (section === 'Descriptive') {
                const allLines = response.data.split('\n');
                const filteredQuestions = allLines.filter(line => line.trim().match(/^\d+[.)]/)); // Removed unnecessary escape characters
                setQuestions(filteredQuestions);
            } else {
                setQuestions(response.data.split('\n'));
            }
            // setAnswers({});
        } catch (error) {
            console.error("There was an error fetching the questions!", error);
        }
    };

    const handleChangeAnswer = (e, index) => {
        const { value } = e.target;
        setAnswers(prevAnswers => ({ ...prevAnswers, [index]: value }));
    };

    const handleSubmit = async () => {
        console.log("Submit button clicked");
        setDisabledButtons(prevState => ({ ...prevState, [currentSection]: true }));

        let formattedAnswers;
        if (currentSection === 'Descriptive') {
            formattedAnswers = Object.entries(answers)
                .map(([index, answer]) => `${parseInt(index) + 1}. ${answer}`)
                .join('\n');
        } else {
            formattedAnswers = answers[currentSection];
        }

        try {
            const response = await axios.post('http://localhost:5000/submit-test', {
                candidateId: candidateId,
                testId: testId,
                questionType: currentSection,
                testAns: formattedAnswers
            });
            console.log(response.data);
            setSubmissionStatus('success');
            setTimeout(() => {
                setSubmissionStatus(null);
            }, 3000);
        } catch (error) {
            console.error('There was an error submitting the test:', error);
            setSubmissionStatus('error');
            setDisabledButtons(prevState => ({ ...prevState, [currentSection]: false })); // Re-enable the button on error
            setTimeout(() => {
                setSubmissionStatus(null);
            }, 3000);
        }
    };

    useEffect(() => {
        if (submissionStatus === 'success') {
            alert('Your answers have been successfully submitted!');
        } else if (submissionStatus === 'error') {
            alert('There was an error submitting your answers. Please try again.');
        }
    }, [submissionStatus]);

    return (
        <div className="App">
            <div className='top-heading'>
                <div className='heading'>Hirademy Test Portal</div>
                <div className="time-remaining">
                    Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? `0${timeRemaining % 60}` : timeRemaining % 60}
                    <br />
                    Current Time: {currentTime}
                </div>
            </div>
            <div className="student-info">
                <p>Student Name: {studentName}</p>
                <p>Test ID: {testID}</p>
            </div>
            <div className='hold'>
                <div className="left-panel">
                    {questionTypes.map((type, index) => (
                        <button key={index} onClick={() => handleSectionClick(type)}>{type}</button>
                    ))}
                </div>
                {currentSection === 'MCQ' && (
                <>
                    <div className="middle-section">
                        {questions.map((question, index) => (
                            <div key={index}>{question}</div>
                        ))}
                    </div>
                    <div className="right-panel">
                        <textarea
                            name="answer-MCQ"
                            placeholder='Sample Answer - &#13;1. A&#13;2. B'
                            onChange={(e) => handleChangeAnswer(e, 'MCQ')}
                            value={answers['MCQ'] || ''}
                        />
                        <div className="button-container">
                            <button 
                                onClick={handleSubmit} 
                                disabled={disabledButtons['MCQ']} 
                                className={disabledButtons['MCQ'] ? 'disabled' : ''}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </>
                )}
                {currentSection === 'Descriptive' && (
                    <div className="vertical-layout">
                        {questions.map((question, index) => (
                            <div key={index} className="vertical-question">
                                <p>{question}</p>
                                <textarea
                                    name={`answer-${index}`}
                                    placeholder="Type your answer here..."
                                    onChange={(e) => handleChangeAnswer(e, index)}
                                    value={answers[index] || ''}
                                />
                            </div>
                        ))}
                        <div className="button-container">
                            <button 
                                onClick={handleSubmit} 
                                disabled={disabledButtons['Descriptive']} 
                                className={disabledButtons['Descriptive'] ? 'disabled' : ''}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuizApp;
