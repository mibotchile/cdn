export class AppConfig {
  botHost = "endpoint-prod-chatgpt.mibot.cl:8080";
  ssl = true;
  // gpt_url = "https://endpoint-prod-chatgpt.mibot.cl:8080";
  storage_url = "https://helpers.mibot.cl:444";
  messageHistoryId = "";
  chatflowID = "";
  welcomeMessage = "¡Hola! ¿En qué puedo ayudarte hoy?";
  chathubChannelId = "";
  projectPath = "/";
  showThoughts = true;
  callbacks = {};
}

export const appConfig = new AppConfig();
