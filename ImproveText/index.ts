import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Configuration, OpenAIApi } from "openai";
import { errorHandler } from "../utils/handleErrors";
import axios from "axios";

import { getReply } from "../utils/typechatReplyService";
import { getDetailedMailSummary } from "../utils/typechatMailUndestandingService";
import {
  MailDetailedSummary,
  MailDetailedSummaryResponse,
} from "../models/mailExchangeToClearContextModel";
import { responseTextLength } from "../models/replyType.model";

const configuration = new Configuration({
  basePath: `${process.env.AZURE_OPENAI_ENDPOIN_IMPROVE_TEXT}`,
});

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const mailsHistoric = await axios.get(
      `${
        process.env.REACT_APP_FUNC_ENDPOINT
      }getGraphData?conversationId=${encodeURIComponent(
        req.query.conversationId
      )}`,
      { headers: { Authorization: req.headers.authorization } }
    );

    // Todo : write a function that in a loop splits the mail history to an array where each mailsHistotic.data[i].body  is minus the last MailHistory.data[i=1].body

    // Usage example:
    // const mailBodies = splitMailHistory(mailsHistoric);
    // console.log(mailBodies);

    let textReformuled;

    let cleanedMailExchange: MailDetailedSummaryResponse;
    try {
      cleanedMailExchange = (
        await getDetailedMailSummary(
          JSON.stringify(mailsHistoric.data[mailsHistoric.data.length - 1]),
          context
        )
      ).data;
    } catch (error) {
      errorHandler(error, context);
      console.log(error);
    }

    const prompt2 = `
                    ${JSON.stringify(
                      (cleanedMailExchange.summary as MailDetailedSummary)
                        .summaryText
                    )}.`;

    const prompt3 = `The draft reply to rewrite in professional style:  \n ************* \n "${
      req.body.replyText
    }" \n**********\n 
                   
                    \n Conversation mail to help crafting the reply  : \n ######  ${JSON.stringify(
                      (cleanedMailExchange.summary as MailDetailedSummary)
                        .summaryText
                    )} \n
                     #####. \n  \n`;

    const draftReply = req.body.replyText;
    const cleanedMailExchangeText = (
      cleanedMailExchange.summary as MailDetailedSummary
    ).summaryText;
    const replyObject = { draftReply, cleanedMailExchangeText };

    try {
      textReformuled = await getReply(
        req.body.replyText?.length > 0 ? prompt3 : prompt2,
        context,
        replyObject,
        req.body.replyOption,
        !!req.body.replyText
      );
    } catch (error) {
      errorHandler(error, context);
    }

    context.log("testFormuled", textReformuled);
    const res = (context.res.body = JSON.stringify({
      ...textReformuled.data,
      // ...questionsToAnswerTo.data,
    }));
  } catch (error) {
    context.log("error here now ", error);
    context.res = {
      status: 500,
      body: "message:" + error,
    };
  }
};
export default httpTrigger;

// let questionsToAnswerTo;
// const prompt4 = `extract informations from this mail conversation comming from ${JSON.stringify(
//   lastConverstation.from
// )} then ask me  a serie of questions about what I would write in my reply. the replies then will help you to craft a professional reply to the mail . \n Here's the mail conversation  : \n ${JSON.stringify(
//   lastConverstation.body.content
// )} \n\n\n Here's also all the metadata of the mail conversation : \n ${JSON.stringify(
//   JSON.stringify({ metadata })
// )}`;
// const prompt5 = `You are my mail assistant. You will reply at my place and you should to understand what I would reply regarding the mail content by asling me questions about wht I would reply to the key points of the received mail . my replies then will help you to make a professional response to the mail . \n Here's the mail content  : \n ${JSON.stringify(
//   lastConverstation.body.content
// )} \n\n\n Here's also all the metadata of the mail conversation : \n ${JSON.stringify(
//   JSON.stringify({ metadata })
// )}`;
// const prompt6 = `You are a mail assistant, I'll provide you with the mail content , you should understand the key points of the mail , then you should ask me questions to get what you should reply . \n Here's the mail content  : \n ${JSON.stringify(
//   lastConverstation.body.content
// )} \n\n\n Here's also all the metadata of the mail conversation : \n ${JSON.stringify(
//   JSON.stringify({ metadata })
// )}`;
// const promptGetuestions = `act like an expert in writing , I should reply to the last mail in the mail conversation provided bellow. You will propose me a professional reply by asking me first  questions about the mail content in the boy.content object, then i second time I'll provide you with the replies and  you will be able to write a good reply \n ${JSON.stringify(
//   lastConverstation
// )}`;
// try {
//   questionsToAnswerTo = await getQuestions(prompt6, context);
// } catch (error) {
//   console.log(error);
// }

// const promptCleaningData = `as an expert in data cleaning you should clean the following mail exchange by extracting the past conversation from every body.content item. as a result every message in the conversation array should not contain the past conversation :\n ${JSON.stringify(
//   mailsHistoric.data
// )}`;

// let detailedSummary;
// try {
//   detailedSummary = await getDetailedMailSummary(
//     promptDetailedSummary,
//     context
//   );
// } catch (error) {
//   console.log(error);
// }

// const prompt act like  a helpfull ai writing assistant, act also like an expert in mails writing with 30 years of experience, I wrote a drafted reply, help me to rewrite it in a more professional business tone with use of corporate jargon.

// const prompt = `act like a helpfull ai assistant, act like  an expert in mails writing with 10 years of experience, I wrote a drafted reply, help me to rewrite it in a more professional business tone with use of corporate jargon. Your proposition should be in ${language[0][0]}.
// Here's the drafted reply that you should rewrite : Drafted reply \n”"""${req.body.replyText}""""\n” . And here's the conversation history  to help you undertand better the context and write better reply.  Conversation history  \n”"""${mailsHistoric.data}"""".`;

// const prompt3 = ` act like  an expert in mails writing with 10 years of experience. You should improve the crafted reply after the sentence  ##Drafted reply .Understand the mail conversation thatI give you after ##Conversation history:'
// \n\n ##Drafted reply : ${req.body.replyText}  \n\n ##Reply language: ${
//   language[0][0]
// } ##Conversation history :  \n${JSON.stringify(
//   mailExchange
// )}`;

// const prompt2 = `##Replylanguage: ${
//   language[0][0]
// }. \n ##Conversation-History : \n ${JSON.stringify(mailExchange)}.`;

// function splitMailHistory(mailsHistoric) {
//   const mailBodies = [];
//   mailBodies.push({
//     main_Subject: mailsHistoric.data[0].subject,
//     mail_History: mailsHistoric.data[0].body,
//     receiver: mailsHistoric.data[0].receiver,
//     sender: mailsHistoric.data[0].sender,
//   });
//   for (let i = 1; i <= mailsHistoric.data.length - 1; i++) {
//     mailBodies.push({
//       main_Subject: mailsHistoric.data[i].subject,
//       mail_History: mailsHistoric.data[i].body.replace(
//         mailsHistoric.data[i - 1].body,
//         ""
//       ),
//       receiver: mailsHistoric.data[i].receiver,
//       sender: mailsHistoric.data[i].sender,
//     });
//   }
//   return mailBodies;
// }
