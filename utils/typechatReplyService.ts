import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { RewordedDraftTextResponse } from "../models/improveReplySchemaModel";
import { Context } from "@azure/functions";
import { ProposeReplyFromConversationHistory } from "../models/quickReplyModel";
import { responseTextLength } from "../models/replyType.model";

const model = createLanguageModel(process.env);
export const getReply = async (
  mails: string,
  context: Context,
  replyObject: any,
  responseLength: string,
  replyText?: boolean
): Promise<Success<RewordedDraftTextResponse>> => {
  let schema;
  try {
    if (replyText) {
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
  if (replyText) {
    context.log("improve");
    translator = createJsonTranslator<RewordedDraftTextResponse>(
      model,
      schema,
      "RewordedDraftTextResponse"
    );
    const chatArray = [replyWithdraftAssistant];
    response = await superTranslate(
      translator,
      chatArray,
      context,
      mails,
      responseLength,
      replyText,
      replyObject
    );
  } else {
    const chatArray = [quickReplyAssistant];
    context.log("improve");
    translator = createJsonTranslator<ProposeReplyFromConversationHistory>(
      model,
      schema,
      "ProposeReplyFromConversationHistory"
    );
    response = await superTranslate(
      translator,
      chatArray,
      context,
      mails,
      responseLength,
      replyText,
      replyObject
    );
  }
  return response;
};

const superTranslate = (
  translator: any,
  assistant: any,
  context: Context,
  mails: string,
  responseLength: string,
  replyText?: boolean,
  replyObject?: any
) => {
  const replyLengthText =
    responseTextLength[responseLength.toLocaleLowerCase()].replyLength;
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      if (replyText) {
        response = await translator.translate(
          `I have drafted a reply to an email conversation, but I need help refining it to sound more professional and incorporate appropriate corporate jargon. Here is my draft reply:

"DRAFT: ${replyObject.draftReply}"

Based on the context of the email conversation below, please help me revise my draft to create a polished and professional response.


The reply should be  ${replyLengthText} .


Email Conversation Context: ${JSON.stringify(
            replyObject.cleanedMailExchangeText
          )}

Please provide a revised version of my draft that maintains the intended message but enhances the tone, clarity, and formality appropriate for a business setting.`,
          assistant
        );
      } else {
        response = await translator.translate(
          `
Based on the context of the email conversation below, please help me write a polished and professional response.


The reply should be  ${replyLengthText} .


Email Conversation Context: ${JSON.stringify(mails)}
`
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
      You should understand a mail conversation. and reply to the last mail sender in form of a professional mail with corporate jargon.
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
