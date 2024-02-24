import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { ISubscriptions } from "../models/subscriptionsModel";
import axios from "axios";
import { getAccessToken } from "../getGraphData/ssoauth-helper";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  // todo : fetch me/userUsages ms graph api

  const haveLicence = await checkLicense(req.headers.authorization, context);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: haveLicence,
  };
};
const checkLicense = async (token: string, context: Context) => {
  try {
    const access_Token = (await getAccessToken(token, context)).access_token;

    const usageRights: ISubscriptions = (
      await axios.get(
        process.env.GRAPH_URL_BASE_BETA + "/me/" + "usageRights",
        {
          headers: {
            Authorization: `Bearer ${access_Token}`,
          },
        }
      )
    ).data;
    const isLicensed =
      usageRights.value[0] &&
      usageRights.value[0]?.serviceIdentifier === process.env.serviceIdentifier;
    return !!isLicensed;
  } catch (error) {
    throw error;
    // setError({ message: error.message });
    // setTimeout(() => setError({}), 4000);
  }
};
export default httpTrigger;
