export interface ImageData {
  index: number;
  b64_json?: string;
  url?: string;
  revised_prompt: string;
}

export interface ImageResponse {
  created?: number;
  images: ImageData[];
}
