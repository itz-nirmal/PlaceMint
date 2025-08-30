// User roles and status enums for the placement tracker system
export const UserRole = {
  STUDENT: 'student',
  TPO_ADMIN: 'tpo_admin',
  COMPANY: 'company'
};

export const ApplicationStatus = {
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  JOINED: 'joined',
  REJECTED: 'rejected'
};

export const TestType = {
  APTITUDE: 'aptitude',
  REASONING: 'reasoning',
  CODING: 'coding',
  ENGLISH: 'english'
};

export const OfferStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired'
};

export const NotificationType = {
  APPLICATION_STATUS: 'application_status',
  TEST_REMINDER: 'test_reminder',
  DEADLINE: 'deadline',
  ANNOUNCEMENT: 'announcement',
  OFFER_RECEIVED: 'offer_received'
};

export const JobType = {
  FULL_TIME: 'full_time',
  INTERNSHIP: 'internship',
  PART_TIME: 'part_time'
};

export const Department = {
  CSE: 'cse',
  ECE: 'ece',
  EEE: 'eee',
  MECH: 'mech',
  CIVIL: 'civil',
  IT: 'it',
  OTHER: 'other'
};