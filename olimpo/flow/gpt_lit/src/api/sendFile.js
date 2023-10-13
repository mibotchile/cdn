import { endpointsSocketConfig } from "../app-config/endpoints-socket";

export const sendComprobante = async (data) =>
  await fetch(
    `${endpointsSocketConfig.storage_url}/mail/send/tarjetaoh/comprobantepago`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  ).then((res) => res.json());
