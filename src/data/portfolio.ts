import type { ArtworkData } from './gallery';

export type WorkCategory = 'Video Edits' | 'Poster Design' | 'Photo Retouching';
export type WorkFilter = 'Video' | 'Photo';

export type PlatePreset =
  | 'festival-key-art'
  | 'nle-timeline'
  | 'risograph-waveform'
  | 'color-grade-split'
  | 'noir-sprocket'
  | 'match-cut-reel'
  | 'retouch-frequency'
  | 'lantern-heritage';

export type InspectionMode = 'timeline' | 'compare' | 'print-grid';

export interface PortfolioWork {
  id: string;
  galleryArtworkId?: string;
  plaqueNumber: string;
  title: string;
  shortTitle: string;
  category: WorkCategory;
  aspect: '16:9' | '9:16';
  specLabel: string;
  year: string;
  duration?: string;
  accentColor: string;
  platePreset: PlatePreset;
  inspectionMode: InspectionMode;
  desc: string;
  curatorNote: string;
  tools: string[];
  deliverables: string;
  /** Drop local assets into `public/media/` and set this path to replace the procedural exhibition plate. */
  mediaSrc?: string;
  mediaType?: 'image' | 'video';
  posterSrc?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface CapabilityRow {
  code: string;
  title: string;
  summary: string;
  tools: string[];
}

export interface ExperienceEntry {
  period: string;
  role: string;
  organization: string;
  location: string;
  highlights: string[];
}

export interface EducationEntry {
  period: string;
  degree: string;
  institution: string;
  location: string;
  focus: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  copyValue: string;
  external?: boolean;
  badge?: string;
}

export const PORTAL_NAV_ITEMS: readonly NavItem[] = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact / CV', href: '#contact' },
];

export const WORK_CATEGORIES: readonly WorkFilter[] = ['Video', 'Photo'];
export const DEFAULT_WORK_FILTER: WorkFilter = 'Video';

export const STUDIO_PROFILE = {
  name: 'SareyBoth',
  monogram: 'SB',
  disciplines: 'Video Editor · Photo Retoucher · Poster Designer',
  location: 'Phnom Penh, Cambodia',
  timezone: 'Indochina Time (UTC+7)',
  availability: 'Available for Commercial Commissions & Studio Roles',
  /** Replace `public/media/profile-portrait.jpg` later to swap the hero archival studio portrait. */
  portraitSrc: '/media/profile-portrait.jpg',
  portraitAlt: 'Studio portrait of SareyBoth — Video Editor, Photo Retoucher & Poster Designer',
  portraitPlaque: 'PRINCIPAL · STUDIO PORTRAIT',
  heroLead:
    'Shaping commercial narrative tempo, 35mm film emulation pipelines, and Swiss grid print layouts from Phnom Penh.',
  heroSpecs: '24 FPS · 16:9 & 9:16 Masters · 300 DPI CMYK',
  educationSummary:
    'SETEC Institute — Management Information Systems (Media & Visual Systems Focus)',
  narrativeLead:
    'Visual storytelling shaped by rhythmic editing, cinematic color fidelity, and architectural Swiss typography.',
  narrativeParagraphs: [
    'I am SareyBoth, a video editor, photo retoucher, and poster designer based in Phnom Penh, Cambodia. My practice centers on narrative tempo—cutting high-energy commercial reels, documentary portraits, and promotional films that sustain audience attention.',
    'In DaVinci Resolve Studio, I craft custom 35mm film emulation LUTs, balanced skin-tone curves, and Rec.709/ACES delivery pipelines. In graphic print, I compose festival key art and exhibition posters anchored in strict Swiss typographic grids and press-accurate separations.',
  ],
  cvSummary:
    'Visual editor and graphic designer specializing in commercial speed-ramp video cuts, DaVinci Resolve color grading, frequency-separation retouching, and Swiss typography poster layouts in Phnom Penh, Cambodia.',
  cvSoftwareLine:
    'Adobe Premiere Pro · DaVinci Resolve Studio · Adobe Photoshop · Adobe After Effects · Adobe Lightroom · Capture One · Adobe Illustrator · Adobe InDesign · Figma · CapCut Pro',
} as const;

