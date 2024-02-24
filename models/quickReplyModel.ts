// this is schema for writing efficent professional mails based on mail  conversation.

export interface ProposeReplyFromConversationHistory {
  mailReply: ReplyFromConversationHistory | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface ReplyFromConversationHistory {
  type: "reply";
  //the  professional reply to  mail conversation
  generatedProfessionalMailReply: string;
}
