import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import LanguageDetect = require('languagedetect');

const configuration = new Configuration({
  basePath: `${process.env.AZURE_OPEN_AI_ENDPOINT}/openai/deployments/summarizR/chat/completions?api-version=2023-03-15-preview`,
});
const configurationDavinci = new Configuration({
  basePath: `${process.env.AZURE_OPEN_AI_ENDPOINT}/openai/deployments/summarizrDavinci/completions?api-version=2023-03-15-preview`,
});
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const lngDetector = new LanguageDetect();
  const openai = new OpenAIApi(configuration);
  try {
    context.log("mails");
    context.log(req.headers);

    // const mailsHistoric = await axios.get(
    //   `${process.env.REACT_APP_FUNC_ENDPOINT}getGraphData?conversationId=${encodeURIComponent(req.query.conversationId)}`,
    //   { headers: { Authorization: req.headers.authorization } }
    //   );
      const language =await lngDetector.detect(JSON.stringify(req.body.response))

    context.log("mails");
    const textReformuled = await axios.post(
      configurationDavinci.basePath,
      {
        prompt:`you are a helpfull ai assistant, help me to write a professional reply. your response should be in ${language} and don't add name or signature at the end. Here's the draft reply that contains also the history exchange, I get it using Officejs library by using Office.context.mailbox.item.body.getAsync , so you should undestand the exchange in this format : "${JSON.stringify(req.body.response)} ".`,
        max_tokens: 1000,
      },
      {
        headers: {
          "api-key": process.env.AZURE_OPEN_AI_KEY,
          "Content-Type": "application/json",
        },
      }
    );
context.log({textReformuled})
    context.res.body = JSON.stringify(textReformuled.data.choices[0].text);
    context.done();
  } catch (error) {
    context.log( "error here now ",error);
    context.res = {
      status: 500,
      body: "message:" + error,
    };
  }
};

export default httpTrigger;
