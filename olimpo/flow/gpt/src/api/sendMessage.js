import { appConfig } from "../app-state/config";

export const sendMessage = async (data) =>
  await fetch(
    `${appConfig.gpt_url}/v1/internal-prediction/${appConfig.chatflowID}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
