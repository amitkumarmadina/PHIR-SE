import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { memories, type Memory } from '@/data/memories';
import { CassetteTape, ChevronLeft, ChevronRight, Circle, Clock3, Heart, Menu, Pause, Play, Radio, Volume2, VolumeX, X } from 'lucide-react';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function Scene({ memory }: { memory: Memory }) {
  return (
    <div className={`memory-scene ${memory.atmosphere}`} aria-label={`${memory.title} environment`}>
      <div className="scene-sky" />
      <div className="scene-sun" />
      <div className="scene-cloud cloud-one" />
      <div className="scene-cloud cloud-two" />
      <div className="scene-wire wire-one" />
      <div className="scene-wire wire-two" />
      <div className="scene-building building-back" />
      <div className="scene-building building-front" />
      <div className="scene-window window-one" />
      <div className="scene-window window-two" />
      <div className="scene-sign">PHIR SE<br /><span>HAIR CUTTING SALOON</span></div>
      <div className="scene-chair" />
      <div className="scene-mirror"><span>today is a good day</span></div>
      <div className="scene-counter"><i /><i /><i /><i /></div>
      <div className="scene-radio"><Radio size={18} strokeWidth={1.4} /><span>91.1</span></div>
      <div className="scene-bulb" />
      <div className="scene-fan"><span /><span /><span /><b /></div>
      <div className="scene-bicycle" />
      <div className="scene-chai"><span>चाय</span></div>
      <div className="scene-road" />
      <div className="scene-dust dust-one" />
      <div className="scene-dust dust-two" />
      <div className="scene-caption">{memory.note}</div>
    </div>
  );
}

function MemoryDrawer({ open, activeId, onClose, onSelect }: { open: boolean; activeId: string; onClose: () => void; onSelect: (id: string) => void }) {
  return (
    <>
      {open && <button className="drawer-scrim" aria-label="Close memory archive" data-testid="button-close-drawer" onClick={onClose} />}
      <aside className={`memory-drawer ${open ? 'drawer-open' : ''}`} aria-label="Memory archive">
        <div className="drawer-heading">
          <div>
            <p className="eyebrow">THE ARCHIVE</p>
            <h2>Choose a memory</h2>
            <p>Pick a place. Hear the feeling.</p>
          </div>
          <button className="icon-button drawer-close" onClick={onClose} aria-label="Close memory archive" data-testid="button-close-drawer"><X size={18} /></button>
        </div>
        <div className="archive-list">
          {memories.map((memory, index) => (
            <button
              key={memory.id}
              className={`archive-item ${memory.id === activeId ? 'archive-active' : ''}`}
              onClick={() => onSelect(memory.id)}
              aria-current={memory.id === activeId ? 'true' : undefined}
              data-testid={`memory-${memory.id}`}
            >
              <span className="archive-index">{String(index + 1).padStart(2, '0')}</span>
              <span className={`archive-thumb ${memory.atmosphere}`}><span /></span>
              <span className="archive-copy"><strong>{memory.title}</strong><small>{memory.subtitle}</small></span>
            </button>
          ))}
        </div>
        <p className="drawer-footnote"><CassetteTape size={14} /> 12 places, still playing</p>
      </aside>
    </>
  );
}

