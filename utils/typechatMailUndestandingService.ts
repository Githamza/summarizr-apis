import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { Context } from "@azure/functions";
import { MailDetailedSummaryResponse } from "../models/mailExchangeToClearContextModel";
import { createTypeScriptJsonValidator } from "typechat/ts";

const model = createLanguageModel(process.env);
export const getDetailedMailSummary = async (
  mails: string,
  context: Context
): Promise<Success<MailDetailedSummaryResponse>> => {
  let schema;
  try {
    schema = fs.readFileSync(
      path.join(__dirname, "/../models/mailExchangeToClearContextModel.ts"),
      "utf8"
    );
  } catch (error) {
    context.log("fileread", { error });
  }
  let translator;
  context.log("summariz");
  const validator = createTypeScriptJsonValidator<MailDetailedSummaryResponse>(
    schema,
    "MailDetailedSummaryResponse"
  );
  translator = createJsonTranslator<MailDetailedSummaryResponse>(
    model,
    validator
  );
  context.log("typechat");
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      response = await translator.translate(
        `[THE MAIL CONVERSATION CONTEXT TEXT]: ${mails}`,
        [
          {
            role: "system",
            content: `act like  an expert in mails understanding. I will provide you with a raw text that contains the whole mail exchange. \n 
          You have to understand the exchange beacause later I'll provide you with that understanding resume output and  ask you to provide me with a professional reply.
          Focus on what is important to make a efficient reply to the conversation. \n
          The Receipient of the mail is the person who will reply to the mail. which is me  \n
          your output show be detailed enough so that when I provide you with the mail content you can ask me questions about the mail content to get what I would reply to the mail.`,
          },
        ]
      );
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
