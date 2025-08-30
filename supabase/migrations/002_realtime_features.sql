-- Enable real-time for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE student_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE company_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE tpo_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE job_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE applications;
ALTER PUBLICATION supabase_realtime ADD TABLE placement_drives;
ALTER PUBLICATION supabase_realtime ADD TABLE drive_registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Function to create notifications when important changes happen
CREATE OR REPLACE FUNCTION create_change_notification()
RETURNS TRIGGER AS $$
DECLARE
    notification_title TEXT;
    notification_message TEXT;
    target_user_id UUID;
    notification_type TEXT DEFAULT 'info';
BEGIN
    -- Handle different table changes
    CASE TG_TABLE_NAME
        WHEN 'applications' THEN
            IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
                -- Notify student about application status change
                SELECT title INTO notification_title FROM job_postings WHERE id = NEW.job_id;
                notification_message := 'Your application status for "' || notification_title || '" has been updated to ' || NEW.status;
                target_user_id := NEW.student_id;
                notification_type := CASE NEW.status
                    WHEN 'selected' THEN 'success'
                    WHEN 'rejected' THEN 'error'
                    WHEN 'shortlisted' THEN 'success'
                    ELSE 'info'
                END;
                
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (target_user_id, 'Application Status Update', notification_message, notification_type);
                
                -- Also notify company about new application
            ELSIF TG_OP = 'INSERT' THEN
                SELECT jp.title, jp.company_id INTO notification_title, target_user_id 
                FROM job_postings jp WHERE jp.id = NEW.job_id;
                
                notification_message := 'New application received for "' || notification_title || '"';
                
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (target_user_id, 'New Application', notification_message, 'info');
            END IF;
            
        WHEN 'job_postings' THEN
            IF TG_OP = 'INSERT' THEN
                -- Notify all students about new job posting
                INSERT INTO notifications (user_id, title, message, type)
                SELECT 
                    sp.id,
                    'New Job Posted',
                    'A new job "' || NEW.title || '" has been posted',
                    'info'
                FROM student_profiles sp;
            ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
                -- Notify applicants when job is deactivated
                INSERT INTO notifications (user_id, title, message, type)
                SELECT 
                    a.student_id,
                    'Job Posting Closed',
                    'The job "' || NEW.title || '" has been closed',
                    'warning'
                FROM applications a
                WHERE a.job_id = NEW.id AND a.status = 'pending';
            END IF;
            
        WHEN 'placement_drives' THEN
            IF TG_OP = 'INSERT' THEN
                -- Notify all students about new placement drive
                INSERT INTO notifications (user_id, title, message, type)
                SELECT 
                    sp.id,
                    'New Placement Drive',
                    'A new placement drive "' || NEW.title || '" has been scheduled',
                    'info'
                FROM student_profiles sp;
            END IF;
            
        WHEN 'student_profiles' THEN
            IF TG_OP = 'UPDATE' THEN
                -- Log profile updates (could be used for audit trail)
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (NEW.id, 'Profile Updated', 'Your profile has been updated successfully', 'success');
            END IF;
            
        WHEN 'company_profiles' THEN
            IF TG_OP = 'UPDATE' THEN
                -- Log profile updates
                INSERT INTO notifications (user_id, title, message, type)
                VALUES (NEW.id, 'Profile Updated', 'Your company profile has been updated successfully', 'success');
            END IF;
    END CASE;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic notifications
CREATE TRIGGER applications_change_notification
    AFTER INSERT OR UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION create_change_notification();

CREATE TRIGGER job_postings_change_notification
    AFTER INSERT OR UPDATE ON job_postings
    FOR EACH ROW EXECUTE FUNCTION create_change_notification();

CREATE TRIGGER placement_drives_change_notification
    AFTER INSERT OR UPDATE ON placement_drives
    FOR EACH ROW EXECUTE FUNCTION create_change_notification();

CREATE TRIGGER student_profiles_change_notification
    AFTER UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION create_change_notification();

CREATE TRIGGER company_profiles_change_notification
    AFTER UPDATE ON company_profiles
    FOR EACH ROW EXECUTE FUNCTION create_change_notification();

-- Function to track profile changes with detailed logging
CREATE TABLE profile_change_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    table_name TEXT NOT NULL,
    changed_fields JSONB,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES profiles(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to log detailed profile changes
CREATE OR REPLACE FUNCTION log_profile_changes()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields JSONB := '{}';
    old_values JSONB := '{}';
    new_values JSONB := '{}';
    field_name TEXT;
BEGIN
    -- Compare old and new values for each field
    FOR field_name IN SELECT jsonb_object_keys(to_jsonb(NEW)) LOOP
        IF to_jsonb(OLD) ->> field_name IS DISTINCT FROM to_jsonb(NEW) ->> field_name THEN
            changed_fields := changed_fields || jsonb_build_object(field_name, true);
            old_values := old_values || jsonb_build_object(field_name, to_jsonb(OLD) ->> field_name);
            new_values := new_values || jsonb_build_object(field_name, to_jsonb(NEW) ->> field_name);
        END IF;
    END LOOP;
    
    -- Only log if there are actual changes (excluding updated_at)
    IF jsonb_object_keys(changed_fields) != '["updated_at"]' AND jsonb_object_keys(changed_fields) != '{}' THEN
        INSERT INTO profile_change_log (user_id, table_name, changed_fields, old_values, new_values, changed_by)
        VALUES (
            CASE TG_TABLE_NAME
                WHEN 'profiles' THEN NEW.id
                WHEN 'student_profiles' THEN NEW.id
                WHEN 'company_profiles' THEN NEW.id
                WHEN 'tpo_profiles' THEN NEW.id
            END,
            TG_TABLE_NAME,
            changed_fields,
            old_values,
            new_values,
            auth.uid()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create change logging triggers
CREATE TRIGGER log_profiles_changes
    AFTER UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

CREATE TRIGGER log_student_profiles_changes
    AFTER UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

CREATE TRIGGER log_company_profiles_changes
    AFTER UPDATE ON company_profiles
    FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

CREATE TRIGGER log_tpo_profiles_changes
    AFTER UPDATE ON tpo_profiles
    FOR EACH ROW EXECUTE FUNCTION log_profile_changes();

-- Enable RLS for change log
ALTER TABLE profile_change_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for change log
CREATE POLICY "Users can view their own change log" ON profile_change_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "TPOs can view all change logs" ON profile_change_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'tpo'
        )
    );

-- Function to get recent activity for a user
CREATE OR REPLACE FUNCTION get_user_recent_activity(target_user_id UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    activity_type TEXT,
    description TEXT,
    activity_timestamp TIMESTAMP WITH TIME ZONE,
    details JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'profile_change'::TEXT as activity_type,
        'Profile updated: ' || array_to_string(ARRAY(SELECT jsonb_object_keys(pcl.changed_fields)), ', ') as description,
        pcl.changed_at as activity_timestamp,
        jsonb_build_object(
            'table', pcl.table_name,
            'changed_fields', pcl.changed_fields,
            'new_values', pcl.new_values
        ) as details
    FROM profile_change_log pcl
    WHERE pcl.user_id = target_user_id
    
    UNION ALL
    
    SELECT 
        'application'::TEXT as activity_type,
        'Applied for: ' || jp.title as description,
        a.applied_at as activity_timestamp,
        jsonb_build_object(
            'job_title', jp.title,
            'company', cp.company_name,
            'status', a.status
        ) as details
    FROM applications a
    JOIN job_postings jp ON a.job_id = jp.id
    JOIN company_profiles cp ON jp.company_id = cp.id
    WHERE a.student_id = target_user_id
    
    UNION ALL
    
    SELECT 
        'drive_registration'::TEXT as activity_type,
        'Registered for: ' || pd.title as description,
        dr.registered_at as activity_timestamp,
        jsonb_build_object(
            'drive_title', pd.title,
            'drive_date', pd.drive_date
        ) as details
    FROM drive_registrations dr
    JOIN placement_drives pd ON dr.drive_id = pd.id
    WHERE dr.student_id = target_user_id
    
    ORDER BY activity_timestamp DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance on change tracking
CREATE INDEX idx_profile_change_log_user_id ON profile_change_log(user_id);
CREATE INDEX idx_profile_change_log_changed_at ON profile_change_log(changed_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Function to clean up old notifications (can be called periodically)
CREATE OR REPLACE FUNCTION cleanup_old_notifications(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM notifications 
    WHERE created_at < NOW() - INTERVAL '1 day' * days_old
    AND is_read = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;