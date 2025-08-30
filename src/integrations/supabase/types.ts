export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          address: string | null
          company_name: string
          created_at: string
          description: string | null
          hr_contact_email: string | null
          hr_contact_name: string | null
          hr_contact_phone: string | null
          id: string
          industry: string | null
          logo_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          hr_contact_email?: string | null
          hr_contact_name?: string | null
          hr_contact_phone?: string | null
          id: string
          industry?: string | null
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          hr_contact_email?: string | null
          hr_contact_name?: string | null
          hr_contact_phone?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drive_registrations: {
        Row: {
          drive_id: string
          id: string
          registered_at: string
          student_id: string
        }
        Insert: {
          drive_id: string
          id?: string
          registered_at?: string
          student_id: string
        }
        Update: {
          drive_id?: string
          id?: string
          registered_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "drive_registrations_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "placement_drives"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drive_registrations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          application_deadline: string | null
          company_id: string | null
          created_at: string
          description: string | null
          experience_required: number | null
          id: string
          is_active: boolean | null
          job_type: Database["public"]["Enums"]["job_type"]
          location: string | null
          requirements: string | null
          salary_max: number | null
          salary_min: number | null
          skills_required: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          application_deadline?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          experience_required?: number | null
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          application_deadline?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          experience_required?: number | null
          id?: string
          is_active?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string | null
          requirements?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      placement_drives: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          drive_date: string | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          registration_deadline: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          drive_date?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          registration_deadline?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          drive_date?: string | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          registration_deadline?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "placement_drives_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          address: string | null
          cgpa: number | null
          created_at: string
          date_of_birth: string | null
          department: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          resume_url: string | null
          skills: string[] | null
          student_id: string | null
          updated_at: string
          year_of_study: number | null
        }
        Insert: {
          address?: string | null
          cgpa?: number | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          year_of_study?: number | null
        }
        Update: {
          address?: string | null
          cgpa?: number | null
          created_at?: string
          date_of_birth?: string | null
          department?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          student_id?: string | null
          updated_at?: string
          year_of_study?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tpo_profiles: {
        Row: {
          created_at: string
          department: string | null
          designation: string | null
          employee_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          designation?: string | null
          employee_id?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          designation?: string | null
          employee_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tpo_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status: "pending" | "shortlisted" | "rejected" | "selected"
      job_type: "full_time" | "part_time" | "internship" | "contract"
      user_role: "student" | "tpo" | "company"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never