export const PORTFOLIO_WORKS: readonly PortfolioWork[] = [
  {
    id: 'p-01',
    galleryArtworkId: 'left-0',
    plaqueNumber: 'EXH-01',
    title: 'Midnight Film Festival — Key Art Poster',
    shortTitle: 'Midnight Film Festival',
    category: 'Poster Design',
    aspect: '9:16',
    specLabel: '9:16 · POSTER DESIGN',
    year: '2025',
    accentColor: '#F59E0B',
    platePreset: 'festival-key-art',
    inspectionMode: 'print-grid',
    desc: 'Official festival key visual exploring architectural brutalism, dramatic chiaroscuro film lighting, and Swiss grid typographic hierarchy.',
    curatorNote:
      'Constructed with ceremonial gold accents and strict grid alignment, balancing bilingual titles for international cinema audiences.',
    tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Prepress'],
    deliverables: '300 DPI CMYK Master, B1 & Bus Shelter Prints, Social Key Art',
  },
  {
    id: 'p-02',
    galleryArtworkId: 'right-0',
    plaqueNumber: 'EXH-02',
    title: "Director's Cut Showreel — Commercial & Music Video",
    shortTitle: "Director's Cut Showreel",
    category: 'Video Edits',
    aspect: '16:9',
    specLabel: '16:9 · VIDEO EDIT · 01:24',
    year: '2025',
    duration: '01:24',
    accentColor: '#F97316',
    platePreset: 'nle-timeline',
    inspectionMode: 'timeline',
    desc: 'High-octane commercial montage featuring aggressive velocity speed ramps, rhythmic match cuts on transients, and punchy sound design.',
    curatorNote:
      'Mastered in Apple ProRes 422 HQ with 2.39:1 anamorphic letterboxing and frame-accurate audio sync.',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'Audio Foley'],
    deliverables: '4K DCI ProRes 422 HQ, 2.39:1 Anamorphic Master, Sound Mix',
  },
  {
    id: 'p-03',
    galleryArtworkId: 'left-1',
    plaqueNumber: 'EXH-03',
    title: 'Monolith Sound Tour — Editorial Print Series',
    shortTitle: 'Monolith Sound Tour',
    category: 'Poster Design',
    aspect: '9:16',
    specLabel: '9:16 · POSTER DESIGN',
    year: '2025',
    accentColor: '#D7FF3F',
    platePreset: 'risograph-waveform',
    inspectionMode: 'print-grid',
    desc: 'Limited edition screen-print exhibition poster integrating acoustic waveform bar graphs with bold structural Latin typography.',
    curatorNote:
      'Printed on heavy archival cotton stock, combining high-contrast acid-lime accents against deep graphite ink.',
    tools: ['Adobe InDesign', 'Adobe Photoshop', 'Screen Print'],
    deliverables: 'A1 Screen Print Master, Spot Neon Pantones, Tour Collateral',
  },
  {
    id: 'p-04',
    galleryArtworkId: 'right-1',
    plaqueNumber: 'EXH-04',
    title: 'Anamorphic Lookbook — Color Grading & LUT Breakdown',
    shortTitle: 'Anamorphic 35mm Grade',
    category: 'Video Edits',
    aspect: '16:9',
    specLabel: '16:9 · COLOR GRADE · 02:45',
    year: '2025',
    duration: '02:45',
    accentColor: '#06B6D4',
    platePreset: 'color-grade-split',
    inspectionMode: 'compare',
    desc: 'Film emulation color grading breakdown in DaVinci Resolve, highlighting warm tungsten shadow roll-off and balanced cyan midtones.',
    curatorNote:
      'Color pipeline transformed from camera log into Rec.709 with custom split-tone curves and halation emulation.',
    tools: ['DaVinci Resolve Studio', 'Lumetri Color', 'Custom LUTs'],
    deliverables: 'Rec.709 & DCI-P3 Color Grades, Halation Pass, Master Stills',
  },
  {
    id: 'p-05',
    galleryArtworkId: 'left-2',
    plaqueNumber: 'EXH-05',
    title: 'Noir Cinema Retrospective — Vertical Key Art',
    shortTitle: 'Noir Cinema Retrospective',
    category: 'Poster Design',
    aspect: '9:16',
    specLabel: '9:16 · POSTER DESIGN',
    year: '2024',
    accentColor: '#EC4899',
    platePreset: 'noir-sprocket',
    inspectionMode: 'print-grid',
    desc: 'High-contrast black-and-white portrait montage with natural 35mm grain, anamorphic flare streaks, and editorial typographic rules.',
    curatorNote:
      'Homage to French New Wave cinema posters, pairing deep shadow density with delicate hairline rules.',
    tools: ['Adobe Photoshop', 'Lightroom Classic', 'Grain Emulation'],
    deliverables: 'Vertical Cinema Banner, Film Archive Brochure, Social Ads',
  },
  {
    id: 'p-08',
    plaqueNumber: 'EXH-07',
    title: 'Ancestral Lantern Festival Heritage Print',
    shortTitle: 'Ancestral Lantern Print',
    category: 'Poster Design',
    aspect: '9:16',
    specLabel: '9:16 · POSTER DESIGN',
    year: '2024',
    accentColor: '#F59E0B',
    platePreset: 'lantern-heritage',
    inspectionMode: 'print-grid',
    desc: 'Deep twilight lantern atmosphere, frequency separation skin retouching, and traditional cultural typography layout.',
    curatorNote:
      'Balances warm paper-lantern glow against deep twilight indigo shadows with bilingual Khmer/Latin display titles.',
    tools: ['Adobe Photoshop', 'Illustrator', 'CMYK Prepress'],
    deliverables: 'Bilingual Exhibition Poster, Event Badges, Heritage Key Art',
  },
  {
    id: 'p-06',
    plaqueNumber: 'EXH-06',
    title: 'High-Intensity Rhythm & Match-Cut Montage',
    shortTitle: 'Rhythm & Match-Cut Reel',
    category: 'Video Edits',
    aspect: '16:9',
    specLabel: '16:9 · VIDEO EDIT · 00:58',
    year: '2024',
    duration: '00:58',
    accentColor: '#EF4444',
    platePreset: 'match-cut-reel',
    inspectionMode: 'timeline',
    desc: 'Rapid-fire match cuts, directional camera whips, and audio sound design engineered for high engagement commercial broadcast.',
    curatorNote:
      'Built around transient markers at 128 BPM with optical-flow frame blending across whip-pan transitions.',
    tools: ['Adobe Premiere Pro', 'Sound Design', 'Beat Sync'],
    deliverables: '16:9 Broadcast Master, 9:16 Social Cutdowns, Stems Package',
  },
  {
    id: 'p-07',
    galleryArtworkId: 'right-2',
    plaqueNumber: 'EXH-08',
    title: 'Studio Editorial Campaign — High-End Photo Retouching',
    shortTitle: 'Studio Editorial Retouch',
    category: 'Photo Retouching',
    aspect: '16:9',
    specLabel: '16:9 · PHOTO RETOUCHING',
    year: '2024',
    accentColor: '#3B82F6',
    platePreset: 'retouch-frequency',
    inspectionMode: 'compare',
    desc: 'High-end beauty and commercial product stills retouched with non-destructive frequency separation and subtle dodge & burn sculpting.',
    curatorNote:
      'Preserves natural skin pore texture and specular highlights while perfecting color balance for luxury print campaigns.',
    tools: ['Adobe Photoshop', 'Frequency Separation', 'Capture One'],
    deliverables: 'Hi-Res TIFF Masters, RGB & CMYK Conversions, Skin Tone Passes',
  },
];

