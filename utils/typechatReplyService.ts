import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { RewordedDraftTextResponse } from "../models/improveReplySchemaModel";
import { Context } from "@azure/functions";
import { replySuggestionResponse } from "../models/quickReplyModel";
import { responseTextLength } from "../models/replyType.model";
import { createTypeScriptJsonValidator } from "typechat/ts";

const model = createLanguageModel(process.env);
export const getReply = async (
  context: Context,
  replyText,
  mailInfos,
  // mailInfosResume,
  mailToReplyTo,
  responseLength: string,
  hasreplyText?: boolean
): Promise<Success<RewordedDraftTextResponse>> => {
  let schema;
  try {
    if (hasreplyText) {
      schema = fs.readFileSync(
        path.join(__dirname, "/../models/improveReplySchemaModel.ts"),
        "utf8"
      );
    } else {
      schema = fs.readFileSync(
        path.join(__dirname, "../models/quickReplyModel.ts"),
        "utf8"
      );
    }
  } catch (error) {
    context.log("fileread", { error });
  }
  let translator;
  let response;
  if (hasreplyText) {
    context.log("improve");
    const validator = createTypeScriptJsonValidator<RewordedDraftTextResponse>(
      schema,
      "RewordedDraftTextResponse"
    );
    translator = createJsonTranslator<RewordedDraftTextResponse>(
      model,
      validator
    );
    const chatArray = [replyWithdraftAssistant];
    response = await superTranslate(
      translator,
      chatArray,
      context,
      responseLength,
      replyText,
      mailInfos,
      // mailInfosResume,
      mailToReplyTo
    );
  } else {
    const chatArray = [quickReplyAssistant];
    context.log("improve");
    const validator = createTypeScriptJsonValidator<replySuggestionResponse>(
      schema,
      "replySuggestionResponse"
    );
    translator = createJsonTranslator<replySuggestionResponse>(
      model,
      validator
    );
    response = await superTranslate(
      translator,
      chatArray,
      context,
      responseLength,
      replyText,
      mailInfos,
      // mailInfosResume,
      mailToReplyTo
    );
  }
  return response;
};

const superTranslate = (
  translator: any,
  assistant: any,
  context: Context,
  responseLength: string,
  replyText: boolean,
  mailInfos: any,
  // mailInfosResume: any,
  mailToReplyTo: any
) => {
  const replyLengthText =
    responseTextLength[responseLength.toLocaleLowerCase()].replyLength;
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      if (replyText) {
        response = await translator.translate(
          `I have drafted a reply to an email conversation, but I need help refining it to sound more professional and incorporate appropriate corporate jargon. Here is my draft reply:

"DRAFT: ${replyText}"

Based on the context of the email conversation below, please help me revise my draft to create a brief polished and professional response.


The Receipient of the mail is the person who will reply to the mail. which is me  \n


The reply should be ${responseLength},   ${replyLengthText} maximum .\n \n
 

[THE CONVERSATION] : ${JSON.stringify(mailInfos)}


Please provide a revised version of my draft that maintains the intended message but enhances the tone, clarity, and formality appropriate for a business setting.`,
          assistant
        );
      } else {
        response = await translator.translate(
          `
I have received an email: 

           ${mailToReplyTo.body} \n \n \n \n

           your reply should be ${responseLength},   ${replyLengthText} maximum .\n \n

I provide you with all of the mail conversation: \n
 ${JSON.stringify(mailInfos)} \n \n \n \n




[ SENDER INFORMATIONS ]: ${JSON.stringify(mailInfos.from.emailAdress)} \n \n
`,
          assistant
        );
      }
      context.log("response typechat", response);
    } catch (error) {
      context.log("response typechat error");
      context.log({ error });
      return reject(error);
    }
    if (!response.success) {
      context.log(response);
      return reject(response);
    }
    context.log({ response });
    const summarizedMail = response.data;
    context.log(JSON.stringify(summarizedMail, undefined, 2));
    context.log("resolve");
    resolve(response);
  });
};

const quickReplyAssistant = {
  role: "system",
  content: `Act as an expert mails writer. 
      You should understand a mail conversation. and reply in form of a professional mail with corporate jargon to the  mail of sender that I'll provide you .
      Please provide a revised version of my draft that maintains the intended message but enhances the tone, clarity, and formality appropriate for a business setting.
      `,
};
const replyWithdraftAssistant = {
  role: "system",
  content: `Act as an expert mails writer .
   You should reword the drafted text that I will provide you in a more professional style and using corporate jargon.
   You will be provided also with the mail conversation context that will help you to reword the drafted reply.
   .
   `,
};
