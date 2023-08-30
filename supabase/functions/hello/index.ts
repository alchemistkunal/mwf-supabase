// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { runBusinessLogic } from './service/service.ts';
import { Credential } from './model/credential.ts';
import { NotionApi } from './client/notionApi.ts';

const notionApi = new NotionApi(); // Initialize NotionApi instance here


serve(async (req) => {
  // const { name } = await req.json()
  // const data = {
  //   message: `Hello ${name}!`,
  // }
  const { api_key, database_id } = await req.json(); // Parse the input JSON
  console.log("Hello from Functions!")

  const credential_result: Credential[] = [
    { api_key: api_key, database_id: database_id },
    // You can add more credentials if needed
  ];

  
  const validResponses = await runBusinessLogic(credential_result, notionApi);

  return new Response(
    JSON.stringify(validResponses),
    { headers: { "Content-Type": "application/json" } },
  )
})

