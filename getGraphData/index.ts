import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUserData } from "./msgraph-helper";
import { validateJwt } from "./ssoauth-helper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    // const value = await validateJwt(req, context.res,context);
    context.log("graph data");
    const userData = await getUserData(req, context.res, context);
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: userData,
    };
    context.done();
  } catch (error) {
    context.log(error.message);
    context.res = {
      status: 500,
      body: "message:" + error,
    };
  }
};

export default httpTrigger;
