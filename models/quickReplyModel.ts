// this is schema for writing efficent professional replies based on mail  conversation.

export interface replySuggestionResponse {
  mailReply: replySuggestion | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface replySuggestion {
  type: "reply";
  //the reply suggestion text
  mailReply: string;
}
