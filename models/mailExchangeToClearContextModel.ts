// the following schema is transform a json object of mail conversation to a text summary

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
  summaryText: string;
}
