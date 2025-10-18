import type { Database } from './database.types.ts';
export declare const supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        notes: {
            Row: {
                content: string | null;
                created_at: string;
                id: string;
                title: string | null;
                updated_at: string;
                user_id: string | null;
            };
            Insert: {
                content?: string | null;
                created_at?: string;
                id?: string;
                title?: string | null;
                updated_at?: string;
                user_id?: string | null;
            };
            Update: {
                content?: string | null;
                created_at?: string;
                id?: string;
                title?: string | null;
                updated_at?: string;
                user_id?: string | null;
            };
            Relationships: [];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: { [_ in never]: never; };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "13.0.5";
}>;
//# sourceMappingURL=supabaseClient.d.ts.map