function Player({ memory, playing, setPlaying, favorite, setFavorite, muted, setMuted, progress, onPrevious, onNext }: {
  memory: Memory; playing: boolean; setPlaying: (value: boolean) => void; favorite: boolean; setFavorite: (value: boolean) => void; muted: boolean; setMuted: (value: boolean) => void; progress: number; onPrevious: () => void; onNext: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const durationSeconds = 287;
  const elapsed = Math.floor(durationSeconds * progress);
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <section className={`tape-player ${expanded ? 'player-expanded' : ''}`} aria-label="Memory player">
      <div className="player-progress"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="player-artwork" aria-hidden="true"><CassetteTape size={26} strokeWidth={1.2} /><span>{memory.track.label}</span></div>
      <div className="player-track">
        <p className="eyebrow">{memory.era}</p>
        <h2 data-testid="text-current-track">{memory.track.title}</h2>
        <p>{memory.track.artist} <span>·</span> {memory.track.album} ({memory.track.year})</p>
      </div>
      <div className="player-times"><span>{formatTime(elapsed)}</span><span>{memory.track.duration}</span></div>
      <div className="player-controls">
        <button className="player-skip" onClick={onPrevious} aria-label="Previous memory" data-testid="button-player-previous"><ChevronLeft size={18} /></button>
        <button className="play-button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause demo track' : 'Play demo track'} data-testid="button-play-pause">{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
        <button className="player-skip" onClick={onNext} aria-label="Next memory" data-testid="button-player-next"><ChevronRight size={18} /></button>
      </div>
      <div className="player-actions">
        <button className={`text-button ${favorite ? 'is-favorite' : ''}`} onClick={() => setFavorite(!favorite)} aria-label={favorite ? 'Remove favorite' : 'Add favorite'} aria-pressed={favorite} data-testid="button-favorite"><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
        <button className="text-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn volume on' : 'Mute'} aria-pressed={muted} data-testid="button-volume">{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button>
        <button className="player-more" onClick={() => setExpanded(!expanded)} aria-label={expanded ? 'Collapse player' : 'Expand player'} data-testid="button-expand-player">•••</button>
      </div>
      {expanded && <div className="demo-note"><Circle size={8} fill="currentColor" /> Demo playback · no audio file loaded yet. The tape is waiting for its licensed song.</div>}
    </section>
  );
}

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0.18);
  const [loading, setLoading] = useState(true);
  const memory = useMemo(() => memories[activeIndex], [activeIndex]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setProgress((current) => current >= 0.997 ? 0 : current + 0.002), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const changeMemory = (nextIndex: number) => {
    setActiveIndex((nextIndex + memories.length) % memories.length);
    setProgress(0.03);
    setPlaying(false);
  };
  const selectMemory = (id: string) => {
    const nextIndex = memories.findIndex((item) => item.id === id);
    if (nextIndex >= 0) changeMemory(nextIndex);
    setDrawerOpen(false);
  };

  if (loading) return <div className="loading-screen"><div className="loading-mark">PHIR SE</div><p>Finding an old song<span className="loading-dots">...</span></p><div className="loading-line"><span /></div></div>;

  return (
    <main className="phir-se-app">
      <div className="film-grain" />
      <Scene memory={memory} />
      <header className="topbar">
        <button className="brand-lockup" onClick={() => { setActiveIndex(0); setDrawerOpen(false); }} aria-label="Return to The Saloon" data-testid="button-brand">
          <span className="brand-name">PHIR SE</span><span className="brand-line">go back · just for a song</span>
        </button>
        <div className="top-meta"><span className="live-dot" /><span>23 listening <em>· simulated</em></span><Clock3 size={14} /><span>18:42</span></div>
      </header>
      <div className="scene-intro">
        <p className="eyebrow" data-testid="text-memory-era">{memory.era}</p>
        <h1 data-testid="text-memory-title">{memory.title}</h1>
        <p className="scene-subtitle" data-testid="text-memory-subtitle">{memory.subtitle}</p>
        <div className="title-rule" />
        <p className="scene-description">{memory.description}</p>
      </div>
      <div className="edge-navigation">
        <button className="edge-arrow" onClick={() => changeMemory(activeIndex - 1)} aria-label="Previous memory" data-testid="button-previous-memory"><ChevronLeft size={25} /><span>previous</span></button>
        <span className="memory-count">{String(activeIndex + 1).padStart(2, '0')} <i>/</i> {String(memories.length).padStart(2, '0')}</span>
        <button className="edge-arrow" onClick={() => changeMemory(activeIndex + 1)} aria-label="Next memory" data-testid="button-next-memory"><span>next</span><ChevronRight size={25} /></button>
      </div>
      <button className="archive-trigger" onClick={() => setDrawerOpen(true)} aria-label="Open memory archive" data-testid="button-open-drawer"><Menu size={18} /><span>memories</span></button>
      <div className="scene-stamp" aria-hidden="true">REC <span>●</span><br /><small>PHIR SE / 001</small></div>
      <Player memory={memory} playing={playing} setPlaying={setPlaying} favorite={favorite} setFavorite={setFavorite} muted={muted} setMuted={setMuted} progress={progress} onPrevious={() => changeMemory(activeIndex - 1)} onNext={() => changeMemory(activeIndex + 1)} />
      <footer className="credit-footer"><span>© 2026 PHIR SE</span><span>some memories never stop playing</span><span>made for the old souls <CassetteTape size={13} /></span></footer>
      <MemoryDrawer open={drawerOpen} activeId={memory.id} onClose={() => setDrawerOpen(false)} onSelect={selectMemory} />
    </main>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
