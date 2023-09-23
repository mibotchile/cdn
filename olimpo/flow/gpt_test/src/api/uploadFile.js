import { appConfig } from "../app-state/config";

export const uploadFile = async (data) =>
  await fetch(`${appConfig.storage_url}/storage/upload`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
