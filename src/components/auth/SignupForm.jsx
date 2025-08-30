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
  Box,
  IconButton,
  InputAdornment,
  Divider,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { UserRole } from '../../data/enums';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

const SignupForm = ({ onSignup, onSwitchToLogin, loading = false, error = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT,
    agreeToTerms: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      errors.role = 'Please select a role';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, agreeToTerms, ...signupData } = formData;
      onSignup(signupData);
    }
  };

  const handleChange = (field) => (e) => {
    const value = field === 'agreeToTerms' ? e.target.checked : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
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
    <Card 
      className="w-full max-w-md"
      sx={{ 
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      <CardContent className="p-8">
        <Box className="text-center mb-8">
          <Box 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            sx={{ 
              background: 'linear-gradient(45deg, #a855f7, #10b981)',
              boxShadow: '0 8px 16px rgba(168,85,247,0.3)'
            }}
          >
            <PersonAddOutlinedIcon 
              sx={{ fontSize: 32, color: 'white' }} 
            />
          </Box>
          <Typography variant="h4" className="font-bold mb-2">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join Placemint and start your career journey
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            className="mb-6"
            sx={{ 
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 2
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <TextField
              fullWidth
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!formErrors.name}
              helperText={formErrors.name}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BadgeOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={formData.role}
                label="Select Role"
                onChange={handleChange('role')}
                error={!!formErrors.role}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  </InputAdornment>
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: 2,
                  }
                }}
              >
                {Object.values(UserRole).map((role) => (
                  <MenuItem key={role} value={role}>
                    {getRoleLabel(role)}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.role && (
                <Typography variant="caption" color="error" className="mt-1 ml-2">
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!formErrors.password}
              helperText={formErrors.password}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockPersonOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                }
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockPersonOutlinedIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeToTerms}
                  onChange={handleChange('agreeToTerms')}
                  sx={{ 
                    color: 'text.secondary',
                    '&.Mui-checked': {
                      color: 'primary.main'
                    }
                  }}
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  I agree to the{' '}
                  <Typography component="span" color="primary.main" className="cursor-pointer">
                    Terms of Service
                  </Typography>
                  {' '}and{' '}
                  <Typography component="span" color="primary.main" className="cursor-pointer">
                    Privacy Policy
                  </Typography>
                </Typography>
              }
            />
            {formErrors.agreeToTerms && (
              <Typography variant="caption" color="error" className="mt-1 ml-2">
                {formErrors.agreeToTerms}
              </Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ 
                py: 2,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #a855f7, #10b981)',
                boxShadow: '0 8px 16px rgba(168,85,247,0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #9333ea, #059669)',
                  boxShadow: '0 12px 24px rgba(168,85,247,0.4)',
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)'
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 4, opacity: 0.2 }}>
          <Typography variant="caption" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box className="text-center">
          <Typography variant="body2" color="text.secondary" className="mb-2">
            Already have an account?
          </Typography>
          <Button 
            variant="outlined" 
            fullWidth
            onClick={onSwitchToLogin}
            sx={{ 
              borderRadius: 2,
              borderColor: 'rgba(255,255,255,0.2)',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.main',
                background: 'rgba(0,212,255,0.1)'
              }
            }}
          >
            Sign In Instead
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SignupForm;