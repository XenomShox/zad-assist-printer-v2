export type TSenderEnum = "user" | "ai";

export type TLinks = { next: string | null; previous: string | null };

// export type TParams = Record<string, string | number | number[]> | null;
export type TParams = {
  id: string;
  title: string;
  machine: string;
  material: string;
  conversation_id: string;

  num_cavities: number;
  product_weight: number;
  nozzle_weight: number;
  clamping_pressure: number;
  injection_weight: number;
  clamping_force: number;

  injection_temperature: number[];
  position: number[];
  injection_pressure: number[];
  velocity: number[];
  mold_temperature: number;
  cooling_time: number;
  hot_runner_temperature: number;
  decompression: number;
  hold_pressure: number[];
  hold_velocity: number[];
  hold_time: number[];
  back_pressure: number[];
};

type TextMessage = {
  id: string;
  type: "text";
  data: string; // the text
  sender: TSenderEnum;
};

type ImageMessage = {
  id: string;
  type: "image";
  data: string; // image URL
  image_description: string;
  image_utility: string;
  sender: TSenderEnum;
};

type ParameterMessage = {
  id: string;
  type: "parameter";
  data: string; // parameter title
  fineTunning: TParams;
  sender: TSenderEnum;
};

export type TMessage = TextMessage | ImageMessage | ParameterMessage;

// export type TMessage = {
//   id: string;
//   type: "text" | "image" | "parameter";
//   data: string;
//   //   if type == "text"      --> data is the text
//   //   if type == "image"     --> data is the image_url
//   //   if type == "parameter" --> data is the parameter_title

//   image_description: string | null;
//   image_utility: string | null;

//   fineTunning: TParams | null;
//   sender: TSenderEnum;
// };

export type TConversationType = "base" | "parameter";

export type TConversation = {
  id: string;
  type: TConversationType;
  name: string;
  title: string;
  is_deleted: boolean;
  messages: TMessage[];

  messagesLinks: TLinks;
  params: TParams[];
};
