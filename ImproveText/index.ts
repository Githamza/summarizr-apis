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
    const mailsHistoric = await axios.get(
      `${process.env.REACT_APP_FUNC_ENDPOINT}getGraphData?conversationId=${req.query.conversationId}`,
      { headers: { Authorization: req.headers.authorization } }
      );
      const language =await lngDetector.detect( JSON.stringify(mailsHistoric.data))[0][0]

    context.log("mails");
    const textReformuled = await axios.post(
      configurationDavinci.basePath,
      {
        prompt:`you are a helpful ai assistant, help me to write a professional reply. here's the draft reply : "${JSON.stringify(req.body.response.split("From:")[0])} ". I'm giving you also the mail history so that you can write a better contextualized reply. Here's the discussion history: "${JSON.stringify(mailsHistoric.data)}" your response should be in ${language} and don't add name and position signature at the end`,
        max_tokens: 1000,
      },
      {
        headers: {
          "api-key": process.env.AZURE_OPEN_AI_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    context.res.body = JSON.stringify(textReformuled.data.choices[0].text);
    context.done();
  } catch (error) {
    context.log(error.message);
    context.res = {
      status: 500,
      body: "message:" + error,
    };
  }
};

export default httpTrigger;
