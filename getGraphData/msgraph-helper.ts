// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license in the root of the repo.
/*
    This file provides the provides functionality to get Microsoft Graph data.
*/
import * as https from "https";
import { getAccessToken } from "./ssoauth-helper";
import * as createError from "http-errors";
import axios from "axios";
import { resolve } from "path";
import { rejects } from "assert";

/* global process */

const domain: string = "https://graph.microsoft.com";
const version: string = "v1.0";

class MyError extends Error {
  code?: number;
  bodyCode?: string;
  bodyMessage?: string;
}

export async function getUserData(req: any, res: any, context: any) {
  return new Promise(async (resolve, rejects) => {
    const authorization: string = req.headers.authorization;

    const graphTokenResponse = await getAccessToken(authorization, context);
    context.log(graphTokenResponse);
    try {
      if (
        graphTokenResponse &&
        (graphTokenResponse.claims || graphTokenResponse.error)
      ) {
        res.send(graphTokenResponse);
      } else {
        const graphToken: string = graphTokenResponse.access_token;
        context.log(graphToken);
        const graphUrlSegment: string =
          process.env.GRAPH_URL_SEGMENT || `/me/messages/`;
        const graphQueryParamSegment: string =
          process.env.QUERY_PARAM_SEGMENT ||
          `?$filter= conversationId eq '${req.query.conversationId}'`;
        context.log({ graphToken, graphUrlSegment, graphQueryParamSegment });

        const graphData = await getGraphData(
          graphToken,
          graphUrlSegment,
          graphQueryParamSegment
        );

        // If Microsoft Graph returns an error, such as invalid or expired token,
        // there will be a code property in the returned object set to a HTTP status (e.g. 401).
        // Relay it to the client. It will caught in the fail callback of `makeGraphApiCall`.
        if (graphData.code) {
          context.log("Microsoft Graph error " + JSON.stringify(graphData));
          createError(
            graphData.code,
            "Microsoft Graph error " + JSON.stringify(graphData)
          );
          rejects(graphData);
        } else {
          context.log("graphdata", graphData);
          resolve(graphData);
        }
      }
    } catch (err) {
      res.status(401).send(err.message);
      return;
    }
  });
}

export async function getGraphData(
  accessToken: string,
  apiUrl: string,
  queryParams?: string
): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    const options = {
      path: domain + "/" + version + apiUrl + queryParams,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + accessToken,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        Prefer: "outlook.body-content-type='text'",
      },
    };

    try {
      const response = await axios.get(options.path, {
        headers: options.headers,
      });
      if (response.status === 200) {
        const parsedBody = response.data;
        const formatedarr = transformToMailArray(parsedBody);
        resolve(formatedarr);
      } else {
        const error = new MyError();
        error.code = response.status;
        error.message = response.statusText;

        // The error body sometimes includes an empty space
        // before the first character, remove it or it causes an error.
        const body = response.data.trim();
        error.bodyCode = JSON.parse(body).error.code;
        error.bodyMessage = JSON.parse(body).error.message;
        resolve(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
function transformToMailArray(obj) {
  const mails = [];
  const messages = obj.value;
  messages.forEach((message) => {
    const mail = {
      subject: message.subject,
      body: message.body.content,
      receiver: message.toRecipients[0].emailAddress.address,
      sender: message.sender.emailAddress.address,
    };
    mails.push(mail);
  });
  return mails;
}
