// the following schema is for asking the user a series of questions to know what user would reply to a mail
export interface QuestionsListToReplyToMail {
  QuestionsList: Question[] | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}
export interface Question {
  // The question to ask the user to answer
  question: string;
  // The question type, default is text, prefered to be radio or checkbox if possible
  answerType: "text" | "number" | "date" | "radio" | "checkbox";
  // The question options if the question type is radio or checkbox otherwwise set to null
  answerOptions: string[] | null;
  //the id reference of the question in the html form
  formHtmlRef: string;
}
