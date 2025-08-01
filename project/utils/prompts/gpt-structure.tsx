export const GPT_MESSAGE_NEW_CHARACTER = {
  model: "gpt-4o",
  messages: [],
  functions: [
    {
      name: "create_character",
      description:"Create a new character name and gender.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Character's full name, appropriate to their nationality.",
          },
          gender: { 
            type: "string",
             description: "Character's gender."
          },
        },
        required: [
          "name",
          "gender",
        ],
      },
    },
  ],
  function_call: {
    name: "create_character",
    arguments: {},
  },
};
export const GPT_MESSAGE_ADVANCE_YEAR = {
  model: "gpt-4o",
  messages: [],
  functions: [
    {
      name: "advance",
      type: "function",
      description:
        "Create a new situation card or continue an existing short story arc (2-5 cards max). " +
        "Each card is written in second-person, humorous slice-of-life style. " +
        "If arc_step reaches 5—or is_arc_end is true—start a brand-new arc.",
      parameters: {
        type: "object",
        properties: {
          age: {
            type: "integer",
            description: "The character's age in years.",
          },
          arc_id: {
            type: "string",
            description:
              "Identifier for the current mini-arc (e.g. 'office_sockgate'). " +
              "Use 'none' for a brand-new standalone situation.",
          },
          arc_step: {
            type: "integer",
            description:
              "1-based index of this card inside its arc. " +
              "Must increment by 1 while arc_id stays the same.",
          },
          is_arc_end: {
            type: "boolean",
            description:
              "Set to true when this card ends the arc (twist, punchline, or resolution). " +
              "After an end card, the next response MUST start a new arc with arc_id = 'none'.",
          },
          situation: {
            type: "string",
            description:
              "Second-person scene (1-3 sentences). Keep it immersive, funny, grounded.",
          },
          time: {
            type: "string",
            description: "Iso formatted date time of the situation.",
          },
          choices: {
            type: "array",
            description:
              "2-3 distinct actions the player can take. Each should steer the story in a new direction.",
            items: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description:
                    "Short decision label (e.g. 'Drink it anyway'). keep it as short as possible.",
                },
                state_impacts: {
                  type: "object",
                  description:
                    "Numeric stat changes (from -25 up to +25)." +
                    "Omit any stat that isn't affected.",
                  properties: {
                    health: { type: "integer" },
                    happiness: { type: "integer" },
                    social: { type: "integer" },
                    karma: { type: "integer" },
                    wealth: { type: "integer" },
                  },
                },
              },
              required: ["text"],
            },
          },

          /* ——— GAME-OVER FLAG ——— */
          life_complete: {
            type: "boolean",
            description:
              "Set to true if the choice results in the player's death / end of life.",
          },
        },
        required: [
          "age",
          "arc_id",
          "arc_step",
          "is_arc_end",
          "situation",
          "choices",
          "life_complete",
          "time",
        ],
      },
    },
  ],
  // Let the model decide when to call the function
  function_call: { name: "advance" },
};
export const GPT_MESSAGE_RESOLVE_CHOICE = {
  model: "gpt-4o", // cheapest model with function-calling
  messages: [], // fill with your system + user turns
  functions: [
    {
      name: "resolve_choice",
      description:
        "Given a choice the player selected, return the short narrative outcome. If the choice leads to death, mark life_complete as true.",
      parameters: {
        type: "object",
        properties: {
          life_complete: {
            type: "string",
            description:
              "Given a choice the player selected, return the short narrative outcome. If the choice leads to death, mark as true.",
          },
          outcome: {
            type: "string",
            description:
              "A short paragraph describing what happened after the player made their choice. (e.g: You chose to try street sushi from an unlicensed vendor. You are now deeply intimate with the concept of food poisoning... and death.). No longer than 1-2 sentences.",
          },
        },
        required: ["life_complete", "outcome"],
      },
    },
  ],
  // Let the model decide when to call the function
  function_call: { name: "resolve_choice" },
};
export const GPT_FUNCS_TEMPLATE = {
  model: "gpt-4o", // cheapest model with function-calling
  messages: [], // fill with your system + user turns
  functions: [
    {
      name: "",
      description: "",
      parameters: {
        type: "object",
        properties: {
          life_complete: {
            type: "string",
            description: "Given a choice the player selected, return the short narrative outcome. If the choice leads to death, mark as true.",
            mandatory: true,
          },
          outcome: {
            type: "string",
            description: "A short paragraph describing what happened after the player made their choice. (e.g: You chose to try street sushi from an unlicensed vendor. You are now deeply intimate with the concept of food poisoning... and death.). No longer than 1-2 sentences.",
            mandatory: true,
          },
          bool_value: {
            type: "boolean",
            description: "Set to true if the choice results in the player's death / end of life.",
          },
        },
        required: [],
      },
    },
  ],
  // Let the model decide when to call the function
  function_call: { name: "resolve_choice" },
};



