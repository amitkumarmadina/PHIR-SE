import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface YouTubeAudioPlayerProps {
  youtubeId: string | null;
  playing: boolean;
  muted: boolean;
  seekToSec?: number | null;
  onTimeUpdate?: (currentTimeSec: number) => void;
  onDuration?: (durationSec: number) => void;
  onEnded?: () => void;
}

export function YouTubeAudioPlayer({
  youtubeId,
  playing,
  muted,
  seekToSec,
  onTimeUpdate,
  onDuration,
  onEnded,
}: YouTubeAudioPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const playerReadyRef = useRef<boolean>(false);

  // Store latest callbacks in refs to avoid re-initializing player
  const onEndedRef = useRef(onEnded);
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onDurationRef = useRef(onDuration);
  const playingRef = useRef(playing);
  const youtubeIdRef = useRef(youtubeId);

  useEffect(() => {
    onEndedRef.current = onEnded;
    onTimeUpdateRef.current = onTimeUpdate;
    onDurationRef.current = onDuration;
    playingRef.current = playing;
    youtubeIdRef.current = youtubeId;
  });

  // 1. Load YT API Script (once)
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // 2. Initialize YT Player (once on mount)
  useEffect(() => {
    let isMounted = true;

    const createPlayer = () => {
      if (!containerRef.current || playerRef.current) return;

      const playerDiv = document.createElement('div');
      playerDiv.id = `yt-player-${Math.random().toString(36).substring(2, 9)}`;
      containerRef.current.appendChild(playerDiv);

      playerRef.current = new window.YT.Player(playerDiv.id, {
        height: '1',
        width: '1',
        videoId: youtubeIdRef.current || 'N0jnLZxYwYc', // Default: Mujhse Mohabbat Ka Izhaar (Deluxe Saloon playlist)
        playerVars: {
          autoplay: playingRef.current && youtubeIdRef.current ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            if (!isMounted) return;
            playerReadyRef.current = true;
            if (muted) event.target.mute();
            else event.target.unMute();

            const dur = event.target.getDuration();
            if (dur && onDurationRef.current) onDurationRef.current(dur);

            if (playingRef.current && youtubeIdRef.current) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (!isMounted) return;
            // 0 = ENDED
            if (event.data === window.YT.PlayerState.ENDED) {
              if (onEndedRef.current) onEndedRef.current();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        createPlayer();
      };
    }

    return () => {
      isMounted = false;
      playerReadyRef.current = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  // 3. Handle Video ID Change seamlessly via loadVideoById
  const prevYoutubeIdRef = useRef(youtubeId);
  useEffect(() => {
    if (prevYoutubeIdRef.current === youtubeId) return;
    prevYoutubeIdRef.current = youtubeId;

    if (!youtubeId) {
      // If youtubeId is null/unconfigured, pause player gracefully
      if (playerRef.current && playerReadyRef.current && typeof playerRef.current.pauseVideo === 'function') {
        try {
          playerRef.current.pauseVideo();
        } catch (e) {}
      }
      return;
    }

    if (playerRef.current && playerReadyRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        if (playing) {
          playerRef.current.loadVideoById(youtubeId);
        } else {
          playerRef.current.cueVideoById(youtubeId);
        }
      } catch (e) {
        console.error('Error changing YouTube video ID:', e);
      }
    }
  }, [youtubeId, playing]);

  // 4. Handle Play / Pause
  useEffect(() => {
    if (!playerRef.current || !playerReadyRef.current || !youtubeId || typeof playerRef.current.playVideo !== 'function') return;
    try {
      if (playing) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      // Ignore transient errors
    }
  }, [playing, youtubeId]);

  // 5. Handle Mute / Unmute
  useEffect(() => {
    if (!playerRef.current || !playerReadyRef.current || typeof playerRef.current.mute !== 'function') return;
    try {
      if (muted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    } catch (e) {
      // Ignore transient errors
    }
  }, [muted]);

  // 6. Handle Seek
  useEffect(() => {
    if (
      seekToSec !== null &&
      seekToSec !== undefined &&
      youtubeId &&
      playerRef.current &&
      playerReadyRef.current &&
      typeof playerRef.current.seekTo === 'function'
    ) {
      try {
        playerRef.current.seekTo(seekToSec, true);
      } catch (e) {
        // Ignore seek errors
      }
    }
  }, [seekToSec, youtubeId]);

  // 7. Polling progress time update
  useEffect(() => {
    if (playing && youtubeId) {
      intervalRef.current = window.setInterval(() => {
        if (playerRef.current && playerReadyRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const current = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration();
            if (typeof current === 'number' && onTimeUpdateRef.current) {
              onTimeUpdateRef.current(current);
            }
            if (typeof dur === 'number' && dur > 0 && onDurationRef.current) {
              onDurationRef.current(dur);
            }
          } catch (e) {
            // Ignore polling errors
          }
        }
      }, 500);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, youtubeId]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: -9999,
        left: -9999,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
