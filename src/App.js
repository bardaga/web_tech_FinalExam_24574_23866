import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Courses from './components/Courses';
import Attendance from './components/Attendance';
import GlobalSearch from './components/GlobalSearch';

import Classes from './components/Classes';
import Logout from './components/Logout';
import AuthPage from './components/AuthPage'; // Add this import
import TwoFactorAuth from './components/TwoFactorAuth'; 
import StudentProfile from './components/StudentProfile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} /> {/* Add this route */}
        <Route path="/2fa" element={<TwoFactorAuth/>} />
        <Route path="/student_profile" element={<StudentProfile/>} />
        <Route path="/dashboard" element={<Dashboard />}>
        
        
          <Route index element={<>Dashboard Overview</>} />
          <Route path="students" element={<Students />} />
          <Route path="classes" element={<Classes />} />
          <Route path="global-search" element={<GlobalSearch />} />
          <Route path="courses" element={<Courses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;