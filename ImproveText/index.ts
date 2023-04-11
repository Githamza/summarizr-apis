import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const openai = new OpenAIApi(configuration);
  console.log(openai);
  try {
  const mailsHistoric = await axios.get(
    `${process.env.REACT_APP_FUNC_ENDPOINT}getGraphData?conversationId=${req.query.conversationId}`,
    { headers: { Authorization: req.headers.authorization } }
    );
    const textReformuled = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      n: 1,
      messages: [
        {
          role: "system",
          content: `tu es un expert en rédaction de mails , je te fournis un texte que tu dois reformuler en mail plus professionnelle, je te fournis aussi l'historique de tous les échanges précédents que tu utiliseras pour comprendre le contexte. réponds moi juste avec le mail à envoyer`,
        },
        {
          role: "user",
          content: req.body.response,
        },
        {
          role: "user",
          content: "c'est la réponse écrite, à reformuler ",
        },
        {
          role: "user",
          content: "l'historique de la conversation ",
        },
        { role: "user", content: JSON.stringify(mailsHistoric.data.value) },
      ],
      // prompt: `${req.body.text.join("\n")}.\n résume ce texte en ${
      //   req.body.language
      // }    `,
      max_tokens: 400,
    });

    context.res.body = textReformuled.data.choices[0].message.content;
    context.done();
  } catch (error) {
    console.log(error);
    context.res= {
      status:500,
      body:error.message
    }
  }
};

export default httpTrigger;
