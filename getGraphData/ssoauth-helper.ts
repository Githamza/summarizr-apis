/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license in root of repo. -->
 *
 * This file defines the routes within the authRoute router.
 */

import fetch from "node-fetch";
import form from "form-urlencoded";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import axios from "axios";
/* global process, console */

const DISCOVERY_KEYS_ENDPOINT =
  "https://login.microsoftonline.com/common/discovery/v2.0/keys";

export async function getAccessToken(authorization: string,context:any): Promise<any> {
  if (!authorization) {
    let error = new Error("No Authorization header was found.");
    return Promise.reject(error);
  } else {
    const scopeName: string = process.env.SCOPE || "User.Read";
    const [, /* schema */ assertion] = authorization.split(" ");

    const tokenScopes = (jwt.decode(assertion) as jwt.JwtPayload).scp.split(
      " "
    );
    const accessAsUserScope = tokenScopes.find(
      (scope) => scope === "access_as_user"
    );
    if (!accessAsUserScope) {
      throw new Error("Missing access_as_user");
    }

    const formParams = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: assertion,
      requested_token_use: "on_behalf_of",
      scope: [scopeName].join(" "),
    };

    const stsDomain: string = "https://login.microsoftonline.com";
    const tenant: string = "common";
    const tokenURLSegment: string = "oauth2/v2.0/token";
    const encodedForm = form(formParams);
    let tokenResponse;
    try {
      tokenResponse = await axios.post(
        `${stsDomain}/${tenant}/${tokenURLSegment}`,
        encodedForm,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    return tokenResponse.data;
  }
}

export function validateJwt(req, res,context): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const validationOptions = {
        audience: `${process.env.CLIENT_ID}`,
      };

      const verif = jwt.verify(
        token,
        getSigningKeys,
        validationOptions,
        (err) => {
          if (err) {
            context.log(err);
            reject(res.send({status:403,body:err.message}));
            //return res.sendStatus(403);
          }

          resolve(true);
        }
      );
      return verif;
    }
  });
}

function getSigningKeys(header: any, callback: any) {
  var client: JwksClient = new JwksClient({
    jwksUri: DISCOVERY_KEYS_ENDPOINT,
  });

  client.getSigningKey(header.kid, function (err, key) {
    callback(null, key.getPublicKey());
  });
}
