import React, { useState, useRef } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import LandingPage from './components/landing/LandingPage';
import Navigation from './components/layout/Navigation';
import LoginForm from './components/auth/LoginForm';
import SignUpPage from './components/auth/SignUpPage';
import StudentDashboard from './components/dashboard/StudentDashboard';
import JobListings from './components/jobs/JobListings';
import NotificationCenter from './components/notifications/NotificationCenter';
import PracticeTests from './components/tests/PracticeTests';
import { UserRole } from './data/enums';
import { mockStore } from './data/placementMockData';

const PlacementTracker = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPath, setCurrentPath] = useState('/landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [signupUserType, setSignupUserType] = useState(null);
  // In-memory user store for demo
  const usersRef = useRef([]);

  const handleEnterApp = (userType) => {
    setShowLanding(false);
    if (userType === 'login') {
      setCurrentPath('/login');
    } else if (userType === 'student' || userType === 'tpo' || userType === 'company') {
      setSignupUserType(userType);
      setCurrentPath(`/signup/${userType}`);
    }
  };

  const handleSignUp = (formData, goToLogin = false) => {
    if (goToLogin) {
      setCurrentPath('/login');
      return;
    }
    // Add user to in-memory store
    const newUser = {
      id: `user_${Date.now()}`,
      name: formData.name || formData.companyName || formData.hrName || "User",
      email: formData.email,
      password: formData.password,
      role: formData.role,
      profileComplete: true
    };
    usersRef.current.push(newUser);
    setTimeout(() => {
      setCurrentUser({ ...newUser });
      setIsAuthenticated(true);
      let dashboardPath = '/dashboard';
      if (newUser.role === UserRole.TPO_ADMIN) dashboardPath = '/admin/dashboard';
      if (newUser.role === UserRole.COMPANY) dashboardPath = '/company/dashboard';
      setCurrentPath(dashboardPath);
    }, 1000);
  };

  const handleLogin = async (credentials) => {
    // Find user in in-memory store
    const foundUser = usersRef.current.find(
      u => u.email === credentials.email && u.password === credentials.password && u.role === credentials.role
    );
    setTimeout(() => {
      if (foundUser) {
        setCurrentUser({ ...foundUser });
        setIsAuthenticated(true);
        let dashboardPath = '/dashboard';
        if (foundUser.role === UserRole.TPO_ADMIN) dashboardPath = '/admin/dashboard';
        if (foundUser.role === UserRole.COMPANY) dashboardPath = '/company/dashboard';
        setCurrentPath(dashboardPath);
      } else {
        alert('Invalid credentials or user not found. Please sign up first.');
      }
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPath('/login');
  };

  const handleNavigation = (path) => {
    setCurrentPath(path);
  };

  const handleJobApply = (jobId) => {
    console.log('Applying to job:', jobId);
    // Implement job application logic
  };

  const handleJobViewDetails = (jobId) => {
    console.log('Viewing job details:', jobId);
    // Implement job details view
  };

  const renderCurrentPage = () => {
    if (showLanding) {
      return <LandingPage onEnterApp={handleEnterApp} />;
    }

    if (!isAuthenticated) {
      if (currentPath.startsWith('/signup/')) {
        let userType = signupUserType;
        if (currentPath === '/signup/student') userType = UserRole.STUDENT;
        if (currentPath === '/signup/tpo') userType = UserRole.TPO_ADMIN;
        if (currentPath === '/signup/company') userType = UserRole.COMPANY;
        return (
          <Box className="min-h-screen flex items-center justify-center" sx={{ background: 'linear-gradient(45deg, #0f0f23, #1a1a2e)' }}>
            <SignUpPage userType={userType} onSignUp={handleSignUp} />
          </Box>
        );
      }
      return (
        <Box className="min-h-screen flex items-center justify-center" sx={{ background: 'linear-gradient(45deg, #0f0f23, #1a1a2e)' }}>
          <LoginForm onLogin={handleLogin} />
        </Box>
      );
    }

    switch (currentPath) {
      case '/dashboard':
        return <StudentDashboard onNavigate={handleNavigation} />;
      case '/admin/dashboard':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">TPO/Admin Dashboard</h2>
            <p>Welcome, TPO/Admin! Dashboard coming soon...</p>
          </Box>
        );
      case '/company/dashboard':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">Company Dashboard</h2>
            <p>Welcome, Company! Dashboard coming soon...</p>
          </Box>
        );
      case '/jobs':
        return (
          <JobListings
            onApply={handleJobApply}
            onViewDetails={handleJobViewDetails}
          />
        );
      case '/notifications':
        return <NotificationCenter />;
      case '/tests':
        return <PracticeTests />;
      case '/applications':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Applications</h2>
            <p>Applications page coming soon...</p>
          </Box>
        );
      case '/resume':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">Resume Builder</h2>
            <p>Resume builder coming soon...</p>
          </Box>
        );
      case '/analytics':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <p>Analytics page coming soon...</p>
          </Box>
        );
      case '/profile':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p>Profile page coming soon...</p>
          </Box>
        );
      case '/settings':
        return (
          <Box className="p-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Settings page coming soon...</p>
          </Box>
        );
      default:
        return <StudentDashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="min-h-screen" sx={{ backgroundColor: 'background.default' }}>
        {isAuthenticated && !showLanding && (
          <Navigation
            userRole={currentUser?.role || UserRole.STUDENT}
            currentUser={currentUser}
            notificationCount={2}
            onNavigate={handleNavigation}
            onLogout={handleLogout}
            currentPath={currentPath}
          />
        )}
        <Box component="main">
          {renderCurrentPage()}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PlacementTracker;