// the following schema is to clean mail exchanges to a separate conversations instead of every mail object containing the whole conversation
export interface MailExchangeCleaning {
  //the cleaned mail exchange
  MailCleaningResult: MailExchangeCleanedInterface | UnknownText;
}
export interface UnknownText {
  type: "unknown";
  text: string; // The text that wasn't understood
}
export interface MailExchangeCleanedInterface {
  type: "mailExchangeCleaning";
  // The cleaned mail exchange to object array
  mailExchangesCleanedObjectArray: Mail[];
}

interface Mail {
  sentDateTime: string;
  subject: string;
  importance: string;
  body: {
    contentType: string;
    //content without the past conversation
    content: string;
  };
  sender: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  toRecipients: {
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
  ccRecipients: {
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
  bccRecipients: {
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
  replyTo: {
    emailAddress: {
      name: string;
      address: string;
    };
  }[];
}
