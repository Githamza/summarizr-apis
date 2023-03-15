import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const openai = new OpenAIApi(configuration);
  console.log(openai);
  const textSummurize = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    n: 1,
    messages: [
      {
        role: "system",
        content: "tu es un expert en comprehension des mails et y répondre ",
      },
      {
        role: "user",
        content: `reformule moi cette réponse 
            ${req.body.resonse} de ce mail :${req.body.mail} . le mail venant de ${req.body.sender}: `,
      },
    ],
    // prompt: `${req.body.text.join("\n")}.\n résume ce texte en ${
    //   req.body.language
    // }    `,
    max_tokens: 400,
  });
  context.log("HTTP trigger function processed a request.");
  const name = req.query.name || (req.body && req.body.name);
  const responseMessage = name
    ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
