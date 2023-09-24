// notionApi.ts
import { Player } from './../model/player';
import { NotionPageWin } from './../model/notionPageWin';

export class NotionApi {

  private api_secret_key: String;
  constructor(){
    this.api_secret_key = Deno.env.get('NOTION_API_KEY_TEST');
  }

   sanitizePageProperties(pageProperties: any): NotionPageWin {
    return {
        name: pageProperties["Name"],
        impact: pageProperties["Impact"],
        source: "Notion",
        type: pageProperties.Type ? pageProperties.Type.toString().split(',')[0] : "Uncategorized",
        do_date: pageProperties["Do Date"] && pageProperties["Do Date"]["start"]
            ? pageProperties["Do Date"]["end"] ? pageProperties["Do Date"]["end"] : pageProperties["Do Date"]["start"]
            : "",
        closing_date: pageProperties["Closing Date"] && pageProperties["Closing Date"]["start"]
            ? pageProperties["Closing Date"]["start"]
            : new Date(),
        upstream: pageProperties["Upstream (Sum)"] ? pageProperties["Upstream (Sum)"] : "",
        area: Array.isArray(pageProperties.Area) ? pageProperties.Area[0] : pageProperties.Area,
        upstream_id: pageProperties.Upstream ? pageProperties.Upstream.toString() : null,
        difficulty: pageProperties.Difficulty ? Number(pageProperties.Difficulty) : 1
    };
  }
  

  async getDatabasePages(player: Player): Promise<NotionPageWin[]> {
    const notionApiUrl = `https://api.notion.com/v1/databases/${player.database_id}/query`; 
    const filter = {
      filter: {
          and: [
              {
                  property: "Family Connection",
                  rich_text: {
                      does_not_contain: "Shared With Family"
                  }
              },
              {
                  property: "Share With Family?",
                  checkbox: {
                      equals: true
                  }
              }
          ]
      }
  };
    try {
      // console.log(notionApiUrl);
      const response = await fetch(notionApiUrl, {
        method: "POST", // or any other HTTP method required
        headers: {
          // "Authorization": `Bearer ${player.api_secret_key}`,
          "Authorization": `Bearer ${this.api_secret_key}`,
          "Notion-Version": "2022-06-28",
          // Add other required headers
        },
        body: JSON.stringify({
            filter
        })
      });

      if (response.ok) {
        const responseData = await response.json();

        const sanitizedData = responseData.results.map(page => this.sanitizePageProperties(page.properties));
        return sanitizedData;
      } else {
        throw new Error("API request failed: " + response.statusText);
      }
    } catch (error) {
      throw new Error("An error occurred: " + error);
    }
  }
}