import { endpointsSocketConfig } from "../app-config/endpoints-socket";
import { appConfig } from "../app-config/setup";

export const getPrediction = async (data) => {
  const botUrl = `${appConfig.ssl ? "https" : "http"}://${
    endpointsSocketConfig.botHost
  }`;

  return await fetch(`${botUrl}${appConfig.projectPath}chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const sendMessageApi = async (data) => {
  const botUrl = `${appConfig.ssl ? "https" : "http"}://${appConfig.botHost}`;

  return await fetch(`${botUrl}/messages/send`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
