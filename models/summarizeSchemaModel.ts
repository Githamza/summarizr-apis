//the folowing is a schema to summarize an outlook mail to a paragraph summary to a specific language , to three bullet point summary, and other insights

export interface SummarizedMailItems {
  type: "SummarizedMailItems";

  // mail summary in 300 word maximum
  summaryShortParagraph: string;

  // mail summary in 3 to 5 maximum short text bullet points
  summaryBulletpoints: string[];

  // mail subject in a sentence
  subjectTitle: string;

  // judging sentiment of the mail in one word
  sentiment: "positif 😀" | "negative 😥" | "neutral 😐";

  // mail sender
  sender: string | null;

  // deadline of the mail if exists otherwise return null
  deadline: string | null;

  // mail importance, default low.
  importance: "high" | "medium" | "low";

  //Actions that the receiver should take take about the email content. between 1 and 5  short actions, if you think there is no actions to take then null
  actionsToTake: string[] | null;
}

export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}

export interface SummarizedMail {
  type: "SummarizedMail";
  //mail summary Object
  summary: SummarizedMailItems | UnknownText;
}
