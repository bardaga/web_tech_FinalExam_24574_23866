import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TwoFactorAuth = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Effect to retrieve username from navigation state
  useEffect(() => {
    const passedUsername = location.state?.username;

    if (!passedUsername) {
      // Redirect back to login if username is missing
      navigate('/login');
      return;
    }

    setUsername(passedUsername);
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Retrieve the initial auth token from localStorage
      const initialAuthToken = localStorage.getItem('initialAuthToken');

      // Verify 2FA
      const response = await axios.post(
        'http://localhost:8081/api/auth/verify-2fa',
        { username, code: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${initialAuthToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data) {
        // On successful verification
        localStorage.removeItem('initialAuthToken');
        localStorage.setItem('authToken', response.data.token);

        // Fetch the role only after successful 2FA
        const roleResponse = await axios.get(`http://localhost:8081/api/users/role`, {
          params: { email: username },
          headers: {
            Authorization: `Bearer ${response.data.token}`, // Pass the new token
          }
        });

        const fetchedRole = roleResponse.data;
        setRole(fetchedRole);

        // Role-based navigation after fetching role
        if (fetchedRole === 'admin') {
          navigate('/dashboard');
        } else if (fetchedRole === 'student') {
          navigate('/student_profile', { state: { username } }); // Pass username to /student_profile
        } else {
          setError('Invalid role. Please contact support.');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">Unauthorized access. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
        <div className="text-center mb-4">
          <p className="text-gray-600">Verifying for:</p>
          <p className="text-xl font-semibold">{username}</p>
        </div>
        <p className="text-center mb-4">Please check your email and enter the 6-digit verification code</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-2 rounded-md transition duration-300 
              ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
