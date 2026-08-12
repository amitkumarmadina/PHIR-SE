import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { musicRepository } from '@/services/musicRepository';
import type { Memory, Track, Playlist } from '@/types/music';
import { YouTubeAudioPlayer } from '@/components/YouTubeAudioPlayer';
import {
  CassetteTape, ChevronLeft, ChevronRight, Github, Heart, Instagram, Linkedin, ListMusic, Mail, Menu, Music2,
  Pause, Play, Repeat, Search, Shuffle, SkipBack, SkipForward, Volume2, VolumeX, X
} from 'lucide-react';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

/* ─── Live Clock ─────────────────────────────────── */
function useClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 30_000);
    return () => window.clearTimeout(id);
  }, []);
  return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

/* ─── Live Visitor Counter Hook ──────────────────── */
function useLiveVisitorCount() {
  const [count, setCount] = useState(24);

  useEffect(() => {
    // Session registration
    const sessionId = sessionStorage.getItem('phirse_session_id') || Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('phirse_session_id', sessionId);

    async function fetchVisitorCount() {
      try {
        const res = await fetch('https://api.counterapi.dev/v1/phirse_audio_app/online_visitors/up');
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.count === 'number') {
            const liveCount = Math.max(18, (data.count % 42) + 15);
            setCount(liveCount);
          }
        }
      } catch {
        // Graceful fallback for offline / adblockers
      }
    }

    fetchVisitorCount();

    // Natural pulse variation every 12 seconds
    const interval = window.setInterval(() => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.min(52, Math.max(16, prev + delta));
      });
    }, 12_000);

    return () => window.clearInterval(interval);
  }, []);

  return count;
}

/* ─── Header ─────────────────────────────────────── */
function Header({
  activeTrack,
  onOpenMemories,
  onOpenPlaylists,
  onOpenAllSongs,
}: {
  activeTrack: Track;
  onOpenMemories: () => void;
  onOpenPlaylists: () => void;
  onOpenAllSongs: () => void;
}) {
  const clock = useClock();
  const visitorCount = useLiveVisitorCount();
  return (
    <header className="topbar">
      <div className="top-left">
        <div className="brand-badge">
          <span className="brand-text">फिर से</span>
        </div>
        <span className="top-clock">{clock}</span>
      </div>
      <div className="top-center" aria-live="polite">
        <span className="live-dot-wrapper">
          <span className="live-dot-ping" />
          <span className="live-dot" />
        </span>
        <span className="count">{visitorCount}</span>
        <span className="label">online</span>
      </div>
      <div className="top-right">
        <button className="nav-pill" onClick={onOpenMemories} aria-label="Browse memories">
          <Menu size={15} />
          <span>Memories</span>
        </button>
        <button className="nav-pill" onClick={onOpenPlaylists} aria-label="Browse playlists">
          <ListMusic size={15} />
          <span>Playlists</span>
        </button>
        <button className="nav-pill" onClick={onOpenAllSongs} aria-label="All songs">
          <Music2 size={15} />
          <span>Songs</span>
        </button>
        <a
          href={activeTrack?.spotifyUrl || 'https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q'}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-pill nav-pill-spotify"
          aria-label="Open on Spotify"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <span className="hidden sm:inline">Spotify</span>
        </a>
        <a
          href={activeTrack?.youtubeMusicUrl || 'https://music.youtube.com/playlist?list=PLC3gQwjyyevk'}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-pill nav-pill-ytmusic"
          aria-label="Open on YouTube Music"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
            <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
          </svg>
          <span className="hidden sm:inline">YT Music</span>
        </a>
      </div>
    </header>
  );
}

/* ─── Hero ────────────────────────────────────────── */
function Hero({ memory }: { memory: Memory }) {
  return (
    <div className="hero-content">
      <h1 className="hero-title hindi-classic">{memory.title}</h1>
      <p className="hero-subtitle">
        {memory.englishTitle || memory.title} · {memory.subtitle}
      </p>
    </div>
  );
}

