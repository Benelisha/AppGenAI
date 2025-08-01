import OpenAI from "openai";
import { GPTMessage } from "./types";

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export class GptUtils {
  static create_gpt_code_change = async (
    files: Record<string, string>,
    // prompt: string,
    history: GPTMessage[]
  ): Promise<any> => {
    const response = await GptUtils.function_call(
      "update_mini_app",
      "Based on the user's request, update the mini-app code. (Always keep in mind the SystemPrompt/FirstPrompt" + "\n" +
      JSON.stringify({
       files,
      }),
      {
        files: {
          type: "array",
          description: "the map of the js files in the mini-app: each string of the content of the js file",
          items: {
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "the path to save the js file into the mini-app folder",
              },
              content: {
                type: "string",
                description: "the js content, which is the code of the mini-app",
              },
            },
            required: ["path", "content"],
          },
        },
      },
      // Required
      [
        "files",
      ],
      // Messages
      [
        ...history,
      ]
    );
    const args = JSON.parse(
      response.choices[0].message.function_call.arguments
    );
    return args;
  };

  static function_call = async (
    name: string,
    description: string,
    properties: any,
    required: string[],
    messages: GPTMessage[]
  ) => {
    const body = {
      model: "gpt-4o",
      messages: messages,
      function_call: {
        name, // "create_product",
        arguments: {},
      },
      functions: [
        {
          name,
          description,
          parameters: {
            type: "object",
            properties,
            required,
          },
        },
      ],
    };
    const response = await openai.chat.completions.create(body);
    return response;
  };
}
