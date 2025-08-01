export interface GPTMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
