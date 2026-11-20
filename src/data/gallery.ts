export interface ArtworkData {
  id: string;
  wall: 'left' | 'right' | 'center';
  index: number;
  title: string;
  category: string;
  year: string;
  medium: string;
  aspectRatio: '9:16' | '16:9';
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  position: [number, number, number];
  rotation: [number, number, number];
  cameraInspect: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
  accentColor: string;
  glowColor: string;
  description: string;
  curatorNote: string;
  tags: string[];
  editorialHeadline: string;
  editorialSubhead: string;
}

export interface PortalData {
  id: string;
  title: string;
  subtitle: string;
  dimensions: {
    width: number;
    height: number;
  };
  position: [number, number, number];
  rotation: [number, number, number];
  targetCamera: {
    alignedPosition: [number, number, number];
    portalInsidePosition: [number, number, number];
    lookAt: [number, number, number];
  };
  status: string;
  tagline: string;
}

export const PORTAL_DATA: PortalData = {
  id: 'portal-center',
  title: 'SAREYBOTH // VIDEO · PHOTO · POSTER',
  subtitle: 'Video Editor · Photo Retoucher · Poster Designer',
  dimensions: {
    width: 6.4,
    height: 3.6,
  },
  position: [0.0, 2.15, -12.55],
  rotation: [0, 0, 0],
  targetCamera: {
    alignedPosition: [0.0, 2.15, 8.8],
    portalInsidePosition: [0.0, 2.15, -11.35],
    lookAt: [0.0, 2.15, -12.55],
  },
  status: 'CINEMA PORTAL // SCROLL TO ENTER',
  tagline: 'Pacing, 35mm Color Grading & Swiss Typography · Phnom Penh, Cambodia',
};

