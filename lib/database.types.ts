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
      articles: {
        Row: {
          author: string
          content: string
          created_at: string
          excerpt: string
          id: string
          image_url: string | null
          published_at: string
          slug: string
          title: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          image_url?: string | null
          published_at: string
          slug: string
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          published_at?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      grands_prix: {
        Row: {
          country: string | null
          id: string
          name: string
        }
        Insert: {
          country?: string | null
          id?: string
          name: string
        }
        Update: {
          country?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      replays: {
        Row: {
          created_at: string
          grand_prix_id: string
          id: string
          streams: Json | null
          thumbnail_url: string | null
          year: number
        }
        Insert: {
          created_at?: string
          grand_prix_id: string
          id?: string
          streams?: Json | null
          thumbnail_url?: string | null
          year: number
        }
        Update: {
          created_at?: string
          grand_prix_id?: string
          id?: string
          streams?: Json | null
          thumbnail_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "replays_grand_prix_id_fkey"
            columns: ["grand_prix_id"]
            isOneToOne: false
            referencedRelation: "grands_prix"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          id: number
          site_description: string | null
          site_title: string | null
        }
        Insert: {
          id?: number
          site_description?: string | null
          site_title?: string | null
        }
        Update: {
          id?: number
          site_description?: string | null
          site_title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
