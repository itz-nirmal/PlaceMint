import React from 'react';
import { Chip } from '@mui/material';
import { ApplicationStatus } from '../../data/enums';

const StatusBadge = ({ status, size = 'medium' }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return 'info';
      case ApplicationStatus.SHORTLISTED:
        return 'primary';
      case ApplicationStatus.INTERVIEW:
        return 'warning';
      case ApplicationStatus.OFFER:
        return 'success';
      case ApplicationStatus.JOINED:
        return 'success';
      case ApplicationStatus.REJECTED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case ApplicationStatus.APPLIED:
        return 'Applied';
      case ApplicationStatus.SHORTLISTED:
        return 'Shortlisted';
      case ApplicationStatus.INTERVIEW:
        return 'Interview';
      case ApplicationStatus.OFFER:
        return 'Offer';
      case ApplicationStatus.JOINED:
        return 'Joined';
      case ApplicationStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size={size}
      variant="filled"
      className="font-medium"
    />
  );
};

export default StatusBadge;