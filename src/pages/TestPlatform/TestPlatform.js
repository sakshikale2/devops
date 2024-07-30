import React, { useState, useEffect } from "react";
import styles from "./TestPlatform.module.css";
import { useNavigate } from "react-router-dom";

function TestPlatform() {
  const [sections, setSections] = useState([
    {
      Que_type: "mcq",
      Topic: "aptitude",
      numberOfQuestions: 0,
    },
  ]);
  const [testType, setTestType] = useState("");
  const [staticOptions, setStaticOptions] = useState({ numberOfSets: 0 });
  const [passPercentage, setPassPercentage] = useState("");
  const [complexity, setComplexity] = useState("easy");
  const [testName, setTestName] = useState("");
  const [examinerId, setExaminerId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [jwtToken, setJwtToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
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
        setJwtToken(data.token);
      } catch (error) {
        console.error('Failed to fetch token:', error);
        //alert('Failed to load token: ' + error.message); // Assuming you meant to use alert instead of showAlert
      }
    };
  
    fetchToken();
  }, []);
  

  const addSection = () => {
    const newSection = {
      Que_type: "mcq",
      Topic: "aptitude",
      numberOfQuestions: 0,
    };
    setSections((prevSections) => [...prevSections, newSection]);
  };

  const removeSection = (index) => {
    setSections((prevSections) => prevSections.filter((_, i) => i !== index));
  };

  const handleTestTypeChange = (event) => {
    setTestType(event.target.value);
  };

  const handleNumberOfSetsChange = (event) => {
    setStaticOptions({
      ...staticOptions,
      numberOfSets: Number(event.target.value),
    });
  };

  const generateTest = async () => {
    if (!jwtToken) {
      alert("Token not available. Please wait a moment.");
      return;
    }

    setIsGenerating(true);
    const testConfig = {
      name: testName,
      testConfigJson: {
        Question_configs: sections,
        TestType: testType,
        PassPercentage: passPercentage,
        Complexity: complexity,
        staticOptions: {
          No_of_sets: staticOptions.numberOfSets,
        },
      },
      examinerID: examinerId, // Use the correct key
    };

    try {
      const response = await fetch("http://localhost:5000/generate-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`, // Include token in headers
        },
        body: JSON.stringify(testConfig),
      });

      if (!response.ok) {
        throw new Error("Failed to generate test");
      }

      const testId = await response.text(); // Get the test ID from the response
      navigate(`/code-generator/${testId}`);
    } catch (error) {
      console.error("Failed to generate test:", error);
      alert("Failed to generate test: " + error.message);
    } finally {
      setIsGenerating(false); // Re-enable the button after API call completes
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Test Generation</h2>
      {sections.map((section, index) => (
        <div key={index} className={styles.section}>
          <div className={styles.input}>
            <label className={styles.label}>Question Type</label>
            <select
              className={styles.select}
              value={section.Que_type}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[index].Que_type = e.target.value;
                setSections(newSections);
              }}
            >
              <option value="mcq">MCQ</option>
              <option value="descriptive">Descriptive</option>
            </select>
          </div>
          <div className={styles.input}>
            <label className={styles.label}>Test Topic</label>
            <select
              className={styles.select}
              value={section.Topic}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[index].Topic = e.target.value;
                setSections(newSections);
              }}
            >
              <option value="aptitude">Aptitude</option>
              <option value="technical">Technical</option>
              <option value="dsa">DSA</option>
            </select>
          </div>
          <div className={styles.input}>
            <label className={styles.label}>Number of Questions</label>
            <input
              type="number"
              className={styles.input}
              placeholder="Enter number of questions"
              value={section.numberOfQuestions}
              min="1"
              onChange={(e) => {
                const newSections = [...sections];
                newSections[index].numberOfQuestions = e.target.value;
                setSections(newSections);
              }}
            />
          </div>
          {index > 0 && (
            <button
              type="button"
              className={`${styles.button} ${styles.removeButton}`}
              onClick={() => removeSection(index)}
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button type="button" className={styles.button} onClick={addSection}>
        Add Section
      </button>
      <div className={styles.input}>
        <label className={styles.label}>Test Name</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter test name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        />
      </div>
      <div className={styles.input}>
        <label className={styles.label}>Pass Percentage</label>
        <input
          type="number"
          className={styles.input}
          placeholder="Enter pass percentage"
          value={passPercentage}
          min="0"
          onChange={(e) => setPassPercentage(e.target.value)}
        />
      </div>
      <div className={styles.input}>
        <label className={styles.label}>Complexity</label>
        <select
          className={styles.select}
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div className={styles.input}>
        <label className={styles.label} htmlFor="testType">
          Test Type
        </label>
        <select
          id="testType"
          className={styles.select}
          value={testType}
          onChange={handleTestTypeChange}
        >
          <option value="">Select a Test Type</option>
          <option value="static">Static</option>
          <option value="dynamic">Dynamic</option>
        </select>
      </div>

      {testType === "static" && (
        <div className={styles.input}>
          <label className={styles.label} htmlFor="numberOfSets">
            Number of Sets
          </label>
          <input
            id="numberOfSets"
            type="number"
            className={styles.inputField}
            value={staticOptions.numberOfSets}
            min="1"
            max="5"
            onChange={handleNumberOfSetsChange}
            placeholder="Enter number of sets"
          />
        </div>
      )}

      <div className={styles.input}>
        <label className={styles.label}>Examiner ID</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter examiner ID"
          value={examinerId}
          onChange={(e) => setExaminerId(e.target.value)}
        />
      </div>

      <button
        className={styles.button}
        onClick={generateTest}
        disabled={isGenerating}
      >
        {isGenerating ? "Generating..." : "Generate Test"}
      </button>
    </div>
  );
}

export default TestPlatform;
