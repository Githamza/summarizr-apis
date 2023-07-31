import { Context } from "@azure/functions";

export const errorHandler = (error, context: Context) => {
  context.res = {
    status: 500,
    body: {
      message: error.message | error.data | error,
    },
  };
};