export const CAPABILITY_ROWS: readonly CapabilityRow[] = [
  {
    code: '01',
    title: 'Video Editing & Motion',
    summary: 'Velocity curves, match cuts, and frame-accurate audio pacing.',
    tools: [
      'Adobe Premiere Pro (Expert)',
      'DaVinci Resolve Studio',
      'Adobe After Effects',
      'CapCut Pro',
      'Velocity Speed Ramping',
      'Multi-Camera Assembly',
      'Motion Graphics & Title Design',
      'Dialogue Denoising & EQ',
      'Audio Foley Pacing',
    ],
  },
  {
    code: '02',
    title: 'Color Grading & Finishing',
    summary: 'Film emulation, tone mapping, and Rec.709 / DCI-P3 mastering.',
    tools: [
      'DaVinci Resolve Color',
      'Lumetri Color Pipeline',
      'Custom Look LUT Development',
      'Log to Rec.709 Transform',
      'ACES Color Pipeline',
      '35mm Film Grain & Halation',
      'Anamorphic Letterbox Framing',
      'Apple ProRes 422 HQ Mastering',
    ],
  },
  {
    code: '03',
    title: 'Photo Editing & Retouching',
    summary: 'Commercial stills, skin texture fidelity, and composite lighting.',
    tools: [
      'Adobe Photoshop (Expert)',
      'Adobe Lightroom Classic',
      'Frequency Separation Passes',
      'Dodge & Burn Sculpting',
      'Skin Texture Preservation',
      'Product Clean-Up & Highlights',
      'Composite Masking & Shadows',
      'Color Cast Correction',
    ],
  },
  {
    code: '04',
    title: 'Poster & Visual Design',
    summary: 'Swiss grid architecture, bilingual type, and CMYK prepress specs.',
    tools: [
      'Adobe Illustrator',
      'Adobe InDesign',
      'Figma Design',
      'Swiss Grid Layouts',
      'Bilingual Khmer/Latin Typography',
      'Key Art Direction',
      'CMYK Pre-Press Separation',
      'Large Format Print Specs',
    ],
  },
];

