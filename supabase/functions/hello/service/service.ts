
import { Credential } from './../model/credential.ts';
import { NotionApi } from './../client/notionApi.ts';
// import { Database } from './../client/database';
import { scoreCalculate } from './scoreCalculate.ts';

const supabaseUrl = 'SUPABASE_URL'; // Replace with your Supabase URL
const supabaseKey = 'SUPABASE_ANON_KEY'; // Replace with your Supabase anonymous key
// const database = new Database(supabaseUrl, supabaseKey);

export async function runBusinessLogic(credentialArray: Credential[], notionApi: NotionApi) {

  // fetch data from DB
  // const players = await database.fetchPlayerDetailsDB();  
  
  const validResponses = [];
  for (const credential of credentialArray) {
    // console.log(player);
    const is_valid: boolean =
    credential.api_key && credential.api_key.includes("secret_") 
    && credential.database_id && credential.database_id.includes("-");

    // add player id is not implemented. need to understand the "Name" key check
    //{{$json[\"win_exists\"]}}
    if (is_valid) {
      try {
        const pageList = await notionApi.getDatabasePages(credential);
        for (const pageItem of pageList){
          scoreCalculate(pageItem);
        }
        validResponses = pageList;
      } catch (error) {
        console.error(error);
      }
    }
  }
  
    return validResponses;
  }