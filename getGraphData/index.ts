import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUserData } from "./msgraph-helper";
import { validateJwt } from "./ssoauth-helper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const value = await validateJwt(req, context.res);
  context.log(req.headers.authorization)
  const userData = await getUserData(req, context.res,context);
  console.log(value);
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: userData,
  };
};

export default httpTrigger;