export const GALLERY_ARTWORKS: ArtworkData[] = [
  // --- LEFT WALL (9:16 Portrait Frames on Travertine Wall X = -5.42, Y = 1.95) ---
  // Strictly Poster Design & Vertical Visuals
  {
    id: 'left-0',
    wall: 'left',
    index: 0,
    title: 'Midnight Film Festival — Key Art Poster',
    category: 'Poster Design & Key Art',
    year: '2025',
    medium: 'Editorial Print & Vector, 900x1600 High-DPI',
    aspectRatio: '9:16',
    dimensions: { width: 1.35, height: 2.4, depth: 0.05 },
    position: [-5.42, 1.95, -8.0],
    rotation: [0, Math.PI / 2, 0],
    cameraInspect: {
      position: [-3.3, 1.95, -8.0],
      lookAt: [-5.42, 1.95, -8.0],
    },
    accentColor: '#F59E0B',
    glowColor: '#B45309',
    description: 'Official festival key visual exploring architectural brutalism, dramatic chiaroscuro film lighting, and Swiss grid typographic hierarchy.',
    curatorNote: 'Constructed with ceremonial gold accents and strict grid alignment, balancing bilingual titles for international cinema audiences.',
    tags: ['Poster Design', 'Cinema', 'Key Art', 'Typography'],
    editorialHeadline: 'MIDNIGHT FILM FESTIVAL',
    editorialSubhead: 'OFFICIAL SELECTION // KEY ART',
  },
  {
    id: 'left-1',
    wall: 'left',
    index: 1,
    title: 'Monolith Sound Tour — Editorial Print Series',
    category: 'Typography & Editorial Print',
    year: '2025',
    medium: 'Risograph & Grid Composition, 900x1600 High-DPI',
    aspectRatio: '9:16',
    dimensions: { width: 1.35, height: 2.4, depth: 0.05 },
    position: [-5.42, 1.95, -3.5],
    rotation: [0, Math.PI / 2, 0],
    cameraInspect: {
      position: [-3.3, 1.95, -3.5],
      lookAt: [-5.42, 1.95, -3.5],
    },
    accentColor: '#D7FF3F',
    glowColor: '#84CC16',
    description: 'Limited edition screen-print exhibition poster integrating acoustic waveform bar graphs with bold structural Latin typography.',
    curatorNote: 'Printed on heavy archival cotton stock, combining high-contrast acid-lime accents against deep graphite ink.',
    tags: ['Print Series', 'Typography', 'Swiss Grid', 'Editorial'],
    editorialHeadline: 'MONOLITH SOUND TOUR',
    editorialSubhead: 'LIMITED RISOGRAPH // PRINT EDITION',
  },
  {
    id: 'left-2',
    wall: 'left',
    index: 2,
    title: 'Noir Cinema Retrospective — Vertical Key Art',
    category: 'Photo Composite & Art Direction',
    year: '2024',
    medium: '35mm Film Composite, 900x1600 High-DPI',
    aspectRatio: '9:16',
    dimensions: { width: 1.35, height: 2.4, depth: 0.05 },
    position: [-5.42, 1.95, 1.0],
    rotation: [0, Math.PI / 2, 0],
    cameraInspect: {
      position: [-3.3, 1.95, 1.0],
      lookAt: [-5.42, 1.95, 1.0],
    },
    accentColor: '#EC4899',
    glowColor: '#BE185D',
    description: 'High-contrast black-and-white portrait montage with natural 35mm grain, anamorphic flare streaks, and editorial typographic rules.',
    curatorNote: 'Homage to French New Wave cinema posters, pairing deep shadow density with delicate hairline rules.',
    tags: ['Photo Composite', 'Retouching', 'Film Noir', 'Editorial'],
    editorialHeadline: 'NOIR CINEMA RETROSPECTIVE',
    editorialSubhead: 'SPECIAL ARCHIVE // 35MM RETRO',
  },

  // --- RIGHT WALL (16:9 Landscape Frames on Travertine Wall X = +5.42, Y = 1.95) ---
  // Strictly Video Editing, Color Grading & Photo Retouching
  {
    id: 'right-0',
    wall: 'right',
    index: 3,
    title: "Director's Cut Showreel — Commercial & Music Video Edit",
    category: 'Commercial Video Editing & Pacing',
    year: '2025',
    medium: '4K Cinema NLE Timeline, 1600x900 Widescreen',
    aspectRatio: '16:9',
    dimensions: { width: 2.4, height: 1.35, depth: 0.05 },
    position: [5.42, 1.95, -8.0],
    rotation: [0, -Math.PI / 2, 0],
    cameraInspect: {
      position: [3.1, 1.95, -8.0],
      lookAt: [5.42, 1.95, -8.0],
    },
    accentColor: '#F97316',
    glowColor: '#C2410C',
    description: 'High-octane commercial montage featuring aggressive velocity speed ramps, rhythmic match cuts on transients, and punchy sound design.',
    curatorNote: 'Mastered in Apple ProRes 422 HQ with 2.39:1 anamorphic letterboxing and frame-accurate audio sync.',
    tags: ['Video Editing', 'Showreel', 'Speed Ramping', '4K Master'],
    editorialHeadline: "DIRECTOR'S CUT SHOWREEL",
    editorialSubhead: 'COMMERCIAL & MUSIC VIDEO EDIT',
  },
  {
    id: 'right-1',
    wall: 'right',
    index: 4,
    title: 'Anamorphic Lookbook — Color Grading & LUT Breakdown',
    category: 'Color Grading & Finishing',
    year: '2025',
    medium: 'DaVinci Resolve Studio Color Pipeline, 1600x900 Widescreen',
    aspectRatio: '16:9',
    dimensions: { width: 2.4, height: 1.35, depth: 0.05 },
    position: [5.42, 1.95, -3.5],
    rotation: [0, -Math.PI / 2, 0],
    cameraInspect: {
      position: [3.1, 1.95, -3.5],
      lookAt: [5.42, 1.95, -3.5],
    },
    accentColor: '#06B6D4',
    glowColor: '#0891B2',
    description: 'Film emulation color grading breakdown in DaVinci Resolve, highlighting warm tungsten shadow roll-off and balanced cyan midtones.',
    curatorNote: 'Color pipeline transformed from camera log into Rec.709 with custom split-tone curves and halation emulation.',
    tags: ['Color Grading', 'DaVinci Resolve', '35mm Film', 'LUT Breakdown'],
    editorialHeadline: 'ANAMORPHIC LOOKBOOK',
    editorialSubhead: 'COLOR FINISHING // REC.709 & ACES',
  },
  {
    id: 'right-2',
    wall: 'right',
    index: 5,
    title: 'Studio Editorial Campaign — High-End Photo Retouching',
    category: 'Commercial Photo Retouching',
    year: '2024',
    medium: 'Commercial Beauty & Product Stills, 1600x900 Widescreen',
    aspectRatio: '16:9',
    dimensions: { width: 2.4, height: 1.35, depth: 0.05 },
    position: [5.42, 1.95, 1.0],
    rotation: [0, -Math.PI / 2, 0],
    cameraInspect: {
      position: [3.1, 1.95, 1.0],
      lookAt: [5.42, 1.95, 1.0],
    },
    accentColor: '#3B82F6',
    glowColor: '#1D4ED8',
    description: 'High-end beauty and commercial product stills retouched with non-destructive frequency separation and subtle dodge & burn sculpting.',
    curatorNote: 'Preserves natural skin pore texture and specular highlights while perfecting color balance for luxury print campaigns.',
    tags: ['Photo Retouching', 'Frequency Separation', 'Editorial', 'Commercial'],
    editorialHeadline: 'STUDIO EDITORIAL CAMPAIGN',
    editorialSubhead: 'HIGH-END RETOUCHING // BEAUTY & STILLS',
  },
];
