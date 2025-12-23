export const NanobananaModel = {
  FLASH: 'gemini-2.5-flash-image',
  PRO: 'gemini-3-pro-image-preview'
} as const;

export type NanobananaModel = (typeof NanobananaModel)[keyof typeof NanobananaModel];

export type NanobananaInlineImage = {
  dataBase64: string;
  mimeType: string;
};

export type NanobananaImage = {
  id: string;
  dataBase64: string;
  mimeType: string;
};

export type NanobananaGenerateRequest = {
  model: NanobananaModel;
  prompt: string;
  baseImage?: NanobananaInlineImage | null;
  referenceImages?: NanobananaInlineImage[];
};

export type NanobananaErrorType = 'network' | 'api' | 'unknown';

export type NanobananaError = {
  type: NanobananaErrorType;
  message: string;
};

export type NanobananaGenerateSuccessResponse = {
  success: true;
  images: NanobananaImage[];
};

export type NanobananaGenerateErrorResponse = {
  success: false;
  error: NanobananaError;
};

export type NanobananaGenerateResponse =
  | NanobananaGenerateSuccessResponse
  | NanobananaGenerateErrorResponse;

export type NanobananaDownloadRequest = {
  dataBase64: string;
  mimeType: string;
  fileName?: string;
};
