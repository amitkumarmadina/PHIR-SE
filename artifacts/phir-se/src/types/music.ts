export interface Memory {
  id: string; // e.g. 'saloon'
  title: string; // Hindi title as primary, e.g. 'डीलक्स सैलून'
  hindiTitle?: string; // e.g. 'डीलक्स सैलून'
  englishTitle?: string; // e.g. 'THE SALOON'
  subtitle: string; // e.g. 'Old school cuts & evergreen hits'
  description: string;
  atmosphere: string; // CSS class / background theme
  era: string;
  note: string;
  image?: string; // Background image URL
  tracks: string[]; // Reference to Track IDs
}

export interface Track {
  id: string; // e.g. 'track-001'
  title: string;
  artists: string[]; // e.g. ['Kumar Sanu', 'Alka Yagnik']
  album: string;
  year: number;
  artwork?: string;
  youtubeId: string | null; // Nullable if video is not yet configured
  spotifyId?: string | null;
  spotifyUrl?: string | null;
  youtubeMusicUrl?: string | null;
  source: 'youtube';
  memories: string[]; // Array of Memory IDs this track belongs to
  tags: string[]; // e.g. ['90s', 'bollywood', 'romantic']
  duration: string; // e.g. '04:47'
  durationSec: number; // e.g. 287
}

export interface Playlist {
  id: string; // e.g. 'saloon-classics'
  name: string; // e.g. 'Saloon Classics'
  hindiName: string; // e.g. 'डीलक्स सैलून स्पेशल'
  subtitle: string;
  description: string;
  icon: string;
  tracks: string[]; // Reference to Track IDs
  youtubePlaylistId?: string; // e.g. 'PLC3gQwjyyevk' — links to real YT Music playlist
  youtubePlaylistUrl?: string; // e.g. 'https://music.youtube.com/playlist?list=...'
}
