import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  profileService,
  studentService,
  companyService,
  tpoService,
  jobService,
  applicationService,
  driveService,
  notificationService,
  analyticsService,
  type Profile,
  type StudentProfile,
  type CompanyProfile,
  type TPOProfile,
  type JobPosting,
  type Application,
  type PlacementDrive,
  type ApplicationStatus,
} from '@/services/database';
import { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Profile Hooks
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getCurrentProfile,
    retry: false,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<'profiles'> }) =>
      profileService.updateProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    },
  });
};

// Student Profile Hooks
export const useStudentProfile = (id?: string) => {
  return useQuery({
    queryKey: ['studentProfile', id],
    queryFn: () => studentService.getStudentProfile(id!),
    enabled: !!id,
  });
};

export const useAllStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAllStudents,
  });
};

export const useCreateStudentProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profile: TablesInsert<'student_profiles'>) =>
      studentService.createStudentProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student profile created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create student profile",
        variant: "destructive",
      });
      console.error('Student profile creation error:', error);
    },
  });
};

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<'student_profiles'> }) =>
      studentService.updateStudentProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student profile updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update student profile",
        variant: "destructive",
      });
      console.error('Student profile update error:', error);
    },
  });
};

// Company Profile Hooks
export const useCompanyProfile = (id?: string) => {
  return useQuery({
    queryKey: ['companyProfile', id],
    queryFn: () => companyService.getCompanyProfile(id!),
    enabled: !!id,
  });
};

export const useAllCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getAllCompanies,
  });
};

export const useCreateCompanyProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profile: TablesInsert<'company_profiles'>) =>
      companyService.createCompanyProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companyProfile'] });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: "Success",
        description: "Company profile created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create company profile",
        variant: "destructive",
      });
      console.error('Company profile creation error:', error);
    },
  });
};

// Job Posting Hooks
export const useActiveJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'active'],
    queryFn: jobService.getActiveJobs,
  });
};

export const useJob = (id?: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id!),
    enabled: !!id,
  });
};

export const useCompanyJobs = (companyId?: string) => {
  return useQuery({
    queryKey: ['jobs', 'company', companyId],
    queryFn: () => jobService.getJobsByCompany(companyId!),
    enabled: !!companyId,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (job: TablesInsert<'job_postings'>) => jobService.createJob(job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive",
      });
      console.error('Job creation error:', error);
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<'job_postings'> }) =>
      jobService.updateJob(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: "Success",
        description: "Job posting updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update job posting",
        variant: "destructive",
      });
      console.error('Job update error:', error);
    },
  });
};

// Application Hooks
export const useStudentApplications = (studentId?: string) => {
  return useQuery({
    queryKey: ['applications', 'student', studentId],
    queryFn: () => applicationService.getStudentApplications(studentId!),
    enabled: !!studentId,
  });
};

export const useJobApplications = (jobId?: string) => {
  return useQuery({
    queryKey: ['applications', 'job', jobId],
    queryFn: () => applicationService.getJobApplications(jobId!),
    enabled: !!jobId,
  });
};

export const useApplyForJob = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (application: TablesInsert<'applications'>) =>
      applicationService.applyForJob(application),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Success",
        description: "Application submitted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
      console.error('Application error:', error);
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      applicationService.updateApplicationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: "Success",
        description: "Application status updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
      console.error('Application status update error:', error);
    },
  });
};

export const useHasApplied = (studentId?: string, jobId?: string) => {
  return useQuery({
    queryKey: ['hasApplied', studentId, jobId],
    queryFn: () => applicationService.hasApplied(studentId!, jobId!),
    enabled: !!studentId && !!jobId,
  });
};

// Placement Drive Hooks
export const useActiveDrives = () => {
  return useQuery({
    queryKey: ['drives', 'active'],
    queryFn: driveService.getActiveDrives,
  });
};

export const useCreateDrive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (drive: TablesInsert<'placement_drives'>) =>
      driveService.createDrive(drive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drives'] });
      toast({
        title: "Success",
        description: "Placement drive created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create placement drive",
        variant: "destructive",
      });
      console.error('Drive creation error:', error);
    },
  });
};

export const useRegisterForDrive = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (registration: TablesInsert<'drive_registrations'>) =>
      driveService.registerForDrive(registration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drives'] });
      toast({
        title: "Success",
        description: "Registered for placement drive successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to register for placement drive",
        variant: "destructive",
      });
      console.error('Drive registration error:', error);
    },
  });
};

// Notification Hooks
export const useNotifications = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notificationService.getUserNotifications(userId!),
    enabled: !!userId,
  });
};

export const useUnreadCount = (userId?: string) => {
  return useQuery({
    queryKey: ['notifications', 'unread', userId],
    queryFn: () => notificationService.getUnreadCount(userId!),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

// Analytics Hooks
export const usePlacementStats = () => {
  return useQuery({
    queryKey: ['analytics', 'placement-stats'],
    queryFn: analyticsService.getPlacementStats,
  });
};

export const useApplicationStatusStats = () => {
  return useQuery({
    queryKey: ['analytics', 'application-status'],
    queryFn: analyticsService.getApplicationStatusStats,
  });
};