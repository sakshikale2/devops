import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Notice 'Routes' instead of 'Switch'
import Dashboard from './pages/Dashboard/Dashboard';
import TestPlatform from './pages/TestPlatform/TestPlatform';
import TestCodeGenerator from './pages/TestCodeGenerator/TestCodeGenerator';
import ViewTests from './pages/ViewTests/ViewTests';
import TestScores from './pages/TestScores/TestScores';
import QuizApp from './pages/QuizApp/QuizApp'
import Student from './pages/Student/Student'
import AssignedTests from './pages/AssignedTests/AssignedTests'
import Login from './pages/login/Login';
import Signup from './pages/Signup/Signup';
import './pages/QuizApp/QuizApp.css';

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/test-platform" element={<TestPlatform />} />
          <Route path="/code-generator" element={<TestCodeGenerator />} />
          <Route path="/code-generator/:testId" element={<TestCodeGenerator />} />
          <Route path="/View-test" element={<ViewTests />} />
          <Route path="/view-scores" element={<TestScores />} />
          <Route path="/view-scores/:testId" element={<TestScores />} />
          <Route path="/assigned-tests/:candidateId/:candidateName" element={<AssignedTests />} />
          <Route path="/quiz-app/:candidateId/:candidateName/:testId" element={<QuizApp />} />
          <Route path="/student" element={<Student/>}/>

          {/* add other routes as needed */}
        </Routes>
      </Router>
    );
  };

export default App;