export enum responseTypesEnum {
  SHORT = "short",
  DETAILED = "detailed",
  MEDIUM = "medium",
}

export const responseTextLength = {
  [responseTypesEnum.SHORT]: {
    replyLength: "from 25 to 50 word",
  },
  [responseTypesEnum.MEDIUM]: {
    replyLength: "from 50 to 150 word",
  },
  [responseTypesEnum.DETAILED]: {
    replyLength: "from 150 to 500 word",
  },
};
