import type { Memory, Track, Playlist } from '@/types/music';
import { memories } from '@/data/memories';
import { masterTracks } from '@/data/tracks';
import { playlists } from '@/data/playlists';

export interface IMusicRepository {
  getMemories(): Memory[];
  getMemory(id: string): Memory | undefined;
  getTracks(): Track[];
  getTrack(id: string): Track | undefined;
  getTracksForMemory(memoryId: string): Track[];
  searchTracks(query: string): Track[];
  getPlaylists(): Playlist[];
  getPlaylist(id: string): Playlist | undefined;
  getTracksForPlaylist(playlistId: string): Track[];
}

class LocalMusicRepository implements IMusicRepository {
  getMemories(): Memory[] {
    return memories;
  }

  getMemory(id: string): Memory | undefined {
    return memories.find((m) => m.id === id);
  }

  getTracks(): Track[] {
    return masterTracks;
  }

  getTrack(id: string): Track | undefined {
    return masterTracks.find((t) => t.id === id);
  }

  getTracksForMemory(memoryId: string): Track[] {
    const mem = this.getMemory(memoryId);
    if (!mem) return [];
    return mem.tracks
      .map((trackId) => this.getTrack(trackId))
      .filter((t): t is Track => t !== undefined);
  }

  searchTracks(query: string): Track[] {
    if (!query || !query.trim()) return masterTracks;
    const q = query.trim().toLowerCase();
    return masterTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artists.some((a) => a.toLowerCase().includes(q)) ||
        t.album.toLowerCase().includes(q) ||
        t.year.toString().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  getPlaylists(): Playlist[] {
    return playlists;
  }

  getPlaylist(id: string): Playlist | undefined {
    return playlists.find((p) => p.id === id);
  }

  getTracksForPlaylist(playlistId: string): Track[] {
    const pl = this.getPlaylist(playlistId);
    if (!pl) return [];
    return pl.tracks
      .map((trackId) => this.getTrack(trackId))
      .filter((t): t is Track => t !== undefined);
  }
}

// Export singleton instance of repository
export const musicRepository: IMusicRepository = new LocalMusicRepository();
