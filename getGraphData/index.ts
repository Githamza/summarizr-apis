import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUserData } from "./msgraph-helper";
import { validateJwt } from "./ssoauth-helper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log(req.headers.authorization)
  //const value = await validateJwt(req, context.res,context);
  //context.log(value);
  context.log(req.headers.authorization)
  const userData = await getUserData(req, context.res,context);
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: userData,
  };

  context.done();

};

export default httpTrigger;
