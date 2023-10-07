// act like  a helpfull ai writing assistant, act like an expert in mails writing with 10 years of experience, I wrote a drafted reply, help me to rewrite it in a more professional business tone with use of corporate jargon. You fond also the conversation history
// this is schema for writing efficent professional replies based on mail history exchange.

export interface ImprovedReplyResponse {
  // the language of the improved reply
  replyLanguage: string;
  // the improved reply Object
  ImprovedReply: ImprovedReplyObject | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface ImprovedReplyObject {
  type: "ImprovedReply";
  //The improved reply re writed in a professional style
  reply: string;
}
