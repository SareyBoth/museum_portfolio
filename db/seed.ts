import { existsSync } from 'node:fs';

if (existsSync('.env') && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env');
}
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

async function seed() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Seeding database...');

  // --- Seed Admin User (only if table is empty) ---
  const existingAdmins = await db.select().from(schema.adminUsers).limit(1);
  if (existingAdmins.length === 0) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin';

    if (!email || !password) {
      console.warn('Skipping admin seed: ADMIN_EMAIL and ADMIN_PASSWORD required');
    } else {
      // Hash password with scrypt
      const crypto = await import('node:crypto');
      const salt = crypto.randomBytes(16);
      const key = await new Promise<Buffer>((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
          if (err) reject(err);
          else resolve(derivedKey);
        });
      });
      const passwordHash = `${salt.toString('hex')}:${key.toString('hex')}`;

      await db.insert(schema.adminUsers).values({
        email,
        name,
        passwordHash,
      });
      console.log(`Admin user created: ${email}`);
    }
  } else {
    console.log('Admin user already exists, skipping');
  }

  // --- Seed Site Profile (singleton id=1) ---
  const existingProfile = await db
    .select()
    .from(schema.siteProfile)
    .where(eq(schema.siteProfile.id, 1))
    .limit(1);

  if (existingProfile.length === 0) {
    await db.insert(schema.siteProfile).values({
      name: 'SareyBoth',
      monogram: 'SB',
      disciplines: 'Video Editor \u00B7 Photo Retoucher \u00B7 Poster Designer',
      location: 'Phnom Penh, Cambodia',
      timezone: 'Indochina Time (UTC+7)',
      availability: 'Available for Commercial Commissions & Studio Roles',
      portraitAlt:
        'Studio portrait of SareyBoth \u2014 Video Editor, Photo Retoucher & Poster Designer',
      portraitPlaque: 'PRINCIPAL \u00B7 STUDIO PORTRAIT',
      heroLead:
        'Shaping commercial narrative tempo, 35mm film emulation pipelines, and Swiss grid print layouts from Phnom Penh.',
      heroSpecs: '24 FPS \u00B7 16:9 & 9:16 Masters \u00B7 300 DPI CMYK',
      educationSummary:
        'SETEC Institute \u2014 Management Information Systems (Media & Visual Systems Focus)',
      narrativeLead:
        'Visual storytelling shaped by rhythmic editing, cinematic color fidelity, and architectural Swiss typography.',
      narrativeParagraphs: [
        'I am SareyBoth, a video editor, photo retoucher, and poster designer based in Phnom Penh, Cambodia. My practice centers on narrative tempo\u2014cutting high-energy commercial reels, documentary portraits, and promotional films that sustain audience attention.',
        'In DaVinci Resolve Studio, I craft custom 35mm film emulation LUTs, balanced skin-tone curves, and Rec.709/ACES delivery pipelines. In graphic print, I compose festival key art and exhibition posters anchored in strict Swiss typographic grids and press-accurate separations.',
      ],
      cvSummary:
        'Visual editor and graphic designer specializing in commercial speed-ramp video cuts, DaVinci Resolve color grading, frequency-separation retouching, and Swiss typography poster layouts in Phnom Penh, Cambodia.',
      cvSoftwareLine:
        'Adobe Premiere Pro \u00B7 DaVinci Resolve Studio \u00B7 Adobe Photoshop \u00B7 Adobe After Effects \u00B7 Adobe Lightroom \u00B7 Capture One \u00B7 Adobe Illustrator \u00B7 Adobe InDesign \u00B7 Figma \u00B7 CapCut Pro',
      showAvailability: true,
      showContact: true,
    });
    console.log('Site profile seeded');
  }

  // --- Seed Contact Channels ---
  const existingChannels = await db.select().from(schema.contactChannels).limit(1);
  if (existingChannels.length === 0) {
    await db.insert(schema.contactChannels).values([
      {
        channelId: 'email',
        label: 'Direct Email',
        value: 'hengratanak00@gmail.com',
        href: 'mailto:hengratanak00@gmail.com',
        copyValue: 'hengratanak00@gmail.com',
        sortOrder: 0,
      },
      {
        channelId: 'telegram',
        label: 'Telegram Direct',
        value: '@Ratan4k_Heng',
        href: 'https://t.me/Ratan4k_Heng',
        copyValue: '@Ratan4k_Heng',
        external: true,
        sortOrder: 1,
      },
      {
        channelId: 'phone',
        label: 'Phone',
        value: '+855 85 743 431',
        href: 'tel:+85585743431',
        copyValue: '+855 85 743 431',
        badge: 'KH',
        sortOrder: 2,
      },
    ]);
    console.log('Contact channels seeded');
  }

  // --- Seed Projects ---
  const existingProjects = await db.select().from(schema.projects).limit(1);
  if (existingProjects.length === 0) {
    const projectsData = [
      {
        slug: 'p-01',
        galleryArtworkId: 'left-0',
        plaqueNumber: 'EXH-01',
        title: 'Midnight Film Festival \u2014 Key Art Poster',
        shortTitle: 'Midnight Film Festival',
        category: 'Poster Design',
        aspect: '9:16',
        specLabel: '9:16 \u00B7 POSTER DESIGN',
        year: '2025',
        accentColor: '#F59E0B',
        platePreset: 'festival-key-art',
        inspectionMode: 'print-grid',
        description:
          'Official festival key visual exploring architectural brutalism, dramatic chiaroscuro film lighting, and Swiss grid typographic hierarchy.',
        curatorNote:
          'Constructed with ceremonial gold accents and strict grid alignment, balancing bilingual titles for international cinema audiences.',
        tools: ['Adobe Photoshop', 'Adobe Illustrator', 'Prepress'],
        deliverables: '300 DPI CMYK Master, B1 & Bus Shelter Prints, Social Key Art',
        sortOrder: 0,
      },
      {
        slug: 'p-02',
        galleryArtworkId: 'right-0',
        plaqueNumber: 'EXH-02',
        title: "Director's Cut Showreel \u2014 Commercial & Music Video",
        shortTitle: "Director's Cut Showreel",
        category: 'Video Edits',
        aspect: '16:9',
        specLabel: '16:9 \u00B7 VIDEO EDIT \u00B7 01:24',
        year: '2025',
        duration: '01:24',
        accentColor: '#F97316',
        platePreset: 'nle-timeline',
        inspectionMode: 'timeline',
        description:
          'High-octane commercial montage featuring aggressive velocity speed ramps, rhythmic match cuts on transients, and punchy sound design.',
        curatorNote:
          'Mastered in Apple ProRes 422 HQ with 2.39:1 anamorphic letterboxing and frame-accurate audio sync.',
        tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'Audio Foley'],
        deliverables: '4K DCI ProRes 422 HQ, 2.39:1 Anamorphic Master, Sound Mix',
        sortOrder: 1,
      },
      {
        slug: 'p-03',
        galleryArtworkId: 'left-1',
        plaqueNumber: 'EXH-03',
        title: 'Monolith Sound Tour \u2014 Editorial Print Series',
        shortTitle: 'Monolith Sound Tour',
        category: 'Poster Design',
        aspect: '9:16',
        specLabel: '9:16 \u00B7 POSTER DESIGN',
        year: '2025',
        accentColor: '#D7FF3F',
        platePreset: 'risograph-waveform',
        inspectionMode: 'print-grid',
        description:
          'Limited edition screen-print exhibition poster integrating acoustic waveform bar graphs with bold structural Latin typography.',
        curatorNote:
          'Printed on heavy archival cotton stock, combining high-contrast acid-lime accents against deep graphite ink.',
        tools: ['Adobe InDesign', 'Adobe Photoshop', 'Screen Print'],
        deliverables: 'A1 Screen Print Master, Spot Neon Pantones, Tour Collateral',
        sortOrder: 2,
      },
      {
        slug: 'p-04',
        galleryArtworkId: 'right-1',
        plaqueNumber: 'EXH-04',
        title: 'Anamorphic Lookbook \u2014 Color Grading & LUT Breakdown',
        shortTitle: 'Anamorphic 35mm Grade',
        category: 'Video Edits',
        aspect: '16:9',
        specLabel: '16:9 \u00B7 COLOR GRADE \u00B7 02:45',
        year: '2025',
        duration: '02:45',
        accentColor: '#06B6D4',
        platePreset: 'color-grade-split',
        inspectionMode: 'compare',
        description:
          'Film emulation color grading breakdown in DaVinci Resolve, highlighting warm tungsten shadow roll-off and balanced cyan midtones.',
        curatorNote:
          'Color pipeline transformed from camera log into Rec.709 with custom split-tone curves and halation emulation.',
        tools: ['DaVinci Resolve Studio', 'Lumetri Color', 'Custom LUTs'],
        deliverables: 'Rec.709 & DCI-P3 Color Grades, Halation Pass, Master Stills',
        sortOrder: 3,
      },
      {
        slug: 'p-05',
        galleryArtworkId: 'left-2',
        plaqueNumber: 'EXH-05',
        title: 'Noir Cinema Retrospective \u2014 Vertical Key Art',
        shortTitle: 'Noir Cinema Retrospective',
        category: 'Poster Design',
        aspect: '9:16',
        specLabel: '9:16 \u00B7 POSTER DESIGN',
        year: '2024',
        accentColor: '#EC4899',
        platePreset: 'noir-sprocket',
        inspectionMode: 'print-grid',
        description:
          'High-contrast black-and-white portrait montage with natural 35mm grain, anamorphic flare streaks, and editorial typographic rules.',
        curatorNote:
          'Homage to French New Wave cinema posters, pairing deep shadow density with delicate hairline rules.',
        tools: ['Adobe Photoshop', 'Lightroom Classic', 'Grain Emulation'],
        deliverables: 'Vertical Cinema Banner, Film Archive Brochure, Social Ads',
        sortOrder: 4,
      },
      {
        slug: 'p-08',
        plaqueNumber: 'EXH-07',
        title: 'Ancestral Lantern Festival Heritage Print',
        shortTitle: 'Ancestral Lantern Print',
        category: 'Poster Design',
        aspect: '9:16',
        specLabel: '9:16 \u00B7 POSTER DESIGN',
        year: '2024',
        accentColor: '#F59E0B',
        platePreset: 'lantern-heritage',
        inspectionMode: 'print-grid',
        description:
          'Deep twilight lantern atmosphere, frequency separation skin retouching, and traditional cultural typography layout.',
        curatorNote:
          'Balances warm paper-lantern glow against deep twilight indigo shadows with bilingual Khmer/Latin display titles.',
        tools: ['Adobe Photoshop', 'Illustrator', 'CMYK Prepress'],
        deliverables: 'Bilingual Exhibition Poster, Event Badges, Heritage Key Art',
        sortOrder: 5,
      },
      {
        slug: 'p-06',
        plaqueNumber: 'EXH-06',
        title: 'High-Intensity Rhythm & Match-Cut Montage',
        shortTitle: 'Rhythm & Match-Cut Reel',
        category: 'Video Edits',
        aspect: '16:9',
        specLabel: '16:9 \u00B7 VIDEO EDIT \u00B7 00:58',
        year: '2024',
        duration: '00:58',
        accentColor: '#EF4444',
        platePreset: 'match-cut-reel',
        inspectionMode: 'timeline',
        description:
          'Rapid-fire match cuts, directional camera whips, and audio sound design engineered for high engagement commercial broadcast.',
        curatorNote:
          'Built around transient markers at 128 BPM with optical-flow frame blending across whip-pan transitions.',
        tools: ['Adobe Premiere Pro', 'Sound Design', 'Beat Sync'],
        deliverables: '16:9 Broadcast Master, 9:16 Social Cutdowns, Stems Package',
        sortOrder: 6,
      },
      {
        slug: 'p-07',
        galleryArtworkId: 'right-2',
        plaqueNumber: 'EXH-08',
        title: 'Studio Editorial Campaign \u2014 High-End Photo Retouching',
        shortTitle: 'Studio Editorial Retouch',
        category: 'Photo Retouching',
        aspect: '16:9',
        specLabel: '16:9 \u00B7 PHOTO RETOUCHING',
        year: '2024',
        accentColor: '#3B82F6',
        platePreset: 'retouch-frequency',
        inspectionMode: 'compare',
        description:
          'High-end beauty and commercial product stills retouched with non-destructive frequency separation and subtle dodge & burn sculpting.',
        curatorNote:
          'Preserves natural skin pore texture and specular highlights while perfecting color balance for luxury print campaigns.',
        tools: ['Adobe Photoshop', 'Frequency Separation', 'Capture One'],
        deliverables: 'Hi-Res TIFF Masters, RGB & CMYK Conversions, Skin Tone Passes',
        sortOrder: 7,
      },
    ];

    await db.insert(schema.projects).values(projectsData);
    console.log(`${projectsData.length} projects seeded`);
  }

  // --- Seed Skills ---
  const existingSkills = await db.select().from(schema.skills).limit(1);
  if (existingSkills.length === 0) {
    await db.insert(schema.skills).values([
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
        sortOrder: 0,
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
        sortOrder: 1,
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
        sortOrder: 2,
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
        sortOrder: 3,
      },
    ]);
    console.log('Skills seeded');
  }

  // --- Seed Experience ---
  const existingExperience = await db.select().from(schema.experience).limit(1);
  if (existingExperience.length === 0) {
    await db.insert(schema.experience).values([
      {
        period: '2024 \u2014 PRESENT',
        role: 'Lead Video Editor & Visual Designer',
        organization: 'Creative Media Collaborations',
        location: 'Phnom Penh, Cambodia',
        highlights: [
          'Cut high-tempo commercial promotional videos, speed-ramp motion reels, and event teasers for broadcast and digital release.',
          'Designed cultural festival posters, brand key visuals, and promotional print collateral using Swiss grid typography.',
          'Supervised color grading workflows in DaVinci Resolve and performed commercial frequency separation photo retouching.',
        ],
        sortOrder: 0,
      },
      {
        period: '2023 \u2014 2024',
        role: 'Video Editor & Multimedia Specialist',
        organization: 'Freelance & Production Studio Work',
        location: 'Phnom Penh, Cambodia',
        highlights: [
          'Edited multi-camera wedding highlight films, narrative teasers, and lifestyle campaigns with synchronized audio mastering.',
          'Retouched commercial product still photography and prepared print-ready CMYK collateral.',
          'Delivered responsive video cuts optimized for both 16:9 widescreen presentations and 9:16 mobile channels.',
        ],
        sortOrder: 1,
      },
    ]);
    console.log('Experience seeded');
  }

  // --- Seed Education ---
  const existingEducation = await db.select().from(schema.education).limit(1);
  if (existingEducation.length === 0) {
    await db.insert(schema.education).values([
      {
        period: '2022 \u2014 PRESENT',
        degree: 'Associate & Bachelor of Management Information Systems',
        institution: 'SETEC Institute',
        location: 'Phnom Penh, Cambodia',
        focus: 'Focus on digital visual systems, multimedia technology, media asset management, and creative pipeline structures.',
        sortOrder: 0,
      },
      {
        period: '2019 \u2014 2021',
        degree: 'High School Diploma',
        institution: 'Psa Derm Thkov High School',
        location: 'Phnom Penh, Cambodia',
        focus: 'Foundational general high school studies with background in visual arts, literature, mathematics, and natural sciences.',
        sortOrder: 1,
      },
    ]);
    console.log('Education seeded');
  }

  console.log('Seed complete!');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
