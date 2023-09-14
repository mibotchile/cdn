import { appConfig } from "../app-state/config";

export const sendMessage = async (data) =>
  await fetch(`${appConfig.gpt_url}/chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