export const EXPERIENCE_ENTRIES: readonly ExperienceEntry[] = [
  {
    period: '2024 — PRESENT',
    role: 'Lead Video Editor & Visual Designer',
    organization: 'Creative Media Collaborations',
    location: 'Phnom Penh, Cambodia',
    highlights: [
      'Cut high-tempo commercial promotional videos, speed-ramp motion reels, and event teasers for broadcast and digital release.',
      'Designed cultural festival posters, brand key visuals, and promotional print collateral using Swiss grid typography.',
      'Supervised color grading workflows in DaVinci Resolve and performed commercial frequency separation photo retouching.',
    ],
  },
  {
    period: '2023 — 2024',
    role: 'Video Editor & Multimedia Specialist',
    organization: 'Freelance & Production Studio Work',
    location: 'Phnom Penh, Cambodia',
    highlights: [
      'Edited multi-camera wedding highlight films, narrative teasers, and lifestyle campaigns with synchronized audio mastering.',
      'Retouched commercial product still photography and prepared print-ready CMYK collateral.',
      'Delivered responsive video cuts optimized for both 16:9 widescreen presentations and 9:16 mobile channels.',
    ],
  },
];

export const EDUCATION_ENTRIES: readonly EducationEntry[] = [
  {
    period: '2022 — PRESENT',
    degree: 'Associate & Bachelor of Management Information Systems',
    institution: 'SETEC Institute',
    location: 'Phnom Penh, Cambodia',
    focus:
      'Focus on digital visual systems, multimedia technology, media asset management, and creative pipeline structures.',
  },
  {
    period: '2019 — 2021',
    degree: 'High School Diploma',
    institution: 'Psa Derm Thkov High School',
    location: 'Phnom Penh, Cambodia',
    focus:
      'Foundational general high school studies with background in visual arts, literature, mathematics, and natural sciences.',
  },
];

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  {
    id: 'email',
    label: 'Direct Email',
    value: 'hengratanak00@gmail.com',
    href: 'mailto:hengratanak00@gmail.com',
    copyValue: 'hengratanak00@gmail.com',
  },
  {
    id: 'telegram',
    label: 'Telegram Direct',
    value: '@Ratan4k_Heng',
    href: 'https://t.me/Ratan4k_Heng',
    copyValue: '@Ratan4k_Heng',
    external: true,
  },
  {
    id: 'phone',
    label: 'Phone',
    value: '+855 85 743 431',
    href: 'tel:+85585743431',
    copyValue: '+855 85 743 431',
    badge: 'KH',
  },
];

export function filterWorksByCategory(
  works: readonly PortfolioWork[],
  filter: WorkFilter
): PortfolioWork[] {
  if (filter === 'Video') {
    return works.filter((work) => work.category === 'Video Edits');
  }
  return works.filter(
    (work) => work.category === 'Photo Retouching' || work.category === 'Poster Design'
  );
}

export function getLinkedGalleryArtwork(
  work: PortfolioWork,
  artworks: readonly ArtworkData[]
): ArtworkData | undefined {
  if (!work.galleryArtworkId) return undefined;
  return artworks.find((artwork) => artwork.id === work.galleryArtworkId);
}

/**
 * Prevents accidental portal exit while scrolling inside an open dialog or before reaching scrollTop === 0.
 */
export function shouldReverseScrollToGallery(
  scrollTop: number,
  deltaY: number,
  hasOpenDialog: boolean
): boolean {
  if (hasOpenDialog) return false;
  return scrollTop <= 0 && deltaY < -15;
}
