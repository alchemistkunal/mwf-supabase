// import { createClient, SupabaseClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
import { Player } from './../model/player';
import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts'

export class Database {
    // private supabase: SupabaseClient;
    private pool: Pool;
  
    constructor() {
      const databaseUrl = Deno.env.get('POSTGRES_SUPABASE_DB_URL');
      if (!databaseUrl) {
        throw new Error('POSTGRES_SUPABASE_DB_URL environment variable is not set.');
      }
      console.log(databaseUrl);

      this.pool = new postgres.Pool(databaseUrl, 3, true);
    }

    async fetchPlayerDetailsDB(): Promise<Player[]> {

        // const { data, error } = await this.supabase
        //     .from('notion_credentials')
        //     .select('id, api_secret_key, database_id, player, collaborator, nickname, err_execution_id')
        //     .neq('error', true);

        // if (error) {
        //     console.error('Error fetching credentials:', error);
        //     throw new Error('Error fetching credentials');
        // }
        try {
            // Grab a connection from the pool
            const connection = await this.pool.connect()

            try {
                // Run a query
                const result = await connection.queryObject`SELECT * FROM notion_credentials where error != true`
                const players = result.rows // [{ id: 1, name: "Lion" }, ...]
                
                return players as Player[];
            } finally {
                // Release the connection back into the pool
                connection.release()
            }
        } catch (err) {
            console.error(err)
            return new Response(String(err?.message ?? err), { status: 500 })
        }
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