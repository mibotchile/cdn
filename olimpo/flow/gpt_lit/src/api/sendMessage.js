import { endpointsSocketConfig } from "../app-config/endpoints-socket";

export const getPrediction = async (data) =>
  await fetch(`${endpointsSocketConfig.gpt_url}/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const sendMessage = async (data) =>
  await fetch(`${appConfig.gpt_url}/messages/send`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
