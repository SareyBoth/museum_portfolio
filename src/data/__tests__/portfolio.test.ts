import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  DEFAULT_WORK_FILTER,
  PORTFOLIO_WORKS,
  PORTAL_NAV_ITEMS,
  STUDIO_PROFILE,
  WORK_CATEGORIES,
  filterWorksByCategory,
  getLinkedGalleryArtwork,
  shouldReverseScrollToGallery,
} from '../portfolio.ts';
import { GALLERY_ARTWORKS } from '../gallery.ts';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TEST_DIR, '../../..');

describe('portfolio data contract', () => {
  it('exposes the 5 primary navigation items in canonical order', () => {
    assert.deepEqual(
      PORTAL_NAV_ITEMS.map((item) => item.label),
      ['Projects', 'About', 'Skills', 'Experience', 'Contact / CV']
    );
  });

  it('keeps all 8 portfolio works with unique IDs, plaques, valid aspect ratios, and deliverables', () => {
    assert.equal(PORTFOLIO_WORKS.length, 8);
    assert.equal(new Set(PORTFOLIO_WORKS.map((work) => work.id)).size, 8);
    assert.equal(new Set(PORTFOLIO_WORKS.map((work) => work.plaqueNumber)).size, 8);
    for (const work of PORTFOLIO_WORKS) {
      assert.ok(work.aspect === '9:16' || work.aspect === '16:9');
      assert.ok(work.deliverables.length > 0);
      assert.ok(work.tools.length > 0);
      assert.ok(work.platePreset.length > 0);
    }
  });

  it('links all 6 3D museum gallery frames to corresponding portfolio works', () => {
    assert.equal(GALLERY_ARTWORKS.length, 6);
    for (const artwork of GALLERY_ARTWORKS) {
      const matched = PORTFOLIO_WORKS.find((work) => work.galleryArtworkId === artwork.id);
      assert.ok(matched, `Expected a portfolio work linked to 3D frame ${artwork.id}`);
      assert.equal(getLinkedGalleryArtwork(matched, GALLERY_ARTWORKS)?.id, artwork.id);
    }
  });

  it('exposes binary Video and Photo work filter tabs defaulting to Video', () => {
    assert.deepEqual([...WORK_CATEGORIES], ['Video', 'Photo']);
    assert.equal(DEFAULT_WORK_FILTER, 'Video');
  });

  it('filters works into Video and Photo groups covering all 8 works without duplicates or drops', () => {
    const videos = filterWorksByCategory(PORTFOLIO_WORKS, 'Video');
    const photos = filterWorksByCategory(PORTFOLIO_WORKS, 'Photo');

    assert.deepEqual(
      videos.map((work) => work.id),
      ['p-02', 'p-04', 'p-06']
    );
    assert.ok(videos.every((work) => work.category === 'Video Edits'));

    assert.deepEqual(
      photos.map((work) => work.id),
      ['p-01', 'p-03', 'p-05', 'p-08', 'p-07']
    );
    assert.ok(
      photos.every(
        (work) => work.category === 'Poster Design' || work.category === 'Photo Retouching'
      )
    );

    const combinedIds = [...videos, ...photos].map((work) => work.id);
    assert.equal(combinedIds.length, PORTFOLIO_WORKS.length);
    assert.equal(new Set(combinedIds).size, PORTFOLIO_WORKS.length);
    for (const work of PORTFOLIO_WORKS) {
      assert.ok(combinedIds.includes(work.id), `Missing work ${work.id} from Video + Photo filters`);
    }
  });

  it('exposes studio portrait metadata and backing image asset on disk', () => {
    assert.equal(STUDIO_PROFILE.portraitSrc, '/media/profile-portrait.jpg');
    assert.ok(STUDIO_PROFILE.portraitAlt.trim().length > 0);
    assert.ok(STUDIO_PROFILE.portraitPlaque.trim().length > 0);

    const portraitPath = path.join(
      PROJECT_ROOT,
      'public',
      STUDIO_PROFILE.portraitSrc.replace(/^\/+/, '')
    );
    assert.equal(existsSync(portraitPath), true, `Expected portrait asset at ${portraitPath}`);
    assert.ok(statSync(portraitPath).size > 0);
  });

  it('preserves authentic Phnom Penh studio identity without unrelated IT noise', () => {
    assert.equal(STUDIO_PROFILE.name, 'SareyBoth');
    assert.match(STUDIO_PROFILE.location, /Phnom Penh/i);
  });
});

describe('portal reverse scroll guard', () => {
  it('triggers reverse scroll only at top of container with upward wheel intent and no open dialog', () => {
    assert.equal(shouldReverseScrollToGallery(0, -25, false), true);
    assert.equal(shouldReverseScrollToGallery(0, -20, false), true);
    assert.equal(shouldReverseScrollToGallery(0, -6, false), false);
    assert.equal(shouldReverseScrollToGallery(42, -30, false), false);
    assert.equal(shouldReverseScrollToGallery(0, -30, true), false);
    assert.equal(shouldReverseScrollToGallery(0, 25, false), false);
  });
});
