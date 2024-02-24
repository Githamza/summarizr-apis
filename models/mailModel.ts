interface MailModel {
  "@odata.etag": string;
  id: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  changeKey: string;
  categories: string[];
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  subject: string;
  bodyPreview: string;
  importance: string;
  parentFolderId: string;
  conversationId: string;
  conversationIndex: string;
  isDeliveryReceiptRequested: boolean | null;
  isReadReceiptRequested: boolean;
  isRead: boolean;
  isDraft: boolean;
  webLink: string;
  inferenceClassification: string;
  body: {
    contentType: string;
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
  flag: {
    flagStatus: string;
  };
}

// {
//   "@odata.etag": "W/\"CQAAABYAAABZzHVcgsHdQJg0pEoI+fk8AAJRiuvT\"",
//   id: "AAMkAGRmM2ZmOWE5LWM2MmQtNDI1ZC05NjA3LWQzZjczYjcyMjYwYQBGAAAAAACh72odMbOOTafhgysJ9Fa4BwBZzHVcgsHdQJg0pEoI_fk8AAAAAAEJAABZzHVcgsHdQJg0pEoI_fk8AAJSbWA6AAA=",
//   createdDateTime: "2023-11-17T19:14:12Z",
//   lastModifiedDateTime: "2023-11-17T19:41:31Z",
//   changeKey: "CQAAABYAAABZzHVcgsHdQJg0pEoI+fk8AAJRiuvT",
//   categories: [
//   ],
//   receivedDateTime: "2023-11-17T19:41:29Z",
//   sentDateTime: "2023-11-17T19:41:19Z",
//   hasAttachments: false,
//   internetMessageId: "<MR2P264MB0611A13626E7EF4906303B3EFFB7A@MR2P264MB0611.FRAP264.PROD.OUTLOOK.COM>",
//   subject: "Issue when purchasing a subscription of my add-in  ",
//   bodyPreview: "Hi Oscar ,\r\n\r\nI was trying to buy a subscription of my outlook add-in in the AppSource marketplace\r\n\r\n\r\nWhen I click on Configure my saas offer I get this:\r\n\r\n\r\n\r\nWhen I check the application Id , I see that it's the fulfillment app in azure portal.\r\n\r\nI ",
//   importance: "normal",
//   parentFolderId: "AAMkAGRmM2ZmOWE5LWM2MmQtNDI1ZC05NjA3LWQzZjczYjcyMjYwYQAuAAAAAACh72odMbOOTafhgysJ9Fa4AQBZzHVcgsHdQJg0pEoI_fk8AAAAAAEJAAA=",
//   conversationId: "AAQkAGRmM2ZmOWE5LWM2MmQtNDI1ZC05NjA3LWQzZjczYjcyMjYwYQAQAG9XV-bSJmRFpTClshn5AWY=",
//   conversationIndex: "AQHaGYo/b1dX9tImZEWlMKWyGfkBZg==",
//   isDeliveryReceiptRequested: false,
//   isReadReceiptRequested: false,
//   isRead: true,
//   isDraft: false,
//   webLink: "https://outlook.office365.com/owa/?ItemID=AAMkAGRmM2ZmOWE5LWM2MmQtNDI1ZC05NjA3LWQzZjczYjcyMjYwYQBGAAAAAACh72odMbOOTafhgysJ9Fa4BwBZzHVcgsHdQJg0pEoI%2Bfk8AAAAAAEJAABZzHVcgsHdQJg0pEoI%2Bfk8AAJSbWA6AAA%3D&exvsurl=1&viewmodel=ReadMessageItem",
//   inferenceClassification: "focused",
//   body: {
//     contentType: "text",
//     content: "Hi Oscar ,\r\n\r\nI was trying to buy a subscription of my outlook add-in in the AppSource marketplace\r\n\r\n[cid:d8c9e46b-5ee7-4017-b0dc-b28d5e1617cf]\r\n\r\nWhen I click on Configure my saas offer I get this:\r\n\r\n[cid:e3b7ca32-68ac-417f-94a4-1734aac855b0]\r\n\r\n\r\nWhen I check the application Id , I see that it's the fulfillment app in azure portal.\r\n\r\n[cid:9557429c-8441-4555-8efa-0fe6adf56d03]\r\nI have created this using the saas accelerator\r\n\r\n[cid:45aa1e71-80eb-4c65-847f-bdac0d4f569c]\r\n\r\nFor information I have not done the optional steps here, because I suppose that they will be created automatically.\r\n\r\n[cid:d92db6b1-4f3a-407e-9cb7-8ab9b34b0e4d]\r\n\r\nDo you have an Idea Why I get this issue ?\r\n\r\nThanks\r\n\r\nHamza Haddad\r\nFullstack Web Developer\r\nMicrosoft 365 Developer\r\nhmz-digital.fr<https://www.hmz-digital.fr>\r\n",
//   },
//   sender: {
//     emailAddress: {
//       name: "Hamza Haddad",
//       address: "hhamza@hmz-digital.fr",
//     },
//   },
//   from: {
//     emailAddress: {
//       name: "Hamza Haddad",
//       address: "hhamza@hmz-digital.fr",
//     },
//   },
//   toRecipients: [
//     {
//       emailAddress: {
//         name: "Oscar Gonzalez Fernandez (International Supplier)",
//         address: "v-osfer@microsoft.com",
//       },
//     },
//   ],
//   ccRecipients: [
//     {
//       emailAddress: {
//         name: "Valerie  Maria Lucie Mathias (International Supplier)",
//         address: "v-vmathias@microsoft.com",
//       },
//     },
//   ],
//   bccRecipients: [
//   ],
//   replyTo: [
//   ],
//   flag: {
//     flagStatus: "notFlagged",
//   },
// }
