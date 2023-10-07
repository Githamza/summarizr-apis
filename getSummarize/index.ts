/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import { Context, HttpRequest } from "@azure/functions";

import { getSummary } from "../utils/typechatService";
import { errorHandler } from "../utils/handleErrors";

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
        const prompt =
          `Summurize in ${req.body.language} this mail ` + req.body.text;
        let textSummarize;
        try {
          textSummarize = await getSummary(prompt, "SUM_MAIL", context);
        } catch (error) {
          errorHandler(error, context);
        }

        console.log({ textSummarize });
        context.res.body = textSummarize.data;

        context.log("HTTP trigger function processed a request.");

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
