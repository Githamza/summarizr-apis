/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import { Context, HttpRequest } from "@azure/functions";

import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

interface Response {
  status: number;
  body: { [key: string]: any };
}

/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - new OnBehalfOfUserCredential(ssoToken, authConfig)  - Construct OnBehalfOfUserCredential instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 * - createMicrosoftGraphClientWithCredential() - Get a graph client to access user's Microsoft 365 data.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 */

const configuration = new Configuration({
  basePath: `${process.env.AZURE_OPEN_AI_ENDPOINT}/openai/deployments/summarizR/chat/completions?api-version=2023-03-15-preview`,
});
const configurationDavinci = new Configuration({
  basePath: `${process.env.AZURE_OPEN_AI_ENDPOINT}/openai/deployments/summarizrDavinci/completions?api-version=2023-03-15-preview`,
});

export default async function run(
  context: Context,
  req: HttpRequest
): Promise<Response> {
  // Initialize response.
  const res: Response = {
    status: 200,
    body: {},
  };
  const reason = req.body.reason;
  try {
    switch (reason) {
      case "SUM_MAIL":
        // const textSummarize = await axios.post(
        //   configuration.basePath,
        //   {
        //     messages: [
        //       {
        //         role: "system",
        //         content:
        //         "You are an AI assistant that helps people  summarizing emails in shot texts that does not surpass 20 words",
        //       },
        //       {
        //         role: "user",
        //         content:
        //           `fais moi un résumé en
        //         ${req.body.language} de ce mail venant de ${req.body.sender}: ` +
        //           req.body.text,
        //       }
        //     ],
        //     // prompt: `${req.body.text.join("\n")}.\n résume ce texte en ${
        //     //   req.body.language
        //     // }    `,
        //     max_tokens: 400,
        //     stream: true,
        //   },
        //   {
        //     headers: {
        //       "api-key": process.env.AZURE_OPEN_AI_KEY,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        const textSummarize = await axios.post(
          configurationDavinci.basePath,
          {
            prompt: 
                `You are a helpful assistant expert on summarizing shortly mails .summurize in ${req.body.language} this mail comming from  ${req.body.sender}: `+req.body.text,
            max_tokens: 400,
            temperature:0.7,
            top_p:1.0,
            stream: true,
          } ,
          {
            headers: {
              "api-key": process.env.AZURE_OPEN_AI_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        context.res.headers = {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        };
        context.res.body = textSummarize.data;

        context.log("HTTP trigger function processed a request.");

        break;
      case "SUM_GLANCE":
        const actions = await axios.post(
          configurationDavinci.basePath,
          {
            prompt: 
                  `you are a useful ai assistant expert on summarizing shortly mails in bullet points. write the most 3 important actions discussed in the mail  , your response should be in ${req.body.language} and in bullet points format. here's the mail: ${req.body.text}` ,
            max_tokens: 400,
            stream: true,
          },
          {
            headers: {
              "api-key": process.env.AZURE_OPEN_AI_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        context.res.headers = {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        };
        context.res.body = actions.data;

        context.log("HTTP trigger function processed a request.");

        break;

      default:
        break;
    }
  } catch (error) {
    context.log(error);
    context.res.status = 500;
    context.res.body = error;
  }

  // Put an echo into response body.

  return;
}
function formatSSEData(dataArray: any[]): string {
  return dataArray
    .map((data, index) => `data: ${JSON.stringify(data)}\n\n`)
    .join("");
}
