import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import UserProfile from './components/UserProfile';
import EyeAnalysis from './components/EyeAnalysis';
import ReportView from './components/ReportView';
import Dashboard from './components/Dashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header currentUser={currentUser} />
        
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard currentUser={currentUser} />} 
          />
          <Route 
            path="/profile" 
            element={
              <UserProfile 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            } 
          />
          <Route 
            path="/analysis" 
            element={
              currentUser ? (
                <EyeAnalysis 
                  currentUser={currentUser} 
                  setCurrentAnalysis={setCurrentAnalysis}
                />
              ) : (
                <Navigate to="/profile" />
              )
            } 
          />
          <Route 
            path="/report/:reportId" 
            element={<ReportView />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;