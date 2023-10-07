// act like  a helpfull ai writing assistant, act like an expert in mails writing with 10 years of experience, use the conversation history to propose a professional reply well elaborated in the same language of the exchange history
// this is schema for writing efficent professional replies based on mail history exchange.
export interface ProposeReplyFromConversationHistory {
  // the language of the improved reply
  replyLanguage: string;
  // the improved reply Object
  ImprovedReply: ReplyFromConversationHistory | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface ReplyFromConversationHistory {
  type: "QuickReply";
  //the improved professional reply inspired from conversation history
  reply: string;
}
