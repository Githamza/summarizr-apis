import { createLanguageModel, createJsonTranslator, processRequests, Success } from "typechat";
import fs from "fs";
import path from "path";
import { SummarizedMail, SummarizedMailItems } from "./summarizeSchemaModel";

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "/SummarizeSchemaModel.ts"), "utf8");
const translator = createJsonTranslator<SummarizedMail>(model, schema, "SummarizedMail");
export const  getSummary = async (mails:string):Promise<Success<SummarizedMail>> =>{
return new Promise(async (resolve,reject)=> {
    let response;
    try {
         response= await  translator.translate(mails);
        
    } catch (error) {
        return reject(error);
        
    }
       if (!response.success) {
           console.log(response);
           return reject(response);
    }
    const summarizedMail = response.data;
    console.log(JSON.stringify(summarizedMail,undefined, 2));
    resolve(response)


    
})
}