import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
import LanguageDetect = require("languagedetect");
import { getSummary } from "../utils/typechatService";
import { errorHandler } from "../utils/handleErrors";
import axios from "axios";
const configuration = new Configuration({
  basePath: `${process.env.AZURE_OPENAI_ENDPOIN_IMPROVE_TEXT}`,
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

    const mailsHistoric = await axios.get(
      `${
        process.env.REACT_APP_FUNC_ENDPOINT
      }getGraphData?conversationId=${encodeURIComponent(
        req.query.conversationId
      )}`,
      { headers: { Authorization: req.headers.authorization } }
    );
    const mailExchange = {
      main_Subject: mailsHistoric.data[mailsHistoric.data.length - 1].subject,
      mail_History: mailsHistoric.data[mailsHistoric.data.length - 1].body,
      last_Receiver: mailsHistoric.data[mailsHistoric.data.length - 1].receiver,
      last_sender: mailsHistoric.data[mailsHistoric.data.length - 1].sender,
    };
    const language = await lngDetector.detect(
      JSON.stringify(mailsHistoric.data)
    );

    context.log("mails");
    let textReformuled;
    // const prompt act like  a helpfull ai writing assistant, act also like an expert in mails writing with 30 years of experience, I wrote a drafted reply, help me to rewrite it in a more professional business tone with use of corporate jargon.

    // const prompt = `act like a helpfull ai assistant, act like  an expert in mails writing with 10 years of experience, I wrote a drafted reply, help me to rewrite it in a more professional business tone with use of corporate jargon. Your proposition should be in ${language[0][0]}.
    // Here's the drafted reply that you should rewrite : Drafted reply \n”"""${req.body.replyText}""""\n” . And here's the conversation history  to help you undertand better the context and write better reply.  Conversation history  \n”"""${mailsHistoric.data}"""".`;

    const prompt2 = `Act as an expert in mails writing with 10 years of experience you should understand the mail conversation and find who is the last sender. propose a 1 to 3 lines reply from the  receiver to the  sender. you find the conversation history object after ##Conversation-History sentence
 ##Conversation-History : \n ${JSON.stringify(mailExchange)}.`;
    // const prompt2 = `##Replylanguage: ${
    //   language[0][0]
    // }. \n ##Conversation-History : \n ${JSON.stringify(mailExchange)}.`;
    const prompt3 = `Act as an expert in mails writing with 10 years of experience.  You should improve the crafted reply after the sentence  ##Drafted-Reply. Before, You should understand the mail conversation and find who is the last sender and propose a reply from the last mail receiver to the last sender. you find the conversation history object after ##Conversation-History sentence
    \n\n ##Drafted reply : ${req.body.replyText}  
    } ##Conversation history :  \n${JSON.stringify(mailExchange)}`;
    // const prompt3 = ` act like  an expert in mails writing with 10 years of experience. You should improve the crafted reply after the sentence  ##Drafted reply .Understand the mail conversation thatI give you after ##Conversation history:'
    // \n\n ##Drafted reply : ${req.body.replyText}  \n\n ##Reply language: ${
    //   language[0][0]
    // } ##Conversation history :  \n${JSON.stringify(
    //   mailExchange
    // )}`;
    try {
      textReformuled = await getSummary(
        req.body.replyText?.length ? prompt3 : prompt2,
        "Improve",
        context,
        !!req.body.replyText
        // mailsHistoric.data
      );
    } catch (error) {
      errorHandler(error, context);
    }
    context.log("testFormuled", textReformuled);
    context.res.body = JSON.stringify(textReformuled.data);
  } catch (error) {
    context.log("error here now ", error);
    context.res = {
      status: 500,
      body: "message:" + error,
    };
  }
};
export default httpTrigger;
