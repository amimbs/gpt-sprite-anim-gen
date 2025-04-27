// Character-related types
export interface Character {
  id: number;
  name: string;
}

// API Response types
export interface CharactersResponse {
  characters: Character[];
}

export interface PingResponse {
  message: string;
}

export interface PostResponse<T = any> {
  message: string;
  data: T;
}
