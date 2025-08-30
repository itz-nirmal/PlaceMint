import { UserRole, ApplicationStatus, TestType, OfferStatus, NotificationType, JobType, Department } from '../data/enums';

export const formatUserRole = (role) => {
  switch (role) {
    case UserRole.STUDENT:
      return 'Student';
    case UserRole.TPO_ADMIN:
      return 'TPO/Admin';
    case UserRole.COMPANY:
      return 'Company';
    default:
      return 'Unknown';
  }
};

export const formatApplicationStatus = (status) => {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 'Applied';
    case ApplicationStatus.SHORTLISTED:
      return 'Shortlisted';
    case ApplicationStatus.INTERVIEW:
      return 'Interview';
    case ApplicationStatus.OFFER:
      return 'Offer Received';
    case ApplicationStatus.JOINED:
      return 'Joined';
    case ApplicationStatus.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};

export const formatTestType = (type) => {
  switch (type) {
    case TestType.APTITUDE:
      return 'Aptitude Test';
    case TestType.REASONING:
      return 'Reasoning Test';
    case TestType.CODING:
      return 'Coding Test';
    case TestType.ENGLISH:
      return 'English Test';
    default:
      return 'Unknown Test';
  }
};

export const formatSalary = (amount) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} LPA`;
  } else {
    return `₹${amount.toLocaleString()}`;
  }
};

export const formatDate = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (date) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatCGPA = (cgpa) => {
  return cgpa.toFixed(2);
};