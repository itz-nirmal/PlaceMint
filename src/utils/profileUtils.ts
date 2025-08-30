import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/services/database";

/**
 * Ensures that a user profile exists in the database
 * Creates one if it doesn't exist
 */
export const ensureProfileExists = async (userId: string, email: string, fullName?: string, role: UserRole = 'student') => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // If profile doesn't exist, create it
    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          full_name: fullName || '',
          role: role
        });

      if (profileError) {
        throw profileError;
      }

      // If it's a student, also create student profile
      if (role === 'student') {
        const { error: studentError } = await supabase
          .from('student_profiles')
          .insert({
            id: userId
          });

        if (studentError) {
          console.error('Error creating student profile:', studentError);
          // Don't throw error here as the main profile was created successfully
        }
      }

      return { created: true, role };
    }

    return { created: false, role: existingProfile.role };
  } catch (error) {
    console.error('Error ensuring profile exists:', error);
    throw error;
  }
};

/**
 * Gets the user's profile with role information
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};