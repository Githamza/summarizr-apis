import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getAccessToken } from "../getGraphData/ssoauth-helper";
import axios from "axios";
import { ITodoTask } from "../models/todo.Model";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const authorization: string = req.headers.authorization;
  const taskName = req.body.taskName;
  const mailTitle = req.body.mailTitle;
  const graphTokenResponse = await getAccessToken(authorization, context);
  let graphTaskUrl: string =
    "https://graph.microsoft.com/v1.0//me/todo/lists/{todoTaskListId}/tasks";
  const graphTaskListUrl: string =
    "https://graph.microsoft.com/v1.0/me/todo/lists";
  let toDoTaskList: ITodoTask;
  let toDoTaskLists: ITodoTask[];
  let toDoTask: any;

  try {
    toDoTaskLists = (
      await axios.get(graphTaskListUrl, {
        headers: {
          Authorization: `Bearer ${graphTokenResponse.access_token}`,
        },
      })
    ).data.value;
    const summarizRTask = toDoTaskLists.find(
      (todoList) => todoList.displayName === "SummarizR Tasks"
    );
    if (summarizRTask) {
      try {
        graphTaskUrl = graphTaskUrl.replace(
          "{todoTaskListId}",
          summarizRTask.id
        );
        toDoTask = await axios.post(
          graphTaskUrl,
          {
            title: taskName,
          },
          {
            headers: {
              Authorization: `Bearer ${graphTokenResponse.access_token}`,
            },
          }
        );

        console.log(toDoTask);
        context.res = {
          // status: 200, /* Defaults to 200 */
          body: "",
        };
      } catch (error) {
        console.log(error);
      }
    } else {
      toDoTaskList = (
        await axios.post(
          graphTaskListUrl,
          {
            displayName: "SummarizR Tasks",
            id: "blabla",
          },
          {
            headers: {
              Authorization: `Bearer ${graphTokenResponse.access_token}`,
            },
          }
        )
      ).data;
      graphTaskUrl = graphTaskUrl.replace("{todoTaskListId}", toDoTaskList.id);
      toDoTask = await axios.post(
        graphTaskUrl,
        {
          title: taskName,
        },
        {
          headers: {
            Authorization: `Bearer ${graphTokenResponse.access_token}`,
          },
        }
      );
    }
  } catch (error) {
    console.log(error);
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: "",
  };
};

export default httpTrigger;
