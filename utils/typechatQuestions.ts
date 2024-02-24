import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { Context } from "@azure/functions";
import { QuestionsListToReplyToMail } from "../models/questionsToanswerModel";

const model = createLanguageModel(process.env);
export const getQuestions = async (
  mails: string,
  context: Context
): Promise<Success<QuestionsListToReplyToMail>> => {
  let schema;
  try {
    schema = fs.readFileSync(
      path.join(__dirname, "/../models/questionsToanswerModel.ts"),
      "utf8"
    );
  } catch (error) {
    context.log("fileread", { error });
  }
  let translator;
  context.log("summariz");
  translator = createJsonTranslator<QuestionsListToReplyToMail>(
    model,
    schema,
    "QuestionsListToReplyToMail"
  );
  context.log("typechat");
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      response = await translator.translate(`${mails}`, {
        role: "system",
        content:
          " act like  an expert in mails writing and summarizing with 10 years of experience.",
      });
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
