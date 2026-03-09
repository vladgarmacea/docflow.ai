export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      workflows: {
        Row: {
          id:          string
          name:        string
          description: string | null
          config:      Json
          created_at:  string
          updated_at:  string
          created_by:  string | null
          is_active:   boolean
        }
        Insert: Omit<Database['public']['Tables']['workflows']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['workflows']['Insert']>
      }
      runs: {
        Row: {
          id:           string
          workflow_id:  string
          filename:     string
          file_path:    string | null
          status:       'pending' | 'processing' | 'done' | 'error'
          result:       Json | null
          error:        string | null
          created_by:   string | null
          created_at:   string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['runs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['runs']['Insert']>
      }
      context_files: {
        Row: {
          id:          string
          workflow_id: string
          name:        string
          description: string | null
          file_path:   string
          file_type:   'pdf' | 'json' | 'txt' | 'csv'
          parsed_text: string | null
          created_at:  string
        }
        Insert: Omit<Database['public']['Tables']['context_files']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['context_files']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Workflow    = Database['public']['Tables']['workflows']['Row']
export type Run         = Database['public']['Tables']['runs']['Row']
export type ContextFile = Database['public']['Tables']['context_files']['Row']

export interface WorkflowConfig {
  version:     '1.0'
  name:        string
  description: string
  input: { type: 'pdf' | 'docx' | 'txt' | 'json' | 'any'; description: string }
  context?: { files?: string[]; companyProfile?: boolean }
  steps: WorkflowStep[]
  output: { format: 'json' | 'excel' | 'markdown'; schema?: Record<string, unknown> }
}

export interface WorkflowStep {
  id:         string
  name:       string
  type:       'extract' | 'analyze' | 'classify' | 'summarize' | 'validate' | 'transform'
  prompt:     string
  outputKey:  string
  required:   boolean
  dependsOn?: string[]
}
