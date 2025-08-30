import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';
import type { RealtimeChannel } from '@supabase/supabase-js';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;
type ApplicationStatus = Database['public']['Enums']['application_status'];

// Hook for real-time profile updates
export const useProfileRealtime = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Profile updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'student_profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Student profile updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['studentProfile', userId] });
          toast({
            title: "Profile Updated",
            description: "Your student profile has been updated",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'company_profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log('Company profile updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['companyProfile', userId] });
          toast({
            title: "Profile Updated",
            description: "Your company profile has been updated",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, toast]);
};

// Hook for real-time job updates
export const useJobsRealtime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('job-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_postings',
        },
        (payload) => {
          console.log('New job posted:', payload);
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          
          const newJob = payload.new as Tables['job_postings']['Row'];
          toast({
            title: "New Job Posted",
            description: `A new position "${newJob.title}" has been posted`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_postings',
        },
        (payload) => {
          console.log('Job updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['jobs'] });
          
          const updatedJob = payload.new as Tables['job_postings']['Row'];
          const oldJob = payload.old as Tables['job_postings']['Row'];
          
          if (oldJob.is_active && !updatedJob.is_active) {
            toast({
              title: "Job Closed",
              description: `The position "${updatedJob.title}" is no longer accepting applications`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};

// Hook for real-time application updates
export const useApplicationsRealtime = (userId?: string, userRole?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    let channel: RealtimeChannel;

    const setupChannel = async () => {
      try {
        channel = supabase
          .channel(`application-changes-${userId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'applications',
            },
            (payload) => {
              console.log('New application:', payload);
              queryClient.invalidateQueries({ queryKey: ['applications'] });
              
              // Show notification based on user role
              if (userRole === 'company') {
                toast({
                  title: "New Application",
                  description: "You have received a new job application",
                });
              }
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'applications',
            },
            (payload) => {
              console.log('Application updated:', payload);
              queryClient.invalidateQueries({ queryKey: ['applications'] });
              
              const updatedApp = payload.new as Tables['applications']['Row'];
              const oldApp = payload.old as Tables['applications']['Row'];
              
              // Notify student if their application status changed
              if (userRole === 'student' && updatedApp.student_id === userId && 
                  oldApp.status !== updatedApp.status && updatedApp.status) {
                const statusMessages: Record<ApplicationStatus, string> = {
                  pending: 'Your application is under review',
                  shortlisted: 'Congratulations! You have been shortlisted',
                  selected: 'Congratulations! You have been selected',
                  rejected: 'Your application was not successful this time'
                };
                
                toast({
                  title: "Application Status Update",
                  description: statusMessages[updatedApp.status],
                  variant: updatedApp.status === 'selected' || updatedApp.status === 'shortlisted' 
                    ? 'default' : updatedApp.status === 'rejected' ? 'destructive' : 'default',
                });
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error setting up application realtime channel:', error);
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [userId, userRole, queryClient, toast]);
};

// Hook for real-time notifications
export const useNotificationsRealtime = (userId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
          
          const notification = payload.new as Tables['notifications']['Row'];
          
          // Show toast for new notification
          toast({
            title: notification.title,
            description: notification.message || undefined,
            variant: notification.type === 'error' ? 'destructive' : 'default',
          });
          
          setUnreadCount(prev => prev + 1);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
          queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', userId] });
          
          const updatedNotification = payload.new as Tables['notifications']['Row'];
          const oldNotification = payload.old as Tables['notifications']['Row'];
          
          if (!oldNotification.is_read && updatedNotification.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient, toast]);

  return { unreadCount };
};

// Hook for real-time placement drive updates
export const usePlacementDrivesRealtime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('drive-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'placement_drives',
        },
        (payload) => {
          console.log('New placement drive:', payload);
          queryClient.invalidateQueries({ queryKey: ['drives'] });
          
          const newDrive = payload.new as Tables['placement_drives']['Row'];
          toast({
            title: "New Placement Drive",
            description: `"${newDrive.title}" has been scheduled`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'placement_drives',
        },
        (payload) => {
          console.log('Placement drive updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['drives'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};

// Master hook that combines all real-time subscriptions
export const useRealtimeSubscriptions = (userId?: string, userRole?: string) => {
  useProfileRealtime(userId);
  useJobsRealtime();
  useApplicationsRealtime(userId, userRole);
  const { unreadCount } = useNotificationsRealtime(userId);
  usePlacementDrivesRealtime();

  return { unreadCount };
};

// Types for activity tracking
interface UserActivity {
  activity_type: 'profile_change' | 'application' | 'drive_registration';
  description: string;
  timestamp: string;
  details: Record<string, any>;
}

interface ChangeLog {
  id: string;
  user_id: string;
  table_name: string;
  changed_fields: Record<string, boolean>;
  old_values: Record<string, any>;
  new_values: Record<string, any>;
  changed_by: string | null;
  changed_at: string;
}

// Simplified hook for basic activity tracking using notifications
export const useUserActivity = (userId?: string) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivity = useCallback(async () => {
    if (!userId) {
      setActivities([]);
      return;
    }
    
    setLoading(true);
    
    try {
      // Get recent notifications as activity indicators
      const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      const activities: UserActivity[] = (notifications || []).map(notif => ({
        activity_type: 'profile_change',
        description: notif.title,
        timestamp: notif.created_at,
        details: {
          message: notif.message,
          type: notif.type,
          is_read: notif.is_read
        }
      }));

      setActivities(activities);
      
    } catch (error) {
      console.error('Error fetching activity:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  return { activities, loading, refetch: fetchActivity };
};

// Simplified hook for change log (TPOs only)
export const useChangeLog = (targetUserId?: string) => {
  const [changeLogs, setChangeLogs] = useState<ChangeLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChangeLogs = useCallback(async () => {
    if (!targetUserId) {
      setChangeLogs([]);
      return;
    }
    
    setLoading(true);
    
    try {
      const { data } = await supabase
        .from('profile_change_log')
        .select('*')
        .eq('user_id', targetUserId)
        .order('changed_at', { ascending: false })
        .limit(50);

      setChangeLogs(data || []);
      
    } catch (error) {
      console.warn('Change log not available:', error);
      setChangeLogs([]);
    } finally {
      setLoading(false);
    }
  }, [targetUserId]);

  useEffect(() => {
    fetchChangeLogs();
  }, [fetchChangeLogs]);

  return { changeLogs, loading, refetch: fetchChangeLogs };
};