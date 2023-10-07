import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { SummarizedMail } from "./summarizeSchemaModel";
import { ImprovedReplyResponse } from "./improveReplySchemaModel";
import { Context } from "@azure/functions";
import { ProposeReplyFromConversationHistory } from "./quickReplyModel";

const model = createLanguageModel(process.env);
export const getSummary = async (
  mails: string,
  action: string,
  context: Context,
  replyText?: boolean
): Promise<Success<SummarizedMail>> => {
  context.log("enter in get typechat");
  context.log({ action });

  let schema;
  try {
    if (action === "SUM_MAIL") {
      schema = fs.readFileSync(
        path.join(__dirname, "/SummarizeSchemaModel.ts"),
        "utf8"
      );
    } else {
      if (replyText) {
        schema = fs.readFileSync(
          path.join(__dirname, "/improveReplySchemaModel.ts"),
          "utf8"
        );
      } else {
        schema = fs.readFileSync(
          path.join(__dirname, "/quickReplyModel.ts"),
          "utf8"
        );
      }
    }
  } catch (error) {
    context.log("fileread", { error });
  }
  let translator;
  if (action === "SUM_MAIL") {
    context.log("summariz");
    translator = createJsonTranslator<SummarizedMail>(
      model,
      schema,
      "SummarizedMail"
    );
  } else {
    if (replyText) {
      context.log("improve");
      translator = createJsonTranslator<ImprovedReplyResponse>(
        model,
        schema,
        "ImprovedReplyResponse"
      );
    } else {
      context.log("improve");
      translator = createJsonTranslator<ProposeReplyFromConversationHistory>(
        model,
        schema,
        "ProposeReplyFromConversationHistory"
      );
    }
  }
  context.log("typechat");
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      response = await translator.translate(`${mails}`);
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
