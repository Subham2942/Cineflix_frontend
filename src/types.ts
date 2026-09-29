export type Movie = {
  name: string;
  description: string;
};

export type SearchResult = {
  id: string;
  text: string;
  metadata?: {
    name?: string;
    distance?: number;
  };
  score?: number;
};
