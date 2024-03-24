export interface MailHistory {
  sentDateTime: string;
  subject: string;
  importance: string;
  body: Body;
  sender: Sender;
  from: From;
  toRecipients: ToRecipient[];
  ccRecipients: any[];
  bccRecipients: any[];
  replyTo: any[];
}

export interface Body {
  contentType: string;
  content: string;
}

export interface Sender {
  emailAddress: EmailAddress;
}

export interface EmailAddress {
  name: string;
  address: string;
}

export interface From {
  emailAddress: EmailAddress2;
}

export interface EmailAddress2 {
  name: string;
  address: string;
}

export interface ToRecipient {
  emailAddress: EmailAddress3;
}

export interface EmailAddress3 {
  name: string;
  address: string;
}
