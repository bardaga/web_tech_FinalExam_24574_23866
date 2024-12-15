import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = 'http://localhost:8081/api/auth';

const AuthPage = () => {
  const navigate = useNavigate();

  // State for toggling between login, signup, and forgot password
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorUsername, setTwoFactorUsername] = useState('');

  // const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);

  // Consolidated password visibility state
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: ''
  });

  // Two-Factor Authentication state
  const [twoFactorData, setTwoFactorData] = useState({
    username: '',
    verificationCode: ''
  });
    // Signup form state
    const [signupData, setSignupData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  
    // Forgot password state
    const [resetData, setResetData] = useState({
      email: '',
      resetCode: '',
      newPassword: '',
      resetStage: 'email' // 'email' or 'code'
    });

  // Error state
  const [errors, setErrors] = useState({
    login: '',
    twoFactor: '',
    signup: {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Loading states
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle login input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear login error when user starts typing
    if (errors.login) {
      setErrors(prev => ({ ...prev, login: '' }));
    }
  };
  const validateSignup = () => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };

    // Username validation
    if (!signupData.username) {
      newErrors.username = 'Username is required';
    } else if (signupData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(signupData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Update errors
    setErrors(prev => ({
      ...prev,
      signup: newErrors
    }));

    // Check if any errors exist
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific signup error when user starts typing
    if (errors.signup[name]) {
      setErrors(prev => ({
        ...prev,
        signup: {
          ...prev.signup,
          [name]: ''
        }
      }));
    }
  };

// Handle login submission
const handleLogin = async (e) => {
  e.preventDefault();

  // Basic validation
  if (!loginData.usernameOrEmail || !loginData.password) {
    setErrors(prev => ({
      ...prev,
      login: 'Username/email and password are required'
    }));
    return;
  }

  setIsLoginLoading(true);
  setErrors(prev => ({ ...prev, login: '', twoFactor: '' }));

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Login response:', response.data);

    // Store the login token
    localStorage.setItem('initialAuthToken', response.data.token);

    // Always navigate to 2FA with the username and role
    navigate('/2fa', {
      state: {
        username: loginData.usernameOrEmail,
        role: response.data.roles // Include the roles field
      }
    });

  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);

    const errorMessage = error.response?.data?.error || error.response?.data || 'Login failed. Please try again.';

    setErrors(prev => ({
      ...prev,
      login: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
    }));
  } finally {
    setIsLoginLoading(false);
  }
};

  
  // Handle Two-Factor Authentication Verification
  const handleTwoFactorVerification = async (e) => {
    e.preventDefault();
  
    // Validate 2FA code
    if (!twoFactorData.verificationCode || twoFactorData.verificationCode.length !== 6) {
      setErrors(prev => ({ 
        ...prev, 
        twoFactor: 'Please enter a valid 6-digit code' 
      }));
      return;
    }
  
    try {
      // Get the initial login token
      const initialToken = localStorage.getItem('initialAuthToken');
      
      const response = await axios.post(`${API_BASE_URL}/verify-2fa`, {
        username: twoFactorData.username,
        code: twoFactorData.verificationCode,
        initialToken: initialToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('2FA verification response:', response.data);
  
      // Two-factor authentication successful
      localStorage.setItem('authToken', response.data.token);
      
      // Remove the initial token
      localStorage.removeItem('initialAuthToken');
      
      // Reset two-factor states
      setTwoFactorRequired(false);
      setTwoFactorData(prev => ({
        ...prev,
        verificationCode: ''
      }));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('2FA verification error:', error.response ? error.response.data : error.message);
      
      const errorMessage = error.response?.data?.error || error.response?.data || 'Two-factor authentication failed';
      
      setErrors(prev => ({ 
        ...prev, 
        twoFactor: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
      }));
    }
  };
  
  // Resend Two-Factor Code
  const resendTwoFactorCode = async () => {
    try {
      const initialToken = localStorage.getItem('initialAuthToken');
      
      const response = await axios.post(`${API_BASE_URL}/resend-2fa-code`, {
        username: twoFactorData.username,
        initialToken: initialToken
      });
      
      console.log('Resend 2FA code response:', response.data);
      
      alert('A new verification code has been sent to your email');
    } catch (error) {
      console.error('Failed to resend two-factor code', error);
      setErrors(prev => ({ 
        ...prev, 
        twoFactor: 'Failed to resend verification code' 
      }));
    }
  };
  
  const renderTwoFactorForm = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
        
        {errors.twoFactor && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errors.twoFactor}
          </div>
        )}

        <form onSubmit={handleTwoFactorVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter 6-digit code sent to your email
            </label>
            <input
              type="text"
              value={twoFactorData.verificationCode}
              onChange={(e) => {
                // Allow only numeric input and limit to 6 digits
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setTwoFactorData(prev => ({
                  ...prev,
                  verificationCode: value
                }));
                // Clear any previous error when user starts typing
                if (errors.twoFactor) {
                  setErrors(prev => ({ ...prev, twoFactor: '' }));
                }
              }}
              maxLength="6"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
              placeholder="Enter 6-digit code"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Verify Code
          </button>
  
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={resendTwoFactorCode}
              className="text-blue-600 hover:underline"
            >
              Resend Verification Code
            </button>
          </div>
        </form>
      </div>
    );
  };

  
  // const handleTwoFactorVerification = async (e) => {
  //   e.preventDefault();
  
  //   try {
  //     const response = await axios.post(`${API_BASE_URL}/verify-two-factor`, {
  //       username: twoFactorUsername,
  //       code: twoFactorCode
  //     });
  
  //     // Two-factor authentication successful
  //     localStorage.setItem('authToken', response.data.token);
  //     navigate('/dashboard');
  //   } catch (error) {
  //     const errorMessage = error.response?.data || 'Two-factor authentication failed';
  //     setErrors(prev => ({ ...prev, login: errorMessage }));
  //   }
  // };
  
  const enableTwoFactor = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/enable-two-factor`, {
        username: twoFactorUsername
      });
      
      // Optionally show a message that a new code has been sent
      alert('A new verification code has been sent to your email');
    } catch (error) {
      console.error('Failed to resend two-factor authentication code', error);
      setErrors(prev => ({ 
        ...prev, 
        login: 'Failed to resend verification code' 
      }));
    }
  };

  // Handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate signup form
    if (!validateSignup()) {
      return;
    }

    setIsSignupLoading(true);

    try {
      // Prepare data for submission
      const { confirmPassword, ...submitData } = signupData;

      // Send signup request
      const response = await axios.post(`${API_BASE_URL}/signup`, submitData);
      
      // Handle successful signup
      console.log('Signup successful', response.data);
      
      // Reset signup form
      setSignupData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Optionally redirect or show success message
      alert('Signup successful! You can now log in.');
      
      // Switch to login view
      setIsLogin(true);
    } catch (error) {
      console.error('Signup error:', error.response ? error.response.data : error.message);
      
      const errorMessage = error.response?.data?.error || error.response?.data || 'Signup failed. Please try again.';
      
      setErrors(prev => ({
        ...prev,
        signup: {
          ...prev.signup,
          confirmPassword: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
        }
      }));
    } finally {
      setIsSignupLoading(false);
    }
  };

  // Handle forgot password flow
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetLoading(true);
    setErrors(prev => ({ ...prev, resetPassword: '' }));

    try {
      if (resetData.resetStage === 'email') {
        const response = await axios.post(`${API_BASE_URL}/forgot-password`, { 
          email: resetData.email 
        });
        
        if (response.status === 200) {
          setResetData(prev => ({ ...prev, resetStage: 'code' }));
          alert('Reset code sent to your email');
        }
      } else {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, {
          email: resetData.email,
          resetCode: resetData.resetCode,
          newPassword: resetData.newPassword
        });
        
        if (response.status === 200) {
          alert('Password reset successful');
          setForgotPasswordMode(false);
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error('Password reset error:', error.response ? error.response.data : error.message);
      
      const errorMessage = error.response?.data?.error || error.response?.data || 'Password reset failed';
      
      setErrors(prev => ({ 
        ...prev, 
        resetPassword: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage)
      }));
    } finally {
      setIsResetLoading(false);
    }
  };

  // Render forgot password form
  const renderForgotPasswordForm = () => {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
        
        
        {errors.resetPassword && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errors.resetPassword}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          {resetData.resetStage === 'email' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your email
              </label>
              <input
                type="email"
                value={resetData.email}
                onChange={(e) => setResetData(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reset Code
                </label>
                <input
                  type="text"
                  value={resetData.resetCode}
                  onChange={(e) => setResetData(prev => ({ ...prev, resetCode: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type={passwordVisibility.password ? 'text' : 'password'}
                  value={resetData.newPassword}
                  onChange={(e) => setResetData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('password')}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {passwordVisibility.password ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          )}
          
          <button
            type="submit"
            disabled={isResetLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              isResetLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 transition-colors'
            }`}
          >
            {resetData.resetStage === 'email' 
              ? (isResetLoading ? 'Sending...' : 'Send Reset Code')
              : (isResetLoading ? 'Resetting...' : 'Reset Password')
            }
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setForgotPasswordMode(false);
              setIsLogin(true);
            }} 
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md relative">
      {console.log('Two Factor Required State:', twoFactorRequired)}
        {twoFactorRequired ? (
          renderTwoFactorForm()
        ) : (
          <>
            {/* Toggle Switch */}
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                    isLogin 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 ${
                    !isLogin 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  <UserPlus size={18} />
                  <span>Signup</span>
                </button>
              </div>
            </div>
  
            {/* Forgot Password Modal */}
            {forgotPasswordMode ? (
              renderForgotPasswordForm()
            ) : (
              // Login or Signup Form
              isLogin ? (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
                  
                  {errors.login && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                      {errors.login}
                    </div>
                  )}
  
                  <form onSubmit={handleLogin} className="space-y-4">
                    {/* Login Form Fields */}
                    <div>
                      <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">
                        Username or Email
                      </label>
                      <input
                        type="text"
                        id="usernameOrEmail"
                        name="usernameOrEmail"
                        value={loginData.usernameOrEmail}
                        onChange={handleLoginChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                      />
                    </div>
  
                    <div className="relative">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type={passwordVisibility.password ? 'text' : 'password'}
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute right-3 top-9 text-gray-500"
                      >
                        {passwordVisibility.password ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
  
                    {/* Forgot Password Link */}
                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          setForgotPasswordMode(true);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
  
                    {/* Login Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className={`w-full py-2 px-4 rounded-md text-white font-semibold mt-4 ${
                        isLoginLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                      }`}
                    >
                      {isLoginLoading ? 'Logging in...' : 'Log In'}
                    </button>
  
                    {/* Switch to Signup */}
                    <div className="mt-4 text-center text-sm">
                      Don't have an account?{' '}
                      <button 
                        onClick={() => setIsLogin(false)} 
                        className="text-blue-600 hover:underline"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
                  
                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Signup form fields */}
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={signupData.username}
                        onChange={handleSignupChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 ${
                          errors.signup.username ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.signup.username && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.signup.username}
                        </p>
                      )}
                    </div>
  
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 ${
                          errors.signup.email ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.signup.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.signup.email}
                        </p>
                      )}
                    </div>
  
                    <div className="relative">
                      <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type={passwordVisibility.password ? 'text' : 'password'}
                        id="signupPassword"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 pr-10 ${
                          errors.signup.password ? 'border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('password')}
                        className="absolute right-3 top-9 text-gray-500"
                      >
                       {passwordVisibility.password ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.signup.password && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.signup.password}
                        </p>
                      )}
                    </div>
  
                    <div className="relative">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type={passwordVisibility.confirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 pr-10 ${
                          errors.signup.confirmPassword ? 'border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        className="absolute right-3 top-9 text-gray-500"
                      >
                        {passwordVisibility.confirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      {errors.signup.confirmPassword && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.signup.confirmPassword}
                        </p>
                      )}
                    </div>
  
                    <button
                      type="submit"
                      disabled={isSignupLoading}
                      className={`w-full py-2 px-4 rounded-md text-white font-semibold mt-4 ${
                        isSignupLoading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 transition-colors'
                      }`}
                    >
                      {isSignupLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
  
                    <div className="mt-4 text-center text-sm">
                      Already have an account?{' '}
                      <button 
                        onClick={() => setIsLogin(true)} 
                        className="text-blue-600 hover:underline"
                      >
                        Log In
                      </button>
                    </div>
                  </form>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default AuthPage;