import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { odata, TableClient } from "@azure/data-tables";


const tableClient = TableClient.fromConnectionString(
  process.env.AzureWebJobsStorage || "",
  "credits"
);
const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    switch (req.method) {
      case "GET":
        const data = {
          partitionKey: req.query.tenantId,
          rowKey: req.query.userId,
        };
        let userCredit;
        try {
          userCredit = await tableClient.getEntity(
            data.partitionKey,
            data.rowKey
          );
        } catch (error) {
          error.statusCode === 404 ? (userCredit = null) : null;
        }

        if (!userCredit) {
          const res = await tableClient.createEntity({ ...data, credits: 5 });
          context.res.body = {...res,isFirstTime:true};
        } else {
          context.res.body = {...userCredit,isFirstTime:false};
        }

        context.done();
        break;
      case "POST":
        const bodyData = {
          partitionKey: req.body.tenantId,
          rowKey: req.body.userId,
        };
        const entity = await tableClient.getEntity(
          bodyData.partitionKey,
          bodyData.rowKey
        );
        const newCredits =
          entity.credits as number > 0 ? (entity.credits as number) - 1 : 0;
        await tableClient.upsertEntity({ ...bodyData, credits: newCredits });
        context.res.body = {
          ...bodyData,
          credits: newCredits,
        };
        context.done();
        break;
    }
  } catch (error) {
    context.log(error);
  }
};

export default httpTrigger;
