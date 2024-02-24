// this is schema for paraphrasing actual draft reply in more professional style.

export interface RewordedDraftTextResponse {
  // the reworded draft reply Object
  rewordedReply: RewordedDraftText | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface RewordedDraftText {
  type: "RewordedDraftText";
  //The reworded draft reply
  rewordedDraftTextAsAprofessionalMailReply: string;
}
