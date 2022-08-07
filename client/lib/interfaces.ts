export interface Token {
  id: string;
  track: Track;
  owner: User;
  mintedAt: number;
}

export interface User {
  id: string;
  tokens: Token[];
}

export interface Ask {
  id: string;
  asker: User;
  finalized: boolean;
  price: string;
  token: Token;
  track: Track;
}

export interface Track {
  id: string;
  name: string;
  cover: string;
  content: string;
  created: string;
  artist: Artist;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  tracks: Track[];
}
