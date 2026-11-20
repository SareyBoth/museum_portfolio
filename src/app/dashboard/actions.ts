'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin, changeAdminPassword, revokeOtherSessions } from '@/lib/auth';
import { db } from '@/db';
import {
  siteProfile,
  projects,
  skills,
  experience,
  education,
  contactInquiries,
  adminSessions,
} from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { invalidatePortfolioCache, CACHE_KEYS } from '@/lib/cache';
import { redis } from '@/lib/redis';
import { z } from 'zod';

async function bustCache() {
  await invalidatePortfolioCache();
  try {
    revalidatePath('/');
    revalidatePath('/dashboard');
  } catch {
    // non-fatal
  }
}

// --- Profile Actions ---

const profileSchema = z.object({
  name: z.string().min(1).max(255),
  monogram: z.string().min(1).max(10),
  disciplines: z.string().min(1),
  location: z.string().min(1).max(255),
  timezone: z.string().min(1).max(100),
  availability: z.string().min(1),
  portraitAssetId: z.number().nullable().optional(),
  portraitAlt: z.string().min(1),
  portraitPlaque: z.string().min(1).max(255),
  heroLead: z.string().min(1),
  heroSpecs: z.string().min(1).max(255),
  educationSummary: z.string().min(1),
  narrativeLead: z.string().min(1),
  narrativeParagraphs: z.array(z.string()),
  cvAssetId: z.number().nullable().optional(),
  cvSummary: z.string().min(1),
  cvSoftwareLine: z.string().min(1),
  showAvailability: z.boolean().default(true),
  showContact: z.boolean().default(true),
});

export async function updateProfileAction(data: z.infer<typeof profileSchema>) {
  await requireAdmin();
  const valid = profileSchema.parse(data);

  const [existing] = await db.select().from(siteProfile).where(eq(siteProfile.id, 1)).limit(1);

  if (existing) {
    await db
      .update(siteProfile)
      .set({ ...valid, updatedAt: new Date() })
      .where(eq(siteProfile.id, 1));
  } else {
    await db.insert(siteProfile).values({ id: 1, ...valid });
  }

  await bustCache();
  return { ok: true };
}

// --- Project Actions ---

const projectSchema = z.object({
  slug: z.string().min(1).max(100),
  galleryArtworkId: z.string().max(50).nullable().optional(),
  plaqueNumber: z.string().min(1).max(20),
  title: z.string().min(1),
  shortTitle: z.string().min(1).max(100),
  category: z.string().min(1).max(50),
  aspect: z.enum(['16:9', '9:16']),
  specLabel: z.string().min(1).max(100),
  year: z.string().min(1).max(10),
  duration: z.string().max(20).nullable().optional(),
  accentColor: z.string().min(1).max(20),
  platePreset: z.string().min(1).max(50),
  inspectionMode: z.string().min(1).max(30),
  description: z.string().min(1),
  curatorNote: z.string().min(1),
  tools: z.array(z.string()),
  deliverables: z.string().min(1),
  thumbnailAssetId: z.number().nullable().optional(),
  videoAssetId: z.number().nullable().optional(),
  externalVideoUrl: z.string().url().nullable().optional(),
  published: z.boolean().default(true),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export async function createProjectAction(data: z.infer<typeof projectSchema>) {
  await requireAdmin();
  const valid = projectSchema.parse(data);
  const [created] = await db.insert(projects).values(valid).returning();
  await bustCache();
  return { ok: true, project: created };
}

export async function updateProjectAction(id: number, data: Partial<z.infer<typeof projectSchema>>) {
  await requireAdmin();
  const valid = projectSchema.partial().parse(data);
  await db
    .update(projects)
    .set({ ...valid, updatedAt: new Date() })
    .where(eq(projects.id, id));
  await bustCache();
  return { ok: true };
}

export async function deleteProjectAction(id: number) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  await bustCache();
  return { ok: true };
}

// --- Skills Actions ---

const skillSchema = z.object({
  code: z.string().min(1).max(10),
  title: z.string().min(1).max(100),
  summary: z.string().min(1),
  tools: z.array(z.string()),
  sortOrder: z.number().int().default(0),
});

export async function createSkillAction(data: z.infer<typeof skillSchema>) {
  await requireAdmin();
  const valid = skillSchema.parse(data);
  const [created] = await db.insert(skills).values(valid).returning();
  await bustCache();
  return { ok: true, skill: created };
}

export async function updateSkillAction(id: number, data: Partial<z.infer<typeof skillSchema>>) {
  await requireAdmin();
  const valid = skillSchema.partial().parse(data);
  await db
    .update(skills)
    .set({ ...valid, updatedAt: new Date() })
    .where(eq(skills.id, id));
  await bustCache();
  return { ok: true };
}

export async function deleteSkillAction(id: number) {
  await requireAdmin();
  await db.delete(skills).where(eq(skills.id, id));
  await bustCache();
  return { ok: true };
}

// --- Experience Actions ---

const expSchema = z.object({
  period: z.string().min(1).max(50),
  role: z.string().min(1).max(255),
  organization: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  highlights: z.array(z.string()),
  sortOrder: z.number().int().default(0),
});

export async function createExperienceAction(data: z.infer<typeof expSchema>) {
  await requireAdmin();
  const valid = expSchema.parse(data);
  const [created] = await db.insert(experience).values(valid).returning();
  await bustCache();
  return { ok: true, experience: created };
}

export async function updateExperienceAction(id: number, data: Partial<z.infer<typeof expSchema>>) {
  await requireAdmin();
  const valid = expSchema.partial().parse(data);
  await db
    .update(experience)
    .set({ ...valid, updatedAt: new Date() })
    .where(eq(experience.id, id));
  await bustCache();
  return { ok: true };
}

export async function deleteExperienceAction(id: number) {
  await requireAdmin();
  await db.delete(experience).where(eq(experience.id, id));
  await bustCache();
  return { ok: true };
}

// --- Education Actions ---

const eduSchema = z.object({
  period: z.string().min(1).max(50),
  degree: z.string().min(1),
  institution: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  focus: z.string().min(1),
  sortOrder: z.number().int().default(0),
});

export async function createEducationAction(data: z.infer<typeof eduSchema>) {
  await requireAdmin();
  const valid = eduSchema.parse(data);
  const [created] = await db.insert(education).values(valid).returning();
  await bustCache();
  return { ok: true, education: created };
}

export async function updateEducationAction(id: number, data: Partial<z.infer<typeof eduSchema>>) {
  await requireAdmin();
  const valid = eduSchema.partial().parse(data);
  await db
    .update(education)
    .set({ ...valid, updatedAt: new Date() })
    .where(eq(education.id, id));
  await bustCache();
  return { ok: true };
}

export async function deleteEducationAction(id: number) {
  await requireAdmin();
  await db.delete(education).where(eq(education.id, id));
  await bustCache();
  return { ok: true };
}

// --- Contact Inquiry Actions ---

export async function updateInquiryStatusAction(
  id: number,
  status: 'new' | 'read' | 'replied' | 'archived'
) {
  await requireAdmin();
  await db
    .update(contactInquiries)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactInquiries.id, id));
  revalidatePath('/dashboard/inquiries');
  return { ok: true };
}

export async function updateInquiryNotesAction(id: number, adminNotes: string) {
  await requireAdmin();
  const validNotes = z.string().max(5000).parse(adminNotes);
  await db
    .update(contactInquiries)
    .set({ adminNotes: validNotes, updatedAt: new Date() })
    .where(eq(contactInquiries.id, id));
  revalidatePath('/dashboard/inquiries');
  return { ok: true };
}

export async function deleteInquiryAction(id: number) {
  await requireAdmin();
  await db.delete(contactInquiries).where(eq(contactInquiries.id, id));
  revalidatePath('/dashboard/inquiries');
  return { ok: true };
}

// --- Settings & Maintenance Actions ---

export async function purgeCacheAction() {
  await requireAdmin();
  await bustCache();
  return { ok: true };
}

export async function changePasswordAction(oldPass: string, newPass: string) {
  const admin = await requireAdmin();
  const success = await changeAdminPassword(admin.id, oldPass, newPass);
  if (!success) {
    throw new Error('Incorrect current password');
  }
  return { ok: true };
}

export async function revokeSessionAction(sessionId: number) {
  const admin = await requireAdmin();
  const [session] = await db
    .select({ id: adminSessions.id, tokenHash: adminSessions.tokenHash })
    .from(adminSessions)
    .where(and(eq(adminSessions.id, sessionId), eq(adminSessions.userId, admin.id)))
    .limit(1);

  if (session) {
    await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
    try {
      await redis.del(CACHE_KEYS.session(session.tokenHash));
    } catch {
      // non-fatal
    }
  }

  revalidatePath('/dashboard/settings');
  return { ok: true };
}

export async function revokeOtherSessionsAction() {
  await requireAdmin();
  const count = await revokeOtherSessions();
  revalidatePath('/dashboard/settings');
  return { ok: true, revokedCount: count };
}
