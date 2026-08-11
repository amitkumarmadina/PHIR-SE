export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  duration: string;
  label: string;
};

export type Memory = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  atmosphere: string;
  era: string;
  note: string;
  track: Track;
};

export const memories: Memory[] = [
  {
    id: 'saloon',
    title: 'THE SALOON',
    subtitle: 'Old school cuts & evergreen hits',
    description: 'The fan turns slowly. Someone is waiting for their turn.',
    atmosphere: 'scene-saloon',
    era: 'Late 90s · neighbourhood',
    note: 'The radio only plays what it remembers.',
    track: { id: 'tape-01', title: 'Saaton Janam Main Tere', artist: 'Demo edit · Kumar Sanu mood', album: 'Hum Saath-Saath Hain', year: '1999', duration: '04:47', label: 'SIDE A' },
  },
  {
    id: 'bus-window',
    title: 'THE BUS WINDOW',
    subtitle: 'Long rides, old songs & memories',
    description: 'A cheek against cool glass, and fields slipping into gold.',
    atmosphere: 'scene-bus',
    era: 'Summer break · somewhere homeward',
    note: 'The next stop was always far away.',
    track: { id: 'tape-02', title: 'Window Seat No. 17', artist: 'Demo instrumental · phir se archive', album: 'Roads We Took', year: '2001', duration: '05:12', label: 'SIDE A' },
  },
  {
    id: 'train-ride',
    title: 'THE TRAIN RIDE',
    subtitle: 'Platform chai & melodies',
    description: 'Steel tracks, paper cups, and a station name you almost missed.',
    atmosphere: 'scene-train',
    era: 'Monsoon · platform 3',
    note: 'Some goodbyes sound like a whistle.',
    track: { id: 'tape-03', title: 'Platform 3 at Dawn', artist: 'Demo edit · phir se archive', album: 'Window Stories', year: '1997', duration: '03:58', label: 'SIDE B' },
  },
  {
    id: 'rainy-evening',
    title: 'THE RAINY EVENING',
    subtitle: 'Wet streets, chai & nostalgia',
    description: 'The power goes out. The whole lane becomes a reflection.',
    atmosphere: 'scene-rain',
    era: 'First monsoon · 6:18 pm',
    note: 'Rain made every old song sound closer.',
    track: { id: 'tape-04', title: 'After the First Rain', artist: 'Demo edit · old romance', album: 'Monsoon Notes', year: '2002', duration: '04:22', label: 'SIDE A' },
  },
  {
    id: 'first-love',
    title: 'FIRST LOVE',
    subtitle: 'Those sweet butterflies',
    description: 'A name in the last page of a notebook, written three times.',
    atmosphere: 'scene-love',
    era: 'School days · after the bell',
    note: 'The walk home took longer that year.',
    track: { id: 'tape-05', title: 'The Last Page', artist: 'Demo edit · cassette romance', album: 'Handwritten', year: '2003', duration: '04:09', label: 'SIDE B' },
  },
  {
    id: 'old-radio',
    title: 'THE OLD RADIO',
    subtitle: 'Random songs like old times',
    description: 'A warm room, a crackling signal, and no way to skip ahead.',
    atmosphere: 'scene-radio',
    era: 'Sunday afternoon · 91.1 FM',
    note: 'The static was part of the song.',
    track: { id: 'tape-06', title: 'Between Two Stations', artist: 'Demo edit · radio room', album: 'Airwaves', year: '1988', duration: '03:36', label: 'SIDE A' },
  },
  {
    id: 'highway-raat',
    title: 'HIGHWAY RAAT',
    subtitle: 'Dark roads, loud thoughts',
    description: 'Headlights draw a line through the night. Nobody speaks.',
    atmosphere: 'scene-highway',
    era: '2:07 am · NH 8',
    note: 'The road knew the words by heart.',
    track: { id: 'tape-07', title: 'Lights on the Median', artist: 'Demo edit · late night archive', album: 'Night Drive', year: '2004', duration: '05:01', label: 'SIDE B' },
  },
  {
    id: 'shaadi-sunday',
    title: 'SHAADI & SUNDAY',
    subtitle: 'Band, baraat & good vibes',
    description: 'Marigolds, steel plates, and one cousin dancing too hard.',
    atmosphere: 'scene-shaadi',
    era: 'Winter wedding · family camera',
    note: 'Every photograph had someone moving.',
    track: { id: 'tape-08', title: 'Everybody to the Courtyard', artist: 'Demo edit · celebration side', album: 'Sunday Best', year: '1995', duration: '04:31', label: 'SIDE A' },
  },
  {
    id: '90s-dard',
    title: '90s DARD',
    subtitle: 'Dil ke kone wale gaane',
    description: 'Curtains drawn, diary open, the rain doing the talking.',
    atmosphere: 'scene-dard',
    era: 'After midnight · bedroom window',
    note: 'Some feelings needed a whole cassette.',
    track: { id: 'tape-09', title: 'Dil Ke Kone Mein', artist: 'Demo edit · 90s heartbreak', album: 'The Quiet Side', year: '1996', duration: '05:24', label: 'SIDE B' },
  },
  {
    id: 'study-table',
    title: 'THE STUDY TABLE',
    subtitle: 'Late nights & dreams',
    description: 'A desk lamp, unfinished sums, and a future not yet named.',
    atmosphere: 'scene-study',
    era: 'Exam season · 11:43 pm',
    note: 'The margins held the better stories.',
    track: { id: 'tape-10', title: 'Margins of the Night', artist: 'Demo instrumental · quiet archive', album: 'Underlined', year: '2000', duration: '03:49', label: 'SIDE A' },
  },
  {
    id: 'childhood-summer',
    title: 'CHILDHOOD SUMMER',
    subtitle: 'Mangoes, holidays & afternoons',
    description: 'The cooler hums. Cricket waits under the mango tree.',
    atmosphere: 'scene-summer',
    era: 'May holidays · 2:30 pm',
    note: 'Time moved slower before the internet.',
    track: { id: 'tape-11', title: 'Mango Season', artist: 'Demo edit · summer archive', album: 'Holiday Homework', year: '1993', duration: '04:16', label: 'SIDE A' },
  },
  {
    id: 'rooftop',
    title: 'THE ROOFTOP',
    subtitle: 'Stars, silence & old songs',
    description: 'Laundry on the line, a water tank, and the whole city below.',
    atmosphere: 'scene-rooftop',
    era: 'Summer night · after dinner',
    note: 'The sky was the only screen we needed.',
    track: { id: 'tape-12', title: 'City Lights, Far Away', artist: 'Demo edit · rooftop side', album: 'Open Sky', year: '1999', duration: '04:54', label: 'SIDE B' },
  },
];