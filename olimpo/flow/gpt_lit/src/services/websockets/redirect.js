import { appConfig } from "../../app-config/setup";

export class redirectConversation {
  socket;
  constructor() {}
  init(conversationId) {
    if (this.socket && this.socket.OPEN) {
      console.log("WS MESSAGES IS CONNECTED ", this.socket);
      return;
    }
    const url = `wss://endpoint-prod-chatgpt.mibot.cl:8080${appConfig.projectPath}messages/${conversationId}/ws`;
    this.socket = new WebSocket(url);
    console.log(this.socket);

    this.socket.onopen = (event) => {
      console.log("SOCKET CONNECTED ", event);

      this.socket.send(JSON.stringify({ event: "connected", data: null }));
    };

    this.socket.onerror = (event) => {
      console.log("SOCKET ERRROR ", event);
    };

    this.socket.onclose = (event) => {
      console.log("SOCKET Disconnected", event);
    };
  }
  onIncomingMessage(callback) {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.event !== "incoming_message") return;
      const message = data.data;
      console.log(message);
      callback({
        content: message.content,
        role: message.role,
        type: "apiMessage",
      });
    };
  }
  sendMessage() {}
}
