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
