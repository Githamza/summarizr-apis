/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import { Context, HttpRequest } from "@azure/functions";

import { Configuration, OpenAIApi } from "openai";

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
  apiKey: process.env.OPENAI_API_KEY,
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
  try {
    const openai = new OpenAIApi(configuration);
    console.log(openai);
    const textSummurize = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: [
        {
          role: "system",
          content: "tu es un expert en comprehension des mails et les résumer ",
        },
        {
          role: "user",
          content:
            `fais moi un résumé en
            ${req.body.language} de ce mail venant de ${req.body.sender}: ` +
            req.body.text,
        },
      ],
      // prompt: `${req.body.text.join("\n")}.\n résume ce texte en ${
      //   req.body.language
      // }    `,
      max_tokens: 400,
    });
    const actions = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: [
        {
          role: "system",
          content: "tu es un expert en comprehension des mails et les résumer ",
        },
        {
          role: "user",
          content: `trouve moi, quelques actions les plus importantes discutées , ta réponse devrait être en ${req.body.language} en bullet points. voici le text: ${req.body.text}`,
        },
      ],
      max_tokens: 400,
    });
    context.res.body = {
      summurize: textSummurize.data.choices[0].message.content,
      actions: actions.data.choices[0].message.content,
    };

    context.log("HTTP trigger function processed a request.");
  } catch (error) {
    context.log(error);
    context.res.status = 500;
    context.res.body = error;
  }

  // Put an echo into response body.
  context.res.body.receivedHTTPRequestBody = req.body || "";

  return;
}
