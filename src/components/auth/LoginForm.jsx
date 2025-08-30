import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Stack,
  Box
} from '@mui/material';
import { UserRole } from '../../data/enums';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';

const LoginForm = ({ onLogin, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: UserRole.STUDENT
  });
  const [formErrors, setFormErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.role) {
      errors.role = 'Please select a role';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onLogin(formData);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case UserRole.STUDENT:
        return 'Student';
      case UserRole.TPO_ADMIN:
        return 'TPO/Admin';
      case UserRole.COMPANY:
        return 'Company';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-8">
        <Box className="text-center mb-6">
          <LockPersonOutlinedIcon 
            sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} 
          />
          <Typography variant="h4" className="font-bold mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={formData.role}
                label="Select Role"
                onChange={handleChange('role')}
                error={!!formErrors.role}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {getRoleLabel(role)}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.role && (
                <Typography variant="caption" color="error" className="mt-1">
                  {formErrors.role}
                </Typography>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!formErrors.email}
              helperText={formErrors.email}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              className="py-3"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" color="text.secondary" className="text-center mt-6">
          Don't have an account?{' '}
          <Button variant="text" size="small" className="p-0 min-w-0">
            Register here
          </Button>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LoginForm;