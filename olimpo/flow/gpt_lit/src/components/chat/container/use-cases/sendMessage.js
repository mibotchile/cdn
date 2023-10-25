import { appSetupConfig } from "../../../../app-config/setup";
import {
  sendMessageApi,
  getPrediction,
} from "../../../../../../gpt_test/src/api/sendMessage";

export const sendMessage = async ({ message, files, record, chattingWith }) => {
  const payload = {
    channel_id: appSetupConfig.chathubChannelId,
    message: message,
    url: (files || []).map(({ url }) => url),
    unique_id: appSetupConfig.messageHistoryId,
  };

  const results = [];
  if (chattingWith === "human_agent") {
    return await sendMessageApi({
      content: `${payload.message}\n${payload.url}`,
      conversation_id: appSetupConfig.messageHistoryId,
      channel_id: appSetupConfig.chathubChannelId,
      sender: "user",
    });
  }
  if (payload.url.length) {
    for (const url of payload.url) {
      const apiMessage = await getPrediction({
        ...payload,
        message: `envio comprobante de pago, esta es la url "${url}"`,
      }).catch((err) => console.log(err));
      results.push({ content: apiMessage.response, type: "apiMessage" });
      if (apiMessage?.unique_id) {
        appSetupConfig.messageHistoryId = apiMessage.unique_id;
        // initMessagesWebsocket(appSetupConfig.messageHistoryId);
      }
    }

    return results;
  } else
    await getPrediction(payload)
      .then((apiMessage) => {
        if (apiMessage?.unique_id) {
          appSetupConfig.messageHistoryId = apiMessage.unique_id;
          //   this.initMessagesWebsocket(appSetupConfig.messageHistoryId);
        }
        results.push({ ...apiMessage, content: apiMessage.response });
      })
      .catch((err) => console.log(err));
  return results;
};
