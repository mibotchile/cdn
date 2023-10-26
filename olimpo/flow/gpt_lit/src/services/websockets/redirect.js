import { appSetupConfig } from "../../app-config/setup";

export class redirectConversation {
  socket;
  constructor() {}
  init(conversationId) {
    if (this.socket && this.socket.OPEN) {
      console.log("WS MESSAGES IS CONNECTED ", this.socket);
      return;
    }
    const url = `wss://endpoint-prod-chatgpt.mibot.cl:8080${appSetupConfig.projectPath}messages/${conversationId}/ws`;
    this.socket = new WebSocket(url);
    console.log(this.socket);

    this.messagesWebsocket.onopen = (event) => {
      console.log("SOCKET CONNECTED ", event);

      this.messagesWebsocket.send(
        JSON.stringify({ event: "connected", data: null })
      );
    };

    this.messagesWebsocket.onerror = (event) => {
      console.log("SOCKET ERRROR ", event);
    };

    this.messagesWebsocket.onclose = (event) => {
      console.log("SOCKET Disconnected", event);
    };
  }
  onIncomingMessage(callback) {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event !== "incoming_message") return;
      const message = data.data;
      callback(message);
    };
  }
  sendMessage() {}
}
