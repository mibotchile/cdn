import { appConfig } from "../app-state/config";

export const getPrediction = async (data) => {
  const botUrl = `${appConfig.ssl ? "https" : "http"}://${appConfig.botHost}`;
  const res = await fetch(`${botUrl}${appConfig.projectPath}chat`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  return res.json();
};

export const sendMessage = async (data) => {
  const botUrl = `${appConfig.ssl ? "https" : "http"}://${appConfig.botHost}`;

  const res = await fetch(`${botUrl}/messages/send`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};
