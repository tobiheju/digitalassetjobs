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
      companies: {
        Row: {
          benefits: string[] | null
          careers_url: string | null
          created_at: string | null
          description: string | null
          employee_count: string | null
          founded: number | null
          funding: string | null
          headquarters: string | null
          id: string
          job_count: number | null
          linkedin_url: string | null
          logo_url: string | null
          long_description: string | null
          name: string
          tags: string[] | null
          tech_stack: string[] | null
          twitter_url: string | null
          type: string | null
          updated_at: string | null
          website: string | null
          why_work_here: string[] | null
        }
        Insert: {
          benefits?: string[] | null
          careers_url?: string | null
          created_at?: string | null
          description?: string | null
          employee_count?: string | null
          founded?: number | null
          funding?: string | null
          headquarters?: string | null
          id: string
          job_count?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          long_description?: string | null
          name: string
          tags?: string[] | null
          tech_stack?: string[] | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          why_work_here?: string[] | null
        }
        Update: {
          benefits?: string[] | null
          careers_url?: string | null
          created_at?: string | null
          description?: string | null
          employee_count?: string | null
          founded?: number | null
          funding?: string | null
          headquarters?: string | null
          id?: string
          job_count?: number | null
          linkedin_url?: string | null
          logo_url?: string | null
          long_description?: string | null
          name?: string
          tags?: string[] | null
          tech_stack?: string[] | null
          twitter_url?: string | null
          type?: string | null
          updated_at?: string | null
          website?: string | null
          why_work_here?: string[] | null
        }
        Relationships: []
      }
      job_sources: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          jobs_fetched: number | null
          last_fetched_at: string | null
          source_name: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          jobs_fetched?: number | null
          last_fetched_at?: string | null
          source_name: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          jobs_fetched?: number | null
          last_fetched_at?: string | null
          source_name?: string
          status?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          benefits: string[] | null
          city: string | null
          company: string
          company_type: string | null
          country: string | null
          country_code: string | null
          created_at: string | null
          department: string | null
          description: string | null
          featured: boolean | null
          id: string
          is_remote: boolean | null
          location: string | null
          posted_date: string | null
          requirements: string[] | null
          salary: string | null
          salary_currency: string | null
          salary_display: string | null
          salary_max: number | null
          salary_min: number | null
          seniority: string | null
          skills: string[] | null
          source: string | null
          source_id: string | null
          tags: string[] | null
          title: string
          type: string | null
          updated_at: string | null
          url: string | null
          verified: boolean | null
          verified_at: string | null
          work_arrangement: string | null
        }
        Insert: {
          benefits?: string[] | null
          city?: string | null
          company: string
          company_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          featured?: boolean | null
          id: string
          is_remote?: boolean | null
          location?: string | null
          posted_date?: string | null
          requirements?: string[] | null
          salary?: string | null
          salary_currency?: string | null
          salary_display?: string | null
          salary_max?: number | null
          salary_min?: number | null
          seniority?: string | null
          skills?: string[] | null
          source?: string | null
          source_id?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          verified?: boolean | null
          verified_at?: string | null
          work_arrangement?: string | null
        }
        Update: {
          benefits?: string[] | null
          city?: string | null
          company?: string
          company_type?: string | null
          country?: string | null
          country_code?: string | null
          created_at?: string | null
          department?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_remote?: boolean | null
          location?: string | null
          posted_date?: string | null
          requirements?: string[] | null
          salary?: string | null
          salary_currency?: string | null
          salary_display?: string | null
          salary_max?: number | null
          salary_min?: number | null
          seniority?: string | null
          skills?: string[] | null
          source?: string | null
          source_id?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
          verified?: boolean | null
          verified_at?: string | null
          work_arrangement?: string | null
        }
        Relationships: []
      }
      verification_logs: {
        Row: {
          checked_at: string | null
          error_message: string | null
          id: string
          is_valid: boolean | null
          job_id: string | null
          status_code: number | null
        }
        Insert: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          is_valid?: boolean | null
          job_id?: string | null
          status_code?: number | null
        }
        Update: {
          checked_at?: string | null
          error_message?: string | null
          id?: string
          is_valid?: boolean | null
          job_id?: string | null
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
