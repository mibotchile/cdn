import { appConfig } from "../app-state/config";

export const getPrediction = async (data) =>
  await fetch(`${appConfig.gpt_url}${appConfig.projectPath}chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());


export const sendMessage = async (data) =>
  await fetch(`${appConfig.gpt_url}${appConfig.projectPath}messages/send`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
