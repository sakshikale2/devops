import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ViewTests.module.css';
import AlertModal from './AlertModal';

const ViewTests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };

  useEffect(() => {
    const fetchTokenAndUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-examiner-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        console.log('Token data:', data); // Logging token data for debugging
        setJwtToken(data.token);

        // Fetch user ID and roles
        const userInfoResponse = await fetch('http://localhost:5000/get-examiner-role', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error(`HTTP status ${userInfoResponse.status}`);
        }

        const userInfoData = await userInfoResponse.json();
        console.log('User info data:', userInfoData); // Logging user info data for debugging
        setUserId(userInfoData.userId);
        setRoles(userInfoData.roles);
        setPermissions(userInfoData.permissions);
      } catch (error) {
        console.error('Failed to fetch token and user info:', error);
        showAlert('Failed to load token and user info: ' + error.message);
      }
    };

    fetchTokenAndUserInfo();
  }, []);

  useEffect(() => {
    if (!jwtToken || !permissions.length) return;

    const fetchTests = async () => {
      try {
        if (!permissions.includes('view_tests')) {
          showAlert('You do not have permission to view tests.');
          return;
        }

        const response = await fetch('http://localhost:5000/view-tests', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Call Success:', data);

        const mappedTests = data.map(test => ({
          testId: test.id,
          created: formatDate(test.CreatedDateTime),
          name: test.name,
          configuration: parseTestConfig(test.testConfig),
          isEnabled: test.testStatus === 'ACTIVE',
          answerKey: test.newField2,
        }));

        setTests(mappedTests);
      } catch (error) {
        console.error('API Call Failed:', error);
        showAlert('Failed to load tests: ' + error.message);
      }
    };

    fetchTests();
  }, [jwtToken, permissions]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const parseTestConfig = (testConfigString) => {
    try {
      const testConfig = JSON.parse(testConfigString);
      const noOfSets = testConfig.staticOptions ? testConfig.staticOptions.No_of_sets : 'N/A';
      return (
        <div>
          <h4>Question Configs:</h4>
          <ul>
            {testConfig.Question_configs.map((config, index) => (
              <li key={index}>
                Question Type: {config.Que_type}, Topic: {config.Topic}, No of questions: {config.numberOfQuestions}
              </li>
            ))}
          </ul>
          <p>Complexity: {testConfig.Complexity}<br />Pass Percentage: {testConfig.PassPercentage}<br />Test Type: {testConfig.TestType}<br />No of sets: {noOfSets}</p>
        </div>
      );
    } catch (error) {
      console.error('Failed to parse test configuration:', error);
      return 'Error parsing configuration';
    }
  };

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const toggleTestEnablement = async (testId) => {
    if (!hasPermission('manage_tests')) {
      showAlert('You do not have permission to manage tests.');
      return;
    }

    try {
      const test = tests.find(t => t.testId === testId);
      const newStatus = test.isEnabled ? 'INACTIVE' : 'ACTIVE';

      const response = await fetch(`http://localhost:5000/update-test-status/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();

      setTests(prevTests => {
        console.log('Previous Tests:', prevTests);
        const updatedTests = prevTests.map(test =>
          test.testId === testId ? { ...test, isEnabled: !test.isEnabled } : test
        );
        console.log('Updated Tests:', updatedTests);
        return updatedTests;
      });

      console.log('API Call Success:', data.message);

      if (newStatus === 'INACTIVE') {
        stopQuiz(testId);
      }

    } catch (error) {
      console.error('Error updating test status:', error);
      showAlert('Failed to update test status: ' + error.message);
    }
  };

  const stopQuiz = (testId) => {
    console.log(`Quiz with ID ${testId} has been stopped.`);
  };

  const handleTestAssignmentClick = (testId) => {
    if (!hasPermission('assign_tests')) {
      showAlert('You do not have permission to assign tests.');
      return;
    }
    navigate(`/code-generator/${testId}`);
  };

  const handleViewScoresClick = async (testId) => {
    if (!hasPermission('view_scores')) {
      showAlert('You do not have permission to view scores.');
      return;
    }
    navigate(`/view-scores?testId=${testId}`);
  };

  const handleAnswerKeyClick = async (testId) => {
    if (!hasPermission('view_answer_key')) {
      showAlert('You do not have permission to view answer keys.');
      return;
    }
    const setNo = prompt('Enter Set Number:');
    if (!setNo) {
      showAlert('Set number is required');
      return;
    }

    console.log(`View button clicked for View Questions and Answer of Test ID ${testId}`);
    try {
      const response = await fetch(`http://localhost:5000/view-anskey?testID=${testId}&set_no=${setNo}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const answerKey = await response.text();
      console.log('Answer Key:', answerKey);

      showAlert(answerKey);
    } catch (error) {
      console.error('Failed to fetch answer key:', error);
      showAlert('Failed to fetch answer key: ' + error.message);
    }
  };

  const handleRegenerateTestClick = async (testId) => {
    if (!hasPermission('regenerate_tests')) {
      showAlert('You do not have permission to regenerate tests.');
      return;
    }

    const setNo = prompt('Enter Set Number:');
    if (!setNo) {
      showAlert('Set number is required');
      return;
    }

    const feedback = prompt('Enter Feedback:');
    if (!feedback) {
      showAlert('Feedback is required');
      return;
    }

    console.log(`Regenerate button clicked for Test ID ${testId}`);
    try {
      const response = await fetch(`http://localhost:5000/regenerate-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
          testID: testId,
          set_no: setNo,
          feedback: feedback
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const result = await response.text();
      console.log('Regenerated Test:', result);

      showAlert('Test regenerated successfully\n' + result);
    } catch (error) {
      console.error('Failed to regenerate test:', error);
      showAlert('Failed to regenerate test: ' + error.message);
    }
  };

  return (
    <div>
      <h1>Available Tests</h1>
      {tests && tests.length === 0 ? (
        <p>No tests available</p>
      ) : (
        <div className={styles.container}>
          {tests && tests.map(test => (
            <div key={test.testId} className={styles.testCard}>
              <h3>{test.name}</h3>
              <p><strong>Created:</strong> {test.created}</p>
              <div>{test.configuration}</div>
              <p><strong>Status:</strong> {test.isEnabled ? 'Active' : 'Inactive'}</p>
              <button onClick={() => toggleTestEnablement(test.testId)}>
                {test.isEnabled ? 'Disable' : 'Enable'}
              </button>
              {test.isEnabled && (
                <>
                  <button onClick={() => handleTestAssignmentClick(test.testId)}>Generate Code</button>
                  <button onClick={() => handleViewScoresClick(test.testId)}>View Scores</button>
                  <button onClick={() => handleAnswerKeyClick(test.testId)}>View Answer Key</button>
                  <button onClick={() => handleRegenerateTestClick(test.testId)}>Regenerate Test</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <AlertModal
        message={alertMessage}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
};

export default ViewTests;
