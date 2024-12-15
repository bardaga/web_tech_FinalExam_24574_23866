import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ui/StudentProfile.css'; 

const StudentProfile = () => {
  const location = useLocation();
  const username = location.state?.username;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      const fetchStudentData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8081/api/students/email?email=${username}`
          );
          setStudent(response.data);
        } catch (err) {
          setError(
            err.response?.status === 404
              ? "Student not found"
              : "An error occurred while fetching data"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchStudentData();
    } else {
      setLoading(false);
      setError("Unauthorized access. Please log in again.");
    }
  }, [username]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="student-profile-container">
      <header className="header">
        <h1 className="system-title">AUC SmartStudentTracker System</h1>
      </header>

      {student ? (
        <div className="student-profile">
          <div className="profile-header">
            <h2>Welcome, {student.firstName}!</h2>
          </div>
          <div className="student-info-card">
            <h3 className="section-title">Student Profile</h3>
            <p><strong>Full Name:</strong> {student.firstName} {student.lastName}</p>
            <p><strong>Email:</strong> {student.email}</p>
            {student.studentClass && (
              <p><strong>Class:</strong> {student.studentClass.className}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="error-container">
          <p>No student data available.</p>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
