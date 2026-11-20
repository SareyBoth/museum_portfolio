import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  serial,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core';

// --- Enums ---

export const mediaKindEnum = pgEnum('media_kind', ['image', 'video', 'cv']);

export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'read',
  'replied',
  'archived',
]);

// --- Admin Users (single-owner) ---

export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Admin Sessions ---

export const adminSessions = pgTable('admin_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => adminUsers.id, { onDelete: 'cascade' })
    .notNull(),
  tokenHash: varchar('token_hash', { length: 64 }).notNull().unique(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Media Assets (R2) ---

export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 512 }).notNull().unique(),
  url: text('url').notNull(),
  kind: mediaKindEnum('kind').notNull(),
  folder: varchar('folder', { length: 255 }),
  originalFilename: varchar('original_filename', { length: 512 }),
  mimeType: varchar('mime_type', { length: 128 }).notNull(),
  sizeBytes: integer('size_bytes'),
  width: integer('width'),
  height: integer('height'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Site Profile (singleton id=1) ---

export const siteProfile = pgTable('site_profile', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  monogram: varchar('monogram', { length: 10 }).notNull(),
  disciplines: text('disciplines').notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  timezone: varchar('timezone', { length: 100 }).notNull(),
  availability: text('availability').notNull(),
  portraitAssetId: integer('portrait_asset_id').references(() => mediaAssets.id, {
    onDelete: 'set null',
  }),
  portraitAlt: text('portrait_alt').notNull(),
  portraitPlaque: varchar('portrait_plaque', { length: 255 }).notNull(),
  heroLead: text('hero_lead').notNull(),
  heroSpecs: varchar('hero_specs', { length: 255 }).notNull(),
  educationSummary: text('education_summary').notNull(),
  narrativeLead: text('narrative_lead').notNull(),
  narrativeParagraphs: text('narrative_paragraphs').array().notNull(),
  cvAssetId: integer('cv_asset_id').references(() => mediaAssets.id, {
    onDelete: 'set null',
  }),
  cvSummary: text('cv_summary').notNull(),
  cvSoftwareLine: text('cv_software_line').notNull(),
  footerCopy: text('footer_copy'),
  showAvailability: boolean('show_availability').default(true).notNull(),
  showContact: boolean('show_contact').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Contact Channels ---

export const contactChannels = pgTable('contact_channels', {
  id: serial('id').primaryKey(),
  channelId: varchar('channel_id', { length: 50 }).notNull().unique(),
  label: varchar('label', { length: 100 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  href: text('href').notNull(),
  copyValue: varchar('copy_value', { length: 255 }).notNull(),
  external: boolean('external').default(false).notNull(),
  badge: varchar('badge', { length: 20 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  visible: boolean('visible').default(true).notNull(),
});

// --- Projects / Works ---

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  galleryArtworkId: varchar('gallery_artwork_id', { length: 50 }),
  plaqueNumber: varchar('plaque_number', { length: 20 }).notNull(),
  title: text('title').notNull(),
  shortTitle: varchar('short_title', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  aspect: varchar('aspect', { length: 10 }).notNull(),
  specLabel: varchar('spec_label', { length: 100 }).notNull(),
  year: varchar('year', { length: 10 }).notNull(),
  duration: varchar('duration', { length: 20 }),
  accentColor: varchar('accent_color', { length: 20 }).notNull(),
  platePreset: varchar('plate_preset', { length: 50 }).notNull(),
  inspectionMode: varchar('inspection_mode', { length: 30 }).notNull(),
  description: text('description').notNull(),
  curatorNote: text('curator_note').notNull(),
  tools: text('tools').array().notNull(),
  deliverables: text('deliverables').notNull(),
  thumbnailAssetId: integer('thumbnail_asset_id').references(() => mediaAssets.id, {
    onDelete: 'set null',
  }),
  videoAssetId: integer('video_asset_id').references(() => mediaAssets.id, {
    onDelete: 'set null',
  }),
  externalVideoUrl: text('external_video_url'),
  published: boolean('published').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Skills / Capability Rows ---

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  summary: text('summary').notNull(),
  tools: text('tools').array().notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Experience ---

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  period: varchar('period', { length: 50 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  organization: varchar('organization', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  highlights: text('highlights').array().notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Education ---

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  period: varchar('period', { length: 50 }).notNull(),
  degree: text('degree').notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }).notNull(),
  focus: text('focus').notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// --- Contact Inquiries ---

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  service: varchar('service', { length: 255 }),
  message: text('message').notNull(),
  status: inquiryStatusEnum('status').default('new').notNull(),
  adminNotes: text('admin_notes'),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
