
// import { Credential } from './../model/credential.ts';
import { NotionApi } from './../client/notionApi.ts';
import { Database } from './../client/database.ts';
import { scoreCalculate } from './scoreCalculate.ts';
import { Player } from './../model/player';

// Define batch size for processing
const batchSize = 50;
const db = new Database(); 
const notionApi = new NotionApi(); // Initialize NotionApi instance here

export async function runBusinessLogic() {

  // fetch data from DB
  const players = await db.fetchPlayerDetailsDB();
  // console.log(players);
  // Process data in batches
  for (let i = 0; i < players.length; i += batchSize) {
    const batch = players.slice(i, i + batchSize);
    await processBatch(batch);
  }

}

async function processBatch(batch: Player[]) {

  const trackedPlayerScore: any[] = [];

  // Process and update data in the batch
  for (let i = 0; i < batch.length; i++) {
    const player = batch[i];
    // console.log(player);

    const isValid: boolean = validateData(player);

    // add player id is not implemented. need to understand the "Name" key check
    //{{$json[\"win_exists\"]}}
    if (isValid) {
      try {
        const pageList = await notionApi.getDatabasePages(player);
        for (const pageItem of pageList) {
          // updates details inside this object itself
          scoreCalculate(pageItem);
          console.log(pageItem);
        }
        trackedPlayerScore.splice(i, 0, pageList);
      } catch (error) {
        console.error(error);
      }
    }
  }

  if(trackedPlayerScore.length == 0){
    // in case no data was received from DB or Notion
    // TODO add some warning signal
    console.log("No data updated in this Batch");
    return;
  }
  console.log(trackedPlayerScore);

  // // Start a database transaction
  // const transaction = await supabase.startTransaction();
  // try {
  //   // All the players passed in this argument & which successfully completed it's score calculation
  //   // "table": "success_plan",
  //   // "columns": "difficulty, notion_id, name, type, do_date, closing_date, upstream, player, punctuality, exp_reward, gold_reward, trend, area, database_nickname, impact, upstream_id, source",


  //   // Commit the transaction if processing is successful
  //   await transaction.commit();
  // } catch (error) {
  //   // Roll back the transaction in case of an error
  //   await transaction.rollback();
  //   console.error('Error processing batch:', error);
  // }
}

function validateData(player: Player){
  return player.api_secret_key && player.api_secret_key.includes("secret_")
      && player.database_id && player.database_id.includes("-");
}
