import { appConfig } from "../app-state/config";

export const getPrediction = async (data) =>
  await fetch(`${appConfig.gpt_url}/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const sendMessageApi = async (data) =>
  await fetch(`${appConfig.gpt_url}/messages/send`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
