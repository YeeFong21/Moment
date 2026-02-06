export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            entries: {
                Row: {
                    id: string
                    user_id: string
                    type: 'photo' | 'quote'
                    text: string | null
                    happened_on: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'photo' | 'quote'
                    text?: string | null
                    happened_on: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'photo' | 'quote'
                    text?: string | null
                    happened_on?: string
                    created_at?: string
                }
            }
            entry_images: {
                Row: {
                    id: string
                    entry_id: string
                    storage_path: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    entry_id: string
                    storage_path: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    entry_id?: string
                    storage_path?: string
                    created_at?: string
                }
            }
        }
    }
}
