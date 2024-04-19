import { MailHistory } from "../models/mailGraphApiModel";

// keep only important object properties for ai summarization
export const cleanMailHistoryObject = (
  mailHistoryObject: MailHistory[]
): Pick<
  MailHistory,
  "sentDateTime" | "from" | "subject" | "replyTo" | "body" | "toRecipients"
>[] => {
  return mailHistoryObject.map((mail) => {
    return {
      sentDateTime: mail.sentDateTime,
      from: mail.from,
      subject: mail.subject,
      body: mail.body,
      replyTo: mail.replyTo,
      toRecipients: mail.toRecipients,
    };
  });
};
