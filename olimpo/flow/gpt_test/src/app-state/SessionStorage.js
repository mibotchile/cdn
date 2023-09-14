export class SessionStorage {
  static messageHistoryId = {
    get: () => sessionStorage.getItem("onbotgo-messageHistory-id"),
    set: (id) => sessionStorage.setItem("onbotgo-messageHistory-id", id),
    remove: () => sessionStorage.removeItem("onbotgo-messageHistory-id"),
  };
  static messagesHistory = {
    get: () =>
      JSON.parse(sessionStorage.getItem("onbotgo-messageHistory") ?? "[]"),
    add: (messages) => {
      const prev = JSON.parse(
        sessionStorage.getItem("onbotgo-messageHistory") ?? "[]"
      );
      sessionStorage.setItem(
        "onbotgo-messageHistory",
        JSON.stringify([...prev, ...messages])
      );
    },
    remove: () => sessionStorage.removeItem("onbotgo-messageHistory"),
  };
}
