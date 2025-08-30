import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import LandingPage from './components/landing/LandingPage';
import Navigation from './components/layout/Navigation';
import LoginForm from './components/auth/LoginForm';
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

  const handleEnterApp = (userType) => {
    setShowLanding(false);
    if (userType === 'login') {
      setCurrentPath('/login');
    } else {
      // For demo purposes, auto-login based on user type
      const mockUser = {
        id: "user_001",
        name: userType === 'student' ? "Rahul Sharma" : userType === 'tpo' ? "Dr. Admin" : "HR Manager",
        email: `${userType}@placemint.com`,
        role: userType === 'student' ? UserRole.STUDENT : userType === 'tpo' ? UserRole.TPO_ADMIN : UserRole.COMPANY,
        profileComplete: true
      };
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      setCurrentPath('/dashboard');
    }
  };

  const handleLogin = async (credentials) => {
    // Simulate login
    setTimeout(() => {
      setCurrentUser({
        id: "user_001",
        name: "Rahul Sharma",
        email: credentials.email,
        role: credentials.role,
        profileComplete: true
      });
      setIsAuthenticated(true);
      setCurrentPath('/dashboard');
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
      return (
        <Box className="min-h-screen flex items-center justify-center" sx={{ background: 'linear-gradient(45deg, #0f0f23, #1a1a2e)' }}>
          <LoginForm onLogin={handleLogin} />
        </Box>
      );
    }

    switch (currentPath) {
      case '/dashboard':
        return <StudentDashboard onNavigate={handleNavigation} />;
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