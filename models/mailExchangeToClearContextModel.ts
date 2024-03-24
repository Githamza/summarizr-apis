// the following schema is transform a json object of mail conversation to a conext text summarize of the mail conversation

export interface MailDetailedSummaryResponse {
  //the detailed summary of the json formated mail conversation
  summary: MailDetailedSummary | UnknownText;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}
export interface MailDetailedSummary {
  type: "mailDetailedSummary";
  // conversation summary text
  summaryText: string;
}