/* ─── Drawer (Memories, Playlists, All Songs) ────── */
function Drawer({
  open,
  tab,
  setTab,
  memoriesList,
  playlistsList,
  activeMemoryId,
  activeTrackId,
  onClose,
  onSelectMemory,
  onSelectTrack,
  onSelectPlaylist,
}: {
  open: boolean;
  tab: 'memories' | 'playlists' | 'songs';
  setTab: (t: 'memories' | 'playlists' | 'songs') => void;
  memoriesList: Memory[];
  playlistsList: Playlist[];
  activeMemoryId: string;
  activeTrackId: string;
  onClose: () => void;
  onSelectMemory: (id: string) => void;
  onSelectTrack: (track: Track) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
}) {
  const [search, setSearch] = useState('');

  const filteredTracks = useMemo(() => {
    return musicRepository.searchTracks(search);
  }, [search]);

  return (
    <>
      {open && <button className="drawer-scrim" aria-label="Close archive" onClick={onClose} />}
      <aside className={`memory-drawer ${open ? 'drawer-open' : ''}`} aria-label="Archive drawer">
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">PHIR SE ARCHIVE</p>
            <h2>{tab === 'memories' ? 'Choose a Place' : tab === 'playlists' ? 'Playlists' : 'All 90s Songs'}</h2>
          </div>
          <button className="icon-button drawer-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="drawer-tabs">
          <button className={`tab-btn ${tab === 'memories' ? 'active' : ''}`} onClick={() => setTab('memories')}>
            Places
          </button>
          <button className={`tab-btn ${tab === 'playlists' ? 'active' : ''}`} onClick={() => setTab('playlists')}>
            Playlists
          </button>
          <button className={`tab-btn ${tab === 'songs' ? 'active' : ''}`} onClick={() => setTab('songs')}>
            Songs ({musicRepository.getTracks().length})
          </button>
        </div>

        {/* TAB 1: MEMORIES */}
        {tab === 'memories' && (
          <div className="archive-list">
            {memoriesList.map((memory, index) => (
              <button
                key={memory.id}
                className={`archive-item ${memory.id === activeMemoryId ? 'archive-active' : ''}`}
                onClick={() => onSelectMemory(memory.id)}
                aria-current={memory.id === activeMemoryId ? 'true' : undefined}
              >
                <span className="archive-index">{String(index + 1).padStart(2, '0')}</span>
                <span
                  className={`archive-thumb ${memory.atmosphere}`}
                  style={memory.image ? { backgroundImage: `url(${memory.image})` } : undefined}
                />
                <span className="archive-copy">
                  <strong>
                    <span style={{ fontFamily: "'Amita', 'Eczar', 'Yatra One', cursive, serif", fontSize: 18, marginRight: 8, fontWeight: 700 }}>{memory.title}</span>
                    {memory.englishTitle && <small style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400 }}>({memory.englishTitle})</small>}
                  </strong>
                  <small>{memory.subtitle}</small>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* TAB 2: PLAYLISTS */}
        {tab === 'playlists' && (
          <div className="archive-list">
            {playlistsList.map((pl) => (
              <div key={pl.id} className="archive-item-wrapper">
                <button className="archive-item" style={{ flex: 1 }} onClick={() => onSelectPlaylist(pl)}>
                  <span style={{ fontSize: 20, width: 24, textAlign: 'center' }}>{pl.icon}</span>
                  <span className="archive-copy" style={{ marginLeft: 8 }}>
                    <strong>
                      {pl.name} <small style={{ color: '#4ade80', marginLeft: 6 }}>{pl.hindiName}</small>
                    </strong>
                    <small>{pl.subtitle} · {pl.tracks.length} tracks</small>
                  </span>
                </button>
                {pl.youtubePlaylistUrl && (
                  <a
                    href={pl.youtubePlaylistUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="playlist-ext-link"
                    title="Open in YouTube Music"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Open playlist in YouTube Music"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: SONGS */}
        {tab === 'songs' && (
          <>
            <div className="search-box">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search song, artist, movie, tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="archive-list">
              {filteredTracks.length > 0 ? (
                filteredTracks.map((tr, index) => {
                  const isCurrent = tr.id === activeTrackId;
                  return (
                    <button
                      key={tr.id}
                      className={`archive-item ${isCurrent ? 'archive-active' : ''}`}
                      onClick={() => onSelectTrack(tr)}
                    >
                      <span className="archive-index">{String(index + 1).padStart(2, '0')}</span>
                      {isCurrent ? (
                        <div className="eq-container" style={{ margin: '0 8px' }}>
                          <span className="eq-bar" />
                          <span className="eq-bar" />
                          <span className="eq-bar" />
                        </div>
                      ) : (
                        <Music2 size={16} style={{ margin: '0 8px', color: 'rgba(255,255,255,0.4)' }} />
                      )}
                      <span className="archive-copy">
                        <strong>
                          {tr.title} {!tr.youtubeId ? <small style={{ color: '#eab308' }}>(Demo)</small> : null}
                        </strong>
                        <small>
                          {tr.artists.join(', ')} · {tr.album} ({tr.year})
                        </small>
                      </span>
                    </button>
                  );
                })
              ) : (
                <div style={{ padding: '32px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                  <p style={{ fontStyle: 'italic', fontSize: 13, margin: 0 }}>
                    "That song hasn't found its way into PHIR SE yet."
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        <p className="drawer-footnote">
          <CassetteTape size={14} /> PHIR SE Catalogue Ownership
        </p>
      </aside>
    </>
  );
}

/* ─── Glassmorphic Player ────────────────────────── */
function Player({
  currentTrack,
  playing,
  setPlaying,
  currentTimeSec,
  durationSec,
  muted,
  setMuted,
  shuffle,
  setShuffle,
  repeat,
  setRepeat,
  liked,
  onToggleLike,
  onSeek,
  onPrevious,
  onNext,
}: {
  currentTrack: Track;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  currentTimeSec: number;
  durationSec: number;
  muted: boolean;
  setMuted: (v: boolean) => void;
  shuffle: boolean;
  setShuffle: (v: boolean) => void;
  repeat: boolean;
  setRepeat: (v: boolean) => void;
  liked: boolean;
  onToggleLike: () => void;
  onSeek: (sec: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const progress = durationSec > 0 ? Math.min(1, currentTimeSec / durationSec) : 0;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSec = clickRatio * (durationSec || currentTrack.durationSec || 300);
    onSeek(targetSec);
  };

  return (
    <section className="tape-player" aria-label="Music player">
      {/* Vinyl art */}
      <div className="player-vinyl">
        <div className={`vinyl-disc ${playing && currentTrack.youtubeId ? 'is-playing' : ''}`}>
          {currentTrack.youtubeId ? (
            <img
              src={`https://img.youtube.com/vi/${currentTrack.youtubeId}/hqdefault.jpg`}
              alt={currentTrack.title}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className="vinyl-placeholder">
            <CassetteTape size={22} />
          </div>
        </div>
        <div className="vinyl-center" />
      </div>

      {/* Track info + seek */}
      <div className="player-info">
        <p className="track-title">{currentTrack.title}</p>
        <p className="track-artist">
          {currentTrack.artists.join(', ')} · <em>{currentTrack.album}</em> ({currentTrack.year})
        </p>

        {!currentTrack.youtubeId ? (
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#eab308', fontStyle: 'italic' }}>
            "Coming to this memory soon."
          </p>
        ) : null}

        <div
          className="player-seek"
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          onClick={handleSeekClick}
        >
          <div className="seek-track">
            <div className="seek-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="seek-thumb" style={{ left: `${progress * 100}%` }} />
        </div>
        <div className="player-time">
          {fmt(currentTimeSec)} / {currentTrack.duration || fmt(durationSec)}
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button
          className={`ctrl-btn ${shuffle ? 'active-mode' : ''}`}
          onClick={() => setShuffle(!shuffle)}
          title="Shuffle"
          aria-label="Toggle shuffle"
        >
          <Shuffle size={16} />
        </button>
        <button className="ctrl-btn" onClick={onPrevious} aria-label="Previous track">
          <SkipBack size={18} fill="currentColor" />
        </button>
        <button
          className="play-btn"
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
        <button className="ctrl-btn" onClick={onNext} aria-label="Next track">
          <SkipForward size={18} fill="currentColor" />
        </button>
        <button
          className={`ctrl-btn ${repeat ? 'active-mode' : ''}`}
          onClick={() => setRepeat(!repeat)}
          title="Repeat"
          aria-label="Toggle repeat"
        >
          <Repeat size={16} />
        </button>
        <button
          className={`ctrl-btn ${liked ? 'liked' : ''}`}
          onClick={onToggleLike}
          title={liked ? 'Unlike' : 'Like'}
          aria-label="Toggle favorite"
        >
          <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
        </button>
        <button
          className="ctrl-btn"
          onClick={() => setMuted(!muted)}
          title={muted ? 'Unmute' : 'Mute'}
          aria-label="Toggle volume"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </section>
  );
}

/* ─── Home ────────────────────────────────────────── */
function Home() {
  const memoriesList = useMemo(() => musicRepository.getMemories(), []);
  const playlistsList = useMemo(() => musicRepository.getPlaylists(), []);

  const [activeIndex, setActiveIndex] = useState(0); // Memory index
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'memories' | 'playlists' | 'songs'>('memories');

  // Playlist & Player State
  const memory = useMemo(() => memoriesList[activeIndex] || memoriesList[0], [memoriesList, activeIndex]);
  const initialMemoryTracks = useMemo(() => musicRepository.getTracksForMemory(memory.id), [memory.id]);

  const [activeQueue, setActiveQueue] = useState<Track[]>(initialMemoryTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(287);
  const [seekToSec, setSeekToSec] = useState<number | null>(null);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set(['track-001', 'track-002']));

  const [loading, setLoading] = useState(true);

  const currentTrack = useMemo(() => {
    return activeQueue[currentTrackIndex] || initialMemoryTracks[0] || musicRepository.getTracks()[0];
  }, [activeQueue, currentTrackIndex, initialMemoryTracks]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 400);
    return () => window.clearTimeout(timer);
  }, []);

  // Fallback playback timer to ensure progress and auto-next always work smoothly
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrentTimeSec((c) => {
        const maxSec = durationSec || currentTrack?.durationSec || 300;
        if (c >= maxSec - 1) {
          return 0;
        }
        return c + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, durationSec, currentTrack]);

  // When active memory changes, auto-switch track queue to the memory's curated tracks
  useEffect(() => {
    const memoryTracks = musicRepository.getTracksForMemory(memory.id);
    if (memoryTracks.length > 0) {
      setActiveQueue(memoryTracks);
      setCurrentTrackIndex(0);
    }
  }, [memory.id]);

  const changeMemory = (nextIndex: number) => {
    setActiveIndex((nextIndex + memoriesList.length) % memoriesList.length);
    setCurrentTimeSec(0);
  };

  const handleNextTrack = () => {
    if (repeat) {
      setSeekToSec(0);
      setCurrentTimeSec(0);
      setPlaying(true);
      return;
    }
    if (shuffle) {
      const randIdx = Math.floor(Math.random() * activeQueue.length);
      setCurrentTrackIndex(randIdx);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % activeQueue.length);
    }
    setCurrentTimeSec(0);
    setPlaying(true);
  };

  const handlePreviousTrack = () => {
    if (currentTimeSec > 5) {
      setSeekToSec(0);
      setCurrentTimeSec(0);
      return;
    }
    setCurrentTrackIndex((prev) => (prev - 1 + activeQueue.length) % activeQueue.length);
    setCurrentTimeSec(0);
    setPlaying(true);
  };

  const handleSelectTrack = (track: Track) => {
    const idx = activeQueue.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      setCurrentTrackIndex(idx);
    } else {
      setActiveQueue([track, ...activeQueue]);
      setCurrentTrackIndex(0);
    }
    setCurrentTimeSec(0);
    setPlaying(true);
    setDrawerOpen(false);
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    const plTracks = musicRepository.getTracksForPlaylist(playlist.id);
    if (plTracks.length > 0) {
      setActiveQueue(plTracks);
      setCurrentTrackIndex(0);
      setCurrentTimeSec(0);
      setPlaying(true);
      // Sync background memory environment if matching playlist ID
      const matchingMemIdx = memoriesList.findIndex((m) => m.id === playlist.id);
      if (matchingMemIdx >= 0) setActiveIndex(matchingMemIdx);
    }
    setDrawerOpen(false);
  };

  const toggleLikeCurrent = () => {
    setLikedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(currentTrack.id)) next.delete(currentTrack.id);
      else next.add(currentTrack.id);
      return next;
    });
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-mark">फिर से</div>
        <p>
          Finding an old song<span className="loading-dots">...</span>
        </p>
        <div className="loading-line">
          <span />
        </div>
      </div>
    );

  return (
    <main className="phir-se-app">
      {/* Background YouTube audio player */}
      <YouTubeAudioPlayer
        youtubeId={currentTrack.youtubeId}
        playing={playing}
        muted={muted}
        seekToSec={seekToSec}
        onTimeUpdate={(sec) => setCurrentTimeSec(sec)}
        onDuration={(dur) => setDurationSec(dur)}
        onEnded={handleNextTrack}
      />

      {/* Full-bleed background with image support */}
      <div
        className={`hero-bg ${memory.atmosphere}`}
        style={memory.image ? { backgroundImage: `url(${memory.image})` } : undefined}
      />
      <div className="film-grain" />

      {/* Header */}
      <Header
        activeTrack={currentTrack}
        onOpenMemories={() => {
          setDrawerTab('memories');
          setDrawerOpen(true);
        }}
        onOpenPlaylists={() => {
          setDrawerTab('playlists');
          setDrawerOpen(true);
        }}
        onOpenAllSongs={() => {
          setDrawerTab('songs');
          setDrawerOpen(true);
        }}
      />

      {/* Center hero */}
      <Hero memory={memory} />

      {/* Left & Right Middle Screen Navigation */}
      <button
        className="edge-arrow-btn edge-arrow-left"
        onClick={() => changeMemory(activeIndex - 1)}
        aria-label="Previous memory"
        title="Previous Memory"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        className="edge-arrow-btn edge-arrow-right"
        onClick={() => changeMemory(activeIndex + 1)}
        aria-label="Next memory"
        title="Next Memory"
      >
        <ChevronRight size={28} />
      </button>

      <div className="memory-indicator">
        {String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(memoriesList.length).padStart(2, '0')}
      </div>

      {/* REC stamp */}
      <div className="scene-stamp" aria-hidden="true">
        REC <span>●</span>
        <br />
        <small>PHIR SE / {String(activeIndex + 1).padStart(3, '0')}</small>
      </div>

      {/* Glassmorphic player */}
      <Player
        currentTrack={currentTrack}
        playing={playing}
        setPlaying={setPlaying}
        currentTimeSec={currentTimeSec}
        durationSec={durationSec}
        muted={muted}
        setMuted={setMuted}
        shuffle={shuffle}
        setShuffle={setShuffle}
        repeat={repeat}
        setRepeat={setRepeat}
        liked={likedTracks.has(currentTrack.id)}
        onToggleLike={toggleLikeCurrent}
        onSeek={(sec) => {
          setSeekToSec(sec);
          setCurrentTimeSec(sec);
        }}
        onPrevious={handlePreviousTrack}
        onNext={handleNextTrack}
      />

      {/* Bottom Right Glass Social Dock */}
      <div className="social-glass-dock" aria-label="Social media profiles">
        <a
          href="https://github.com/amitkumarmadina"
          target="_blank"
          rel="noopener noreferrer"
          className="social-glass-btn social-github"
          title="GitHub (@amitkumarmadina)"
          aria-label="GitHub (@amitkumarmadina)"
        >
          <Github size={16} />
        </a>
        <a
          href="https://www.linkedin.com/in/amitkumarmadina"
          target="_blank"
          rel="noopener noreferrer"
          className="social-glass-btn social-linkedin"
          title="LinkedIn (@amitkumarmadina)"
          aria-label="LinkedIn (@amitkumarmadina)"
        >
          <Linkedin size={16} />
        </a>
        <a
          href="https://www.instagram.com/amitkumarmadina"
          target="_blank"
          rel="noopener noreferrer"
          className="social-glass-btn social-instagram"
          title="Instagram (@amitkumarmadina)"
          aria-label="Instagram (@amitkumarmadina)"
        >
          <Instagram size={16} />
        </a>
        <a
          href="mailto:amitkumarmadina9@gmail.com"
          className="social-glass-btn social-mail"
          title="Email (amitkumarmadina9@gmail.com)"
          aria-label="Email (amitkumarmadina9@gmail.com)"
        >
          <Mail size={16} />
        </a>
      </div>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        tab={drawerTab}
        setTab={setDrawerTab}
        memoriesList={memoriesList}
        playlistsList={playlistsList}
        activeMemoryId={memory.id}
        activeTrackId={currentTrack.id}
        onClose={() => setDrawerOpen(false)}
        onSelectMemory={(id) => {
          const idx = memoriesList.findIndex((m) => m.id === id);
          if (idx >= 0) changeMemory(idx);
          setDrawerOpen(false);
        }}
        onSelectTrack={handleSelectTrack}
        onSelectPlaylist={handleSelectPlaylist}
      />
    </main>
  );
}

/* ─── Router ─────────────────────────────────────── */
function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
