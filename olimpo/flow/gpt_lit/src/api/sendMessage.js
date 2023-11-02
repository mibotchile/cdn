import { endpointsSocketConfig } from "../app-config/endpoints-socket";
import { appConfig } from "../app-config/setup";

export const getPrediction = async (data) =>
  await fetch(`${endpointsSocketConfig.gpt_url}${appConfig.projectPath}chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const sendMessageApi = async (data) =>
  await fetch(
    `${endpointsSocketConfig.gpt_url}${appConfig.projectPath}messages/send`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
