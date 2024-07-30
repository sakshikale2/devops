import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './TestScores.module.css';

const TestScores = () => {
  const [filterTestId, setFilterTestId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async (testId, name, month, year) => {
      let url = 'http://localhost:5000/scores';
      const params = new URLSearchParams();
      if (testId) {
        params.append('testId', testId);
      } else if (name) {
        params.append('name', name);
      } else if (month && year) {
        // Parse month and year
        const [yearStr, monthStr] = filterDate.split('-');
        const monthNum = parseInt(monthStr, 10);
        const yearNum = parseInt(yearStr, 10);
        params.append('month', monthNum);
        params.append('year', yearNum);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Call Success:', data);
        setCandidates(data); // Set candidates with API data
        setFilteredCandidates(data); // Set filteredCandidates initially with API data
      } catch (error) {
        console.error('API Call Failed:', error);
        alert('Failed to load scores: ' + error.message); // Example error handling
      }
    };

    // Extract testId from location search parameter
    const searchParams = new URLSearchParams(location.search);
    const testId = searchParams.get('testId');

    if (testId) {
      fetchData(testId); // Fetch data when testId exists
    } else {
      fetchData(); // Fetch data when the component mounts
    }
  }, [location.search]); // Execute only when location.search changes

  const applyFilter = async () => {
    try{
      let url = 'http://localhost:5000/scores';
    
      if (activeFilter === 'testId') {
        url += `?testId=${filterTestId}`;
      } else if (activeFilter === 'name') {
        url += `?name=${encodeURIComponent(filterName)}`;
      } else if (activeFilter === 'date') {
        const [year, month] = filterDate.split('-').map(part => parseInt(part, 10)); // Parse both parts
        url += `?month=${month}&year=${year}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = await response.json();
      setFilteredCandidates(data); // Set filtered candidates based on API response
    } catch (error) {
      console.error('API Call Failed:', error);
      alert('Failed to load scores: ' + error.message); // Example error handling
    }
  };
  

  const clearFilters = async () => {
    try {
      const response = await fetch('http://localhost:5000/scores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = await response.json();
  
      setCandidates(data); // Set candidates with API data
      // setFilteredCandidates([]);
      setFilteredCandidates(data);
      setFilterTestId('');
      setFilterName('');
      setFilterDate('');
      setActiveFilter('');
    } catch (error) {
      console.error('API Call Failed:', error);
      alert('Failed to load scores: ' + error.message);
    }
  };  

  return (
    <div className={styles.tableContainer}>
      <h1 className={styles.title}>Test Scores</h1>
      <div className={styles.filterGroup}>
        <div className={styles.filterContainer}>
          <label htmlFor="testIdFilter">Filter by Test ID:</label>
          <input
            id="testIdFilter"
            type="text"
            value={filterTestId}
            onChange={(e) => { setFilterTestId(e.target.value); setActiveFilter('testId'); }}
            disabled={activeFilter && activeFilter !== 'testId'}
          />
        </div>
        <div className={styles.filterContainer}>
          <label htmlFor="nameFilter">Filter by Name:</label>
          <input
            id="nameFilter"
            type="text"
            value={filterName}
            onChange={(e) => { setFilterName(e.target.value); setActiveFilter('name'); }}
            disabled={activeFilter && activeFilter !== 'name'}
          />
        </div>
        <div className={styles.filterContainer}>
          <label htmlFor="dateFilter">Filter by Month:</label>
          <input
            id="dateFilter"
            type="month"
            value={filterDate}
            onChange={(e) => { setFilterDate(e.target.value); setActiveFilter('date'); }}
            disabled={activeFilter && activeFilter !== 'date'}
          />
        </div>
      </div>
      <button onClick={applyFilter} className={styles.button}>Apply Filter</button>
      <button onClick={clearFilters} className={styles.button}>Clear Filters</button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Candidate ID</th>
            <th>Name</th>
            <th>Score</th>
            <th>Test Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredCandidates.map(candidate => (
            <tr key={candidate.candidateId}>
              <td>{candidate.testId}</td>
              <td>{candidate.candidateId}</td>
              <td>{candidate.candidateName}</td>
              <td>{candidate.score}/{candidate.total_marks}</td>
              <td>{candidate.testDate ? new Date(candidate.testDate).toLocaleDateString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestScores;