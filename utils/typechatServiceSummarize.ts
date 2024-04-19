import { createLanguageModel, createJsonTranslator, Success } from "typechat";
import fs from "fs";
import path from "path";
import { Context } from "@azure/functions";
import { SummarizedMail } from "../models/summarizeSchemaModel";
import { createTypeScriptJsonValidator } from "typechat/ts";

const model = createLanguageModel(process.env);
export const getSummary = async (
  language: string,
  mails: string,
  context: Context
): Promise<Success<SummarizedMail>> => {
  let schema;
  try {
    schema = fs.readFileSync(
      path.join(__dirname, "/../models/summarizeSchemaModel.ts"),
      "utf8"
    );
  } catch (error) {
    context.log("fileread", { error });
  }
  let translator;
  const validator = createTypeScriptJsonValidator<SummarizedMail>(
    schema,
    "SummarizedMail"
  );

  translator = createJsonTranslator<SummarizedMail>(model, validator);
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      response = await translator.translate(JSON.stringify(mails), [
        {
          role: "system",
          content: `Act as an expert in text summarizing.
            Yoy should summarize the email conversation in : ${language.toUpperCase()} 
            `,
        },
      ]);
    } catch (error) {
      context.log("response typechat error");
      context.log({ error });
      return reject(error);
    }
    if (!response.success) {
      context.log(response);
      return reject(response);
    }
    if ((response.data as SummarizedMail).summary.type === "unknown") {
      return reject(response);
    }
    const summarizedMail = response.data;
    context.log(JSON.stringify(summarizedMail, undefined, 2));
    context.log("resolve");
    resolve(response);
  });
};
