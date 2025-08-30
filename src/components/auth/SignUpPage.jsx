import React, { useState } from 'react';
import {
	Card, CardContent, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Stack, Box, Alert
} from '@mui/material';
import { UserRole } from '../../data/enums';

const studentFields = [
	{ name: 'name', label: 'Full Name', type: 'text', required: true },
	{ name: 'email', label: 'Email', type: 'email', required: true },
	{ name: 'password', label: 'Password', type: 'password', required: true },
	{ name: 'rollNumber', label: 'Roll Number', type: 'text', required: true },
	{ name: 'branch', label: 'Branch', type: 'text', required: true },
	{ name: 'year', label: 'Year', type: 'number', required: true },
];
const tpoFields = [
	{ name: 'name', label: 'Full Name', type: 'text', required: true },
	{ name: 'email', label: 'Email', type: 'email', required: true },
	{ name: 'password', label: 'Password', type: 'password', required: true },
	{ name: 'department', label: 'Department', type: 'text', required: true },
];
const companyFields = [
	{ name: 'companyName', label: 'Company Name', type: 'text', required: true },
	{ name: 'email', label: 'Email', type: 'email', required: true },
	{ name: 'password', label: 'Password', type: 'password', required: true },
	{ name: 'hrName', label: 'HR Name', type: 'text', required: true },
];

const getFields = (role) => {
	switch (role) {
		case UserRole.STUDENT: return studentFields;
		case UserRole.TPO_ADMIN: return tpoFields;
		case UserRole.COMPANY: return companyFields;
		default: return [];
	}
};

const getTitle = (role) => {
	switch (role) {
		case UserRole.STUDENT: return 'Student Sign Up';
		case UserRole.TPO_ADMIN: return 'TPO/Admin Sign Up';
		case UserRole.COMPANY: return 'Company Sign Up';
		default: return 'Sign Up';
	}
};

const SignUpPage = ({ userType = UserRole.STUDENT, onSignUp, error = null, loading = false }) => {
	const [formData, setFormData] = useState(() => {
		const fields = getFields(userType);
		const obj = {};
		fields.forEach(f => { obj[f.name] = ''; });
		return obj;
	});
	const [formErrors, setFormErrors] = useState({});

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const validateForm = () => {
		const errors = {};
		getFields(userType).forEach(field => {
			if (field.required && !formData[field.name]) {
				errors[field.name] = `${field.label} is required`;
			}
			if (field.type === 'email' && formData[field.name] && !validateEmail(formData[field.name])) {
				errors[field.name] = 'Invalid email address';
			}
			if (field.name === 'password' && formData[field.name] && formData[field.name].length < 6) {
				errors[field.name] = 'Password must be at least 6 characters';
			}
		});
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleChange = (field) => (e) => {
		setFormData(prev => ({ ...prev, [field]: e.target.value }));
		if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			onSignUp({ ...formData, role: userType });
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="p-8">
				<Box className="text-center mb-6">
					<Typography variant="h4" className="font-bold mb-2">
						{getTitle(userType)}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Create your account to get started
					</Typography>
				</Box>

				{error && (
					<Alert severity="error" className="mb-4">{error}</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<Stack spacing={3}>
						{getFields(userType).map(field => (
							<TextField
								key={field.name}
								fullWidth
								label={field.label}
								type={field.type}
								value={formData[field.name]}
								onChange={handleChange(field.name)}
								error={!!formErrors[field.name]}
								helperText={formErrors[field.name]}
								required={field.required}
							/>
						))}
						<Button
							type="submit"
							variant="contained"
							size="large"
							fullWidth
							disabled={loading}
							className="py-3"
						>
							{loading ? 'Signing Up...' : 'Sign Up'}
						</Button>
					</Stack>
				</form>
				<Typography variant="body2" color="text.secondary" className="text-center mt-6">
					Already have an account?{' '}
					<Button variant="text" size="small" className="p-0 min-w-0" onClick={() => onSignUp(null, true)}>
						Sign In
					</Button>
				</Typography>
			</CardContent>
		</Card>
	);
};

export default SignUpPage;
