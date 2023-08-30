import { createClient, SupabaseClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';

interface Player {
    id: number;
    api_secret_key: string;
    database_id: string;
    player: string;
    collaborator: string;
    nickname: string;
    err_execution_id: string;
}
export class Database {
    private supabase: SupabaseClient;

    constructor(supabaseUrl: string, supabaseKey: string) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async fetchPlayerDetailsDB(): Promise<Player[]> {
        const { data, error } = await this.supabase
            .from('notion_credentials')
            .select('id, api_secret_key, database_id, player, collaborator, nickname, err_execution_id')
            .neq('error', true);

        if (error) {
            console.error('Error fetching credentials:', error);
            throw new Error('Error fetching credentials');
        }

        return data as Player[];
    }

    // async updateCredential(id: number, updatedData: Partial<Credential>): Promise<void> {
    //     const { error } = await this.supabase
    //         .from('notion_credentials')
    //         .update(updatedData)
    //         .eq('id', id);

    //     if (error) {
    //         console.error('Error updating credential:', error);
    //         throw new Error('Error updating credential');
    //     }
    // }
}