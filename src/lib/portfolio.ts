import 'server-only';
import { db } from '@/db';
import {
  siteProfile,
  projects,
  skills,
  experience,
  education,
  contactChannels,
  mediaAssets,
} from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { cachedJson, CACHE_KEYS, CACHE_TTL } from './cache';
import {
  STUDIO_PROFILE,
  PORTFOLIO_WORKS,
  CAPABILITY_ROWS,
  EXPERIENCE_ENTRIES,
  EDUCATION_ENTRIES,
  CONTACT_CHANNELS,
  type PortfolioWork,
  type CapabilityRow,
  type ExperienceEntry,
  type EducationEntry,
  type ContactChannel,
} from '@/data/portfolio';

export interface DynamicPortfolioData {
  profile: {
    name: string;
    monogram: string;
    disciplines: string;
    location: string;
    timezone: string;
    availability: string;
    portraitSrc: string;
    portraitAlt: string;
    portraitPlaque: string;
    heroLead: string;
    heroSpecs: string;
    educationSummary: string;
    narrativeLead: string;
    narrativeParagraphs: string[];
    cvSummary: string;
    cvSoftwareLine: string;
    cvUrl?: string;
    showAvailability: boolean;
    showContact: boolean;
  };
  works: PortfolioWork[];
  skills: CapabilityRow[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  contacts: ContactChannel[];
}

/**
 * Returns fallback data from the existing static files.
 * Used during build time or when DB/Redis is unreachable.
 */
function getStaticFallbackData(): DynamicPortfolioData {
  return {
    profile: {
      ...STUDIO_PROFILE,
      narrativeParagraphs: [...STUDIO_PROFILE.narrativeParagraphs],
      showAvailability: true,
      showContact: true,
    },
    works: [...PORTFOLIO_WORKS],
    skills: [...CAPABILITY_ROWS],
    experience: [...EXPERIENCE_ENTRIES],
    education: [...EDUCATION_ENTRIES],
    contacts: [...CONTACT_CHANNELS],
  };
}

/**
 * Query all portfolio data from PostgreSQL.
 */
async function fetchPortfolioFromDb(): Promise<DynamicPortfolioData> {
  const [
    profileRows,
    projectRows,
    skillRows,
    expRows,
    eduRows,
    contactRows,
    allMedia,
  ] = await Promise.all([
    db.select().from(siteProfile).where(eq(siteProfile.id, 1)).limit(1),
    db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder)),
    db.select().from(skills).orderBy(asc(skills.sortOrder)),
    db.select().from(experience).orderBy(asc(experience.sortOrder)),
    db.select().from(education).orderBy(asc(education.sortOrder)),
    db.select().from(contactChannels).where(eq(contactChannels.visible, true)).orderBy(asc(contactChannels.sortOrder)),
    db.select().from(mediaAssets),
  ]);

  const mediaMap = new Map(allMedia.map((m) => [m.id, m]));

  // Fall back to static defaults if DB tables are empty
  const dbProfile = profileRows[0];
  const portraitMedia = dbProfile?.portraitAssetId ? mediaMap.get(dbProfile.portraitAssetId) : null;
  const cvMedia = dbProfile?.cvAssetId ? mediaMap.get(dbProfile.cvAssetId) : null;

  const profile = dbProfile
    ? {
        name: dbProfile.name,
        monogram: dbProfile.monogram,
        disciplines: dbProfile.disciplines,
        location: dbProfile.location,
        timezone: dbProfile.timezone,
        availability: dbProfile.availability,
        portraitSrc: portraitMedia?.url || STUDIO_PROFILE.portraitSrc,
        portraitAlt: dbProfile.portraitAlt,
        portraitPlaque: dbProfile.portraitPlaque,
        heroLead: dbProfile.heroLead,
        heroSpecs: dbProfile.heroSpecs,
        educationSummary: dbProfile.educationSummary,
        narrativeLead: dbProfile.narrativeLead,
        narrativeParagraphs: dbProfile.narrativeParagraphs,
        cvSummary: dbProfile.cvSummary,
        cvSoftwareLine: dbProfile.cvSoftwareLine,
        cvUrl: cvMedia?.url,
        showAvailability: dbProfile.showAvailability,
        showContact: dbProfile.showContact,
      }
    : {
        ...STUDIO_PROFILE,
        narrativeParagraphs: [...STUDIO_PROFILE.narrativeParagraphs],
        showAvailability: true,
        showContact: true,
      };

  const works: PortfolioWork[] = projectRows.length > 0
    ? projectRows.map((p) => {
        const thumb = p.thumbnailAssetId ? mediaMap.get(p.thumbnailAssetId) : null;
        const video = p.videoAssetId ? mediaMap.get(p.videoAssetId) : null;

        let mediaSrc: string | undefined;
        let mediaType: 'image' | 'video' | undefined;
        let posterSrc: string | undefined;

        if (video) {
          mediaSrc = video.url;
          mediaType = 'video';
          posterSrc = thumb?.url;
        } else if (thumb) {
          mediaSrc = thumb.url;
          mediaType = 'image';
        }

        return {
          id: p.slug,
          galleryArtworkId: p.galleryArtworkId || undefined,
          plaqueNumber: p.plaqueNumber,
          title: p.title,
          shortTitle: p.shortTitle,
          category: p.category as PortfolioWork['category'],
          aspect: p.aspect as PortfolioWork['aspect'],
          specLabel: p.specLabel,
          year: p.year,
          duration: p.duration || undefined,
          accentColor: p.accentColor,
          platePreset: p.platePreset as PortfolioWork['platePreset'],
          inspectionMode: p.inspectionMode as PortfolioWork['inspectionMode'],
          desc: p.description,
          curatorNote: p.curatorNote,
          tools: p.tools,
          deliverables: p.deliverables,
          mediaSrc,
          mediaType,
          posterSrc,
        };
      })
    : [...PORTFOLIO_WORKS];

  const skillsData: CapabilityRow[] = skillRows.length > 0
    ? skillRows.map((s) => ({
        code: s.code,
        title: s.title,
        summary: s.summary,
        tools: s.tools,
      }))
    : [...CAPABILITY_ROWS];

  const experienceData: ExperienceEntry[] = expRows.length > 0
    ? expRows.map((e) => ({
        period: e.period,
        role: e.role,
        organization: e.organization,
        location: e.location,
        highlights: e.highlights,
      }))
    : [...EXPERIENCE_ENTRIES];

  const educationData: EducationEntry[] = eduRows.length > 0
    ? eduRows.map((e) => ({
        period: e.period,
        degree: e.degree,
        institution: e.institution,
        location: e.location,
        focus: e.focus,
      }))
    : [...EDUCATION_ENTRIES];

  const contactsData: ContactChannel[] = contactRows.length > 0
    ? contactRows.map((c) => ({
        id: c.channelId,
        label: c.label,
        value: c.value,
        href: c.href,
        copyValue: c.copyValue,
        external: c.external,
        badge: c.badge || undefined,
      }))
    : [...CONTACT_CHANNELS];

  return {
    profile,
    works,
    skills: skillsData,
    experience: experienceData,
    education: educationData,
    contacts: contactsData,
  };
}

/**
 * Main data fetcher for the public frontend.
 * Combines Redis read-through caching with DB queries and safe static fallbacks.
 */
export async function getPortfolioData(): Promise<DynamicPortfolioData> {
  try {
    return await cachedJson(
      CACHE_KEYS.portfolio,
      CACHE_TTL.portfolio,
      fetchPortfolioFromDb
    );
  } catch (err) {
    // If DB or Redis fails (e.g. during build without services running),
    // gracefully fall back to static data without crashing.
    console.warn('[getPortfolioData] Falling back to static data:', (err as Error).message);
    return getStaticFallbackData();
  }
}
