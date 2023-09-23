import { appConfig } from "../app-state/config";

export const sendComprobante = async (data) =>
  await fetch(`${appConfig.storage_url}/mail/send/tarjetaoh/comprobantepago`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  }).then((res) => res.json());