export const GPT_FUNC_NEW_PRODUCT = {
  model: "gpt-4o",
  messages: [],
  functions: [
    {
      name: "create_product",
      description:"Create a new product the player can sell. keep it wacky and funny.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "THe product name, appropriate to the game setting.",
          },
          description: { 
            type: "string",
             description: "The product details."
          },
          price: { 
            type: "number",
             description: "The Product cost in dollars."
          },
          category: { 
            type: "string",
             description: "Character's gender."
          },
          help: { 
            type: "string",
             description: "Details that might help the player to sell the product."
          },
          model: { 
            type: "string",
             description: "The product model."
          },
        },
        required: [
          "name",
          "description",
          "price",
          "category",
          "help",
          "model"
        ],
      },
    },
  ],
  function_call: {
    name: "create_product",
    arguments: {},
  },
};
export const GPT_FUNC_NEW_CONTACT = {
  model: "gpt-4o",
  messages: [],
  functions: [
    {
      name: "create_character",
      description:"Create a new character name and gender.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Character's full name, appropriate to their nationality.",
          },
          gender: { 
            type: "string",
             description: "Character's gender."
          },
        },
        required: [
          "name",
          "gender",
        ],
      },
    },
  ],
  function_call: {
    name: "create_contact",
    arguments: {},
  },
};
export const GPT_ADVANCE_CHAT = {
  model: "gpt-4o",
  messages: [],
  functions: [
    {
      name: "advance",
      type: "function",
      description:
        "Create a new situation card or continue an existing short story arc (2-5 cards max). " +
        "Each card is written in second-person, humorous slice-of-life style. " +
        "If arc_step reaches 5—or is_arc_end is true—start a brand-new arc.",
      parameters: {
        type: "object",
        properties: {
          age: {
            type: "integer",
            description: "The character's age in years.",
          },
          arc_id: {
            type: "string",
            description:
              "Identifier for the current mini-arc (e.g. 'office_sockgate'). " +
              "Use 'none' for a brand-new standalone situation.",
          },
          arc_step: {
            type: "integer",
            description:
              "1-based index of this card inside its arc. " +
              "Must increment by 1 while arc_id stays the same.",
          },
          is_arc_end: {
            type: "boolean",
            description:
              "Set to true when this card ends the arc (twist, punchline, or resolution). " +
              "After an end card, the next response MUST start a new arc with arc_id = 'none'.",
          },
          situation: {
            type: "string",
            description:
              "Second-person scene (1-3 sentences). Keep it immersive, funny, grounded.",
          },
          time: {
            type: "string",
            description: "Iso formatted date time of the situation.",
          },
          choices: {
            type: "array",
            description:
              "2-3 distinct actions the player can take. Each should steer the story in a new direction.",
            items: {
              type: "object",
              properties: {
                text: {
                  type: "string",
                  description:
                    "Short decision label (e.g. 'Drink it anyway'). keep it as short as possible.",
                },
                state_impacts: {
                  type: "object",
                  description:
                    "Numeric stat changes (from -25 up to +25)." +
                    "Omit any stat that isn't affected.",
                  properties: {
                    health: { type: "integer" },
                    happiness: { type: "integer" },
                    social: { type: "integer" },
                    karma: { type: "integer" },
                    wealth: { type: "integer" },
                  },
                },
              },
              required: ["text"],
            },
          },

          /* ——— GAME-OVER FLAG ——— */
          life_complete: {
            type: "boolean",
            description:
              "Set to true if the choice results in the player's death / end of life.",
          },
        },
        required: [
          "age",
          "arc_id",
          "arc_step",
          "is_arc_end",
          "situation",
          "choices",
          "life_complete",
          "time",
        ],
      },
    },
  ],
  // Let the model decide when to call the function
  function_call: { name: "advance" },
};
