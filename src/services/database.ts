import { supabase } from "@/integrations/supabase/client";
import { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Type aliases for better readability
export type Profile = Tables<'profiles'>;
export type StudentProfile = Tables<'student_profiles'>;
export type CompanyProfile = Tables<'company_profiles'>;
export type TPOProfile = Tables<'tpo_profiles'>;
export type JobPosting = Tables<'job_postings'>;
export type Application = Tables<'applications'>;
export type PlacementDrive = Tables<'placement_drives'>;
export type DriveRegistration = Tables<'drive_registrations'>;
export type Notification = Tables<'notifications'>;

export type UserRole = Database['public']['Enums']['user_role'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];
export type JobType = Database['public']['Enums']['job_type'];

// Profile Services
export const profileService = {
  // Get current user profile
  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create or update profile
  async upsertProfile(profile: TablesInsert<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update profile
  async updateProfile(id: string, updates: TablesUpdate<'profiles'>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Student Profile Services
export const studentService = {
  // Get student profile with basic profile info
  async getStudentProfile(id: string) {
    const { data, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create student profile
  async createStudentProfile(profile: TablesInsert<'student_profiles'>) {
    const { data, error } = await supabase
      .from('student_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update student profile
  async updateStudentProfile(id: string, updates: TablesUpdate<'student_profiles'>) {
    const { data, error } = await supabase
      .from('student_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all students (for TPO)
  async getAllStudents() {
    const { data, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Company Profile Services
export const companyService = {
  // Get company profile
  async getCompanyProfile(id: string) {
    const { data, error } = await supabase
      .from('company_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create company profile
  async createCompanyProfile(profile: TablesInsert<'company_profiles'>) {
    const { data, error } = await supabase
      .from('company_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update company profile
  async updateCompanyProfile(id: string, updates: TablesUpdate<'company_profiles'>) {
    const { data, error } = await supabase
      .from('company_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all companies
  async getAllCompanies() {
    const { data, error } = await supabase
      .from('company_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// TPO Profile Services
export const tpoService = {
  // Get TPO profile
  async getTPOProfile(id: string) {
    const { data, error } = await supabase
      .from('tpo_profiles')
      .select(`
        *,
        profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create TPO profile
  async createTPOProfile(profile: TablesInsert<'tpo_profiles'>) {
    const { data, error } = await supabase
      .from('tpo_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update TPO profile
  async updateTPOProfile(id: string, updates: TablesUpdate<'tpo_profiles'>) {
    const { data, error } = await supabase
      .from('tpo_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Job Posting Services
export const jobService = {
  // Get all active job postings
  async getActiveJobs() {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_profiles (
          company_name,
          logo_url,
          industry
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get job by ID
  async getJobById(id: string) {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_profiles (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create job posting
  async createJob(job: TablesInsert<'job_postings'>) {
    const { data, error } = await supabase
      .from('job_postings')
      .insert(job)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update job posting
  async updateJob(id: string, updates: TablesUpdate<'job_postings'>) {
    const { data, error } = await supabase
      .from('job_postings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get jobs by company
  async getJobsByCompany(companyId: string) {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Application Services
export const applicationService = {
  // Apply for a job
  async applyForJob(application: TablesInsert<'applications'>) {
    const { data, error } = await supabase
      .from('applications')
      .insert(application)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get student's applications
  async getStudentApplications(studentId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings (
          title,
          company_profiles (company_name)
        )
      `)
      .eq('student_id', studentId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get applications for a job
  async getJobApplications(jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        student_profiles (
          *,
          profiles (full_name, email)
        )
      `)
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update application status
  async updateApplicationStatus(id: string, status: ApplicationStatus) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Check if student has applied for job
  async hasApplied(studentId: string, jobId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', studentId)
      .eq('job_id', jobId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// Placement Drive Services
export const driveService = {
  // Get all active placement drives
  async getActiveDrives() {
    const { data, error } = await supabase
      .from('placement_drives')
      .select(`
        *,
        company_profiles (
          company_name,
          logo_url
        )
      `)
      .eq('is_active', true)
      .order('drive_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Create placement drive
  async createDrive(drive: TablesInsert<'placement_drives'>) {
    const { data, error } = await supabase
      .from('placement_drives')
      .insert(drive)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Register for placement drive
  async registerForDrive(registration: TablesInsert<'drive_registrations'>) {
    const { data, error } = await supabase
      .from('drive_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get drive registrations
  async getDriveRegistrations(driveId: string) {
    const { data, error } = await supabase
      .from('drive_registrations')
      .select(`
        *,
        student_profiles (
          *,
          profiles (full_name, email)
        )
      `)
      .eq('drive_id', driveId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Notification Services
export const notificationService = {
  // Get user notifications
  async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Create notification
  async createNotification(notification: TablesInsert<'notifications'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return data;
  },

  // Get unread count
  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  }
};

// Analytics Services (for TPO dashboard)
export const analyticsService = {
  // Get placement statistics
  async getPlacementStats() {
    const [studentsResult, companiesResult, jobsResult, applicationsResult] = await Promise.all([
      supabase.from('student_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('company_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('job_postings').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('applications').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalStudents: studentsResult.count || 0,
      totalCompanies: companiesResult.count || 0,
      activeJobs: jobsResult.count || 0,
      totalApplications: applicationsResult.count || 0
    };
  },

  // Get application status distribution
  async getApplicationStatusStats() {
    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .not('status', 'is', null);

    if (error) throw error;

    const stats = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<ApplicationStatus, number>);

    return stats;
  }
};