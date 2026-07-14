import { onRequestOptions as __api_chat_ts_onRequestOptions } from "C:\\Users\\Weichen Li\\AppData\\Roaming\\TRAE SOLO CN\\ModularData\\ai-agent\\work-mode-projects\\6a4cab20cd2c966c4e086e51\\last-tavern\\functions\\api\\chat.ts"
import { onRequestPost as __api_chat_ts_onRequestPost } from "C:\\Users\\Weichen Li\\AppData\\Roaming\\TRAE SOLO CN\\ModularData\\ai-agent\\work-mode-projects\\6a4cab20cd2c966c4e086e51\\last-tavern\\functions\\api\\chat.ts"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_chat_ts_onRequestOptions],
    },
  {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_ts_onRequestPost],
    },
  ]