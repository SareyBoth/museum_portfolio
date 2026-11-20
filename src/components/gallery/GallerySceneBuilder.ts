import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ArtworkData, GALLERY_ARTWORKS, PORTAL_DATA, PortalData } from '@/data/gallery';

export interface InteractiveFrame {
  id: string;
  artwork: ArtworkData;
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  haloMaterial: THREE.MeshBasicMaterial;
  artMaterial: THREE.MeshStandardMaterial;
  baseEmissiveIntensity: number;
}

export interface InteractivePortal {
  id: string;
  portalData: PortalData;
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  haloMaterial: THREE.MeshBasicMaterial;
  artMaterial: THREE.MeshStandardMaterial;
}

export interface GallerySceneData {
  scene: THREE.Scene;
  atriumGroup: THREE.Group;
  interactiveFrames: InteractiveFrame[];
  portalFrame: InteractivePortal;
  dustPoints: THREE.Points;
  sunLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  leftWallLight: THREE.PointLight;
  rightWallLight: THREE.PointLight;
  cyanWallLight?: THREE.PointLight;
  amberWallLight?: THREE.PointLight;
  textures: THREE.Texture[];
  materials: THREE.Material[];
  geometries: THREE.BufferGeometry[];
  pmremEnvTexture: THREE.Texture | null;
}

// ----------------------------------------------------------------------
// Procedural Canvas Texture Generators
// ----------------------------------------------------------------------

/**
 * Polished architectural concrete slab with subtle expansion-joint grid lines.
 */
function createFloorConcreteTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base neutral cool grey
  ctx.fillStyle = '#1c1d1f';
  ctx.fillRect(0, 0, size, size);

  // Subtle tonal noise via speckles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(Math.random() * size, Math.random() * size, 2, 2);
  }

  // Expansion joint grid lines (256px intervals)
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(10, 11, 13, 0.85)';
  const step = 256;
  for (let x = 0; x <= size; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }
  for (let y = 0; y <= size; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Soft concrete polish highlight sheen
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.00)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.04)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 5);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Raw board-formed architectural concrete for beams and ceiling coffering.
 */
function createBoardFormedConcreteTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base raw concrete
  ctx.fillStyle = '#313337';
  ctx.fillRect(0, 0, width, height);

  // Horizontal wood plank bands (16 bands)
  const bands = 16;
  const bandHeight = height / bands;
  for (let i = 0; i < bands; i++) {
    const y = i * bandHeight;
    const bandTone = (i % 2 === 0 ? 4 : -4) + (Math.random() - 0.5) * 8;
    ctx.fillStyle = `rgba(${48 + bandTone}, ${50 + bandTone}, ${54 + bandTone}, 0.95)`;
    ctx.fillRect(0, y, width, bandHeight);

    // Wood grain lines inside each plank
    ctx.strokeStyle = 'rgba(20, 21, 24, 0.15)';
    ctx.lineWidth = 1;
    for (let g = 0; g < 4; g++) {
      const gy = y + 4 + g * (bandHeight / 4) + (Math.random() - 0.5) * 2;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    // Deep plank joint groove
    ctx.strokeStyle = 'rgba(15, 16, 18, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    // Circular tie-rod recesses along plank seams
    const tieCols = 4;
    for (let c = 0; c < tieCols; c++) {
      const cx = (c + 0.5) * (width / tieCols);
      const cy = y + bandHeight * 0.5;

      // Outer shadow recess
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 16, 18, 0.65)';
      ctx.fill();

      // Inner tie-bolt core
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(80, 84, 90, 0.9)';
      ctx.fill();
    }
  }

  // Global concrete aggregate noise via speckles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 700; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
  for (let i = 0; i < 700; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Warm-beige porous travertine stone blocks with natural horizontal mineral veining & ashlar seams.
 * Used identically on both Left and Right walls and all 4 exhibition stands.
 */
function createTravertineTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Warm travertine stone base
  ctx.fillStyle = '#b8aa94';
  ctx.fillRect(0, 0, width, height);

  // Ashlar stone block grid (6 rows x 3 cols)
  const rows = 6;
  const cols = 3;
  const rowH = height / rows;
  const colW = width / cols;

  for (let r = 0; r < rows; r++) {
    const colOffset = (r % 2) * (colW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const bx = c * colW + colOffset;
      const by = r * rowH;

      // Subtle natural color variations between blocks
      const blockVar = (Math.random() - 0.5) * 14;
      ctx.fillStyle = `rgb(${190 + blockVar}, ${176 + blockVar}, ${154 + blockVar})`;
      ctx.fillRect(bx + 1, by + 1, colW - 2, rowH - 2);

      // Horizontal porous mineral veins
      ctx.strokeStyle = 'rgba(145, 130, 110, 0.4)';
      ctx.lineWidth = 1.5;
      for (let v = 0; v < 8; v++) {
        const vy = by + (v + 1) * (rowH / 9) + (Math.random() - 0.5) * 4;
        ctx.beginPath();
        ctx.moveTo(bx + 2, vy);
        // Slightly wavy mineral line
        for (let x = bx + 2; x <= bx + colW - 2; x += 40) {
          ctx.lineTo(x, vy + Math.sin(x * 0.05) * 2 + (Math.random() - 0.5) * 2);
        }
        ctx.stroke();
      }

      // Porous micro-pits
      ctx.fillStyle = 'rgba(120, 105, 88, 0.35)';
      for (let p = 0; p < 25; p++) {
        const px = bx + 6 + Math.random() * (colW - 12);
        const py = by + 6 + Math.random() * (rowH - 12);
        const pw = 3 + Math.random() * 8;
        const ph = 1 + Math.random() * 2.5;
        ctx.fillRect(px, py, pw, ph);
      }

      // Mortar seam boundary
      ctx.strokeStyle = 'rgba(92, 82, 70, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(bx, by, colW, rowH);
    }
  }

  // Global stone grain noise via speckles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }
  ctx.fillStyle = 'rgba(100, 85, 70, 0.04)';
  for (let i = 0; i < 600; i++) {
    ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Editorial High-DPI Poster Generator:
 * - 900x1600 for left portrait 9:16 frames
 * - 1600x900 for right landscape 16:9 frames
 */
function createArtworkPosterTexture(artwork: ArtworkData): THREE.CanvasTexture {
  const isPortrait = artwork.aspectRatio === '9:16';
  const width = isPortrait ? 900 : 1600;
  const height = isPortrait ? 1600 : 900;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Clean architectural dark graphite canvas
  ctx.fillStyle = '#0a0b0e';
  ctx.fillRect(0, 0, width, height);

  // Subtle spatial coordinate background grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = isPortrait ? 60 : 80;
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Editorial Margins
  const pad = isPortrait ? 70 : 80;

  // Header Bar
  ctx.font = '600 18px "Geist Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillText(`SAREYBOTH // ARCHIVE [0${artwork.index + 1}/06]`, pad, pad);
  ctx.textAlign = 'right';
  ctx.fillText(`${artwork.year} // ${artwork.aspectRatio}`, width - pad, pad);
  ctx.textAlign = 'left';

  // Accent Line under header
  ctx.strokeStyle = artwork.accentColor;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(pad, pad + 20);
  ctx.lineTo(width - pad, pad + 20);
  ctx.stroke();

  // Central Visual Hero Graphic
  const centerX = width / 2;
  const centerY = isPortrait ? height * 0.48 : height * 0.52;

  ctx.save();
  ctx.translate(centerX, centerY);

  if (artwork.wall === 'left') {
    // Vertical Poster Design & Print Graphics (9:16)
    if (artwork.index === 0) {
      // 01 / 06 — Midnight Film Festival — Key Art Poster
      // Concentric festival film reel rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -60, 220, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = artwork.accentColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, -60, 150, 0, Math.PI * 2);
      ctx.stroke();

      // Film reel radial spokes
      for (let s = 0; s < 8; s++) {
        const ang = (s * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * 40, -60 + Math.sin(ang) * 40);
        ctx.lineTo(Math.cos(ang) * 150, -60 + Math.sin(ang) * 150);
        ctx.stroke();
      }

      // Center core
      ctx.fillStyle = artwork.accentColor;
      ctx.beginPath();
      ctx.arc(0, -60, 28, 0, Math.PI * 2);
      ctx.fill();

      // Bold Typography Block
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 52px "Geist", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MIDNIGHT', 0, 160);
      ctx.fillText('FILM FESTIVAL', 0, 220);

      ctx.fillStyle = artwork.accentColor;
      ctx.font = '600 18px "Geist Mono", monospace';
      ctx.fillText('★ OFFICIAL SELECTION 2025 ★', 0, 270);
      ctx.textAlign = 'left';
    } else if (artwork.index === 1) {
      // 02 / 06 — Monolith Sound Tour — Editorial Print Series
      // Acoustic frequency spectrum bars
      const barCount = 28;
      const totalW = width * 0.72;
      const bWidth = totalW / barCount - 6;
      for (let b = 0; b < barCount; b++) {
        const bx = -totalW / 2 + b * (bWidth + 6);
        const bHeight = Math.sin((b / barCount) * Math.PI) * 260 + Math.sin(b * 0.8) * 40 + 30;
        ctx.fillStyle = b % 3 === 0 ? artwork.accentColor : 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(bx, -bHeight / 2 - 30, bWidth, bHeight);
      }

      // Center Horizontal Line & Typography
      ctx.strokeStyle = artwork.accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-width * 0.38, 150);
      ctx.lineTo(width * 0.38, 150);
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 48px "Geist", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MONOLITH SOUND', 0, 210);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '600 16px "Geist Mono", monospace';
      ctx.fillText('LIMITED RISOGRAPH // PRINT EDITION', 0, 255);
      ctx.textAlign = 'left';
    } else {
      // 03 / 06 — Noir Cinema Retrospective — Vertical Key Art
      // Chiaroscuro high-contrast diagonal shadows
      for (let p = 0; p < 6; p++) {
        const py = (p - 2.5) * 85;
        ctx.fillStyle = p === 2 ? artwork.accentColor : `rgba(255, 255, 255, ${0.08 + p * 0.05})`;
        ctx.beginPath();
        ctx.moveTo(-width * 0.35, py - 60);
        ctx.lineTo(width * 0.35, py + 20);
        ctx.lineTo(width * 0.35, py + 70);
        ctx.lineTo(-width * 0.35, py - 10);
        ctx.closePath();
        ctx.fill();
      }

      // 35mm Film Sprocket perforations on sides
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let s = -4; s <= 4; s++) {
        const sy = s * 60;
        ctx.fillRect(-width * 0.35, sy - 12, 18, 24);
        ctx.fillRect(width * 0.35 - 18, sy - 12, 18, 24);
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '800 44px "Geist", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NOIR CINEMA', 0, 200);

      ctx.fillStyle = artwork.accentColor;
      ctx.font = '600 16px "Geist Mono", monospace';
      ctx.fillText('35MM ARCHIVE RETROSPECTIVE', 0, 245);
      ctx.textAlign = 'left';
    }
  } else {
    // Horizontal Landscape Video Editing & Retouching Graphics (16:9)
    if (artwork.index === 3) {
      // 04 / 06 — Director's Cut Showreel — Commercial & Music Video Edit
      // Widescreen 2.39:1 Cinema Letterbox preview frame
      const boxW = width * 0.74;
      const boxH = boxW / 2.39;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-boxW / 2, -boxH / 2 - 40, boxW, boxH);

      // NLE Video & Audio Timeline Tracks in lower half
      const tY = 70;
      const tW = width * 0.74;
      ctx.fillStyle = 'rgba(20, 22, 28, 0.9)';
      ctx.fillRect(-tW / 2, tY, tW, 90);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(-tW / 2, tY, tW, 90);

      // Track V1 (Video clips)
      const clipWidths = [180, 260, 140, 220, 190];
      let cx = -tW / 2 + 10;
      clipWidths.forEach((cw, i) => {
        ctx.fillStyle = i === 1 ? artwork.accentColor : 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(cx, tY + 8, cw, 34);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeRect(cx, tY + 8, cw, 34);
        cx += cw + 6;
      });

      // Track A1 (Audio waveforms)
      cx = -tW / 2 + 10;
      clipWidths.forEach((cw) => {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.fillRect(cx, tY + 48, cw, 34);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.strokeRect(cx, tY + 48, cw, 34);

        // Waveform line inside audio block
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let wx = 0; wx < cw; wx += 6) {
          const amp = Math.sin(wx * 0.3) * 12;
          ctx.moveTo(cx + wx, tY + 65 - amp);
          ctx.lineTo(cx + wx, tY + 65 + amp);
        }
        ctx.stroke();
        cx += cw + 6;
      });

      // Red Playhead Line
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-40, tY - 15);
      ctx.lineTo(-40, tY + 95);
      ctx.stroke();

      // Timecode
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '600 16px "Geist Mono", monospace';
      ctx.fillText('TIMECODE: 01:24:18:04 // 24 FPS · 4K DCI', -tW / 2 + 10, tY - 18);
    } else if (artwork.index === 4) {
      // 05 / 06 — Anamorphic Lookbook — Color Grading & LUT Breakdown
      // Split Before (Log) / After (Rec.709 35mm Look)
      const fW = width * 0.74;
      const fH = 260;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(-fW / 2, -fH / 2, fW, fH);

      // Left half: Low-contrast Flat Log
      ctx.fillStyle = '#1c1e24';
      ctx.fillRect(-fW / 2, -fH / 2, fW / 2, fH);

      // Right half: High-contrast 35mm Graded
      const gradedGrad = ctx.createLinearGradient(0, -fH / 2, fW / 2, fH / 2);
      gradedGrad.addColorStop(0, '#091524');
      gradedGrad.addColorStop(0.6, '#382212');
      gradedGrad.addColorStop(1, '#1a0d08');
      ctx.fillStyle = gradedGrad;
      ctx.fillRect(0, -fH / 2, fW / 2, fH);

      // Vertical Split Line
      ctx.strokeStyle = artwork.accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -fH / 2);
      ctx.lineTo(0, fH / 2);
      ctx.stroke();

      // Labels on each side
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '600 14px "Geist Mono", monospace';
      ctx.fillText('CAMERA LOG [RAW]', -fW / 2 + 20, -fH / 2 + 30);
      ctx.fillStyle = artwork.accentColor;
      ctx.fillText('REC.709 35MM [GRADED]', 20, -fH / 2 + 30);

      // Waveform / Scope Overlay Graphic in lower right
      const scW = 200;
      const scH = 80;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(fW / 2 - scW - 20, fH / 2 - scH - 20, scW, scH);
      ctx.strokeStyle = artwork.accentColor;
      ctx.strokeRect(fW / 2 - scW - 20, fH / 2 - scH - 20, scW, scH);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let sx = 0; sx < scW - 20; sx += 4) {
        const sy = Math.sin(sx * 0.15) * 24 + Math.cos(sx * 0.08) * 12;
        ctx.moveTo(fW / 2 - scW - 10 + sx, fH / 2 - 60 - sy);
        ctx.lineTo(fW / 2 - scW - 10 + sx, fH / 2 - 60 + sy);
      }
      ctx.stroke();
    } else {
      // 06 / 06 — Studio Editorial Campaign — High-End Photo Retouching
      // Beauty & Product Retouching Frame
      const rW = width * 0.72;
      const rH = 260;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.strokeRect(-rW / 2, -rH / 2, rW, rH);

      // Retouching Crop & Alignment Crosshairs
      const cSize = 25;
      ctx.strokeStyle = artwork.accentColor;
      ctx.lineWidth = 2;
      [
        [-rW / 2, -rH / 2],
        [rW / 2, -rH / 2],
        [-rW / 2, rH / 2],
        [rW / 2, rH / 2],
      ].forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.moveTo(cx - cSize, cy);
        ctx.lineTo(cx + cSize, cy);
        ctx.moveTo(cx, cy - cSize);
        ctx.lineTo(cx, cy + cSize);
        ctx.stroke();
      });

      // Frequency Separation Passes
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 24px "Geist", sans-serif';
      ctx.fillText('FREQUENCY SEPARATION', -rW / 2 + 40, -40);

      ctx.fillStyle = artwork.accentColor;
      ctx.font = '600 15px "Geist Mono", monospace';
      ctx.fillText('PASS 01: HIGH FREQ // TEXTURE & DETAIL RESTORATION', -rW / 2 + 40, 0);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('PASS 02: LOW FREQ  // COLOR & DYNAMIC TONE BALANCE', -rW / 2 + 40, 35);

      // Skin Tone Swatch Strip
      const swatches = ['#D4A373', '#E0A96D', '#CCA07A', '#B5835A', '#8D5B4C'];
      swatches.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(-rW / 2 + 40 + i * 50, 70, 42, 28);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.strokeRect(-rW / 2 + 40 + i * 50, 70, 42, 28);
      });
    }
  }
  ctx.restore();

  // Typography Footer
  const footerY = height - pad;
  ctx.fillStyle = '#ffffff';
  ctx.font = isPortrait ? '700 42px "Geist", sans-serif' : '700 44px "Geist", sans-serif';
  ctx.fillText(artwork.title, pad, footerY - 90);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '500 20px "Geist Mono", monospace';
  ctx.fillText(artwork.category.toUpperCase(), pad, footerY - 55);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '400 15px "Geist Mono", monospace';
  ctx.fillText(artwork.editorialSubhead, pad, footerY - 25);

  // Telemetry Stamp
  ctx.textAlign = 'right';
  ctx.fillStyle = artwork.accentColor;
  ctx.font = '600 16px "Geist Mono", monospace';
  ctx.fillText(`FRAME [0${artwork.index + 1}/06]`, width - pad, footerY - 55);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '400 14px "Geist Mono", monospace';
  ctx.fillText('CLICK TO INSPECT // DRAG TO ORBIT', width - pad, footerY - 25);
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Monumental Center OLED Back-Wall Screen Preview (1920x1080)
 */
function createPortalPreviewTexture(portal: PortalData): THREE.CanvasTexture {
  const width = 1920;
  const height = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Pure cinema OLED deep black with blue-cyan radial gradient
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, width * 0.65);
  bgGrad.addColorStop(0, '#091524');
  bgGrad.addColorStop(0.6, '#04070c');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle coordinate matrix grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  const step = 80;
  for (let x = 0; x <= width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Corner HUD brackets
  const bSize = 60;
  const bPad = 90;
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(bPad, bPad + bSize);
  ctx.lineTo(bPad, bPad);
  ctx.lineTo(bPad + bSize, bPad);
  ctx.stroke();

  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - bPad - bSize, bPad);
  ctx.lineTo(width - bPad, bPad);
  ctx.lineTo(width - bPad, bPad + bSize);
  ctx.stroke();

  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(bPad, height - bPad - bSize);
  ctx.lineTo(bPad, height - bPad);
  ctx.lineTo(bPad + bSize, height - bPad);
  ctx.stroke();

  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - bPad - bSize, height - bPad);
  ctx.lineTo(width - bPad, height - bPad);
  ctx.lineTo(width - bPad, height - bPad - bSize);
  ctx.stroke();

  // Center Hero Typography
  ctx.textAlign = 'center';

  // System Badge
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(width / 2 - 260, 260, 520, 44);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(width / 2 - 260, 260, 520, 44);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 18px "Geist Mono", monospace';
  ctx.fillText('CINEMA TIMELINE // 24 FPS · 4K DCI · 300 DPI', width / 2, 288);

  // Big Monumental Title
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 78px "Geist", sans-serif';
  ctx.fillText('SAREYBOTH', width / 2, 400);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '600 24px "Geist Mono", monospace';
  ctx.fillText('VIDEO EDITOR · PHOTO RETOUCHER · POSTER DESIGNER', width / 2, 455);

  // Subtitle / Narrative
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '400 18px "Geist", sans-serif';
  ctx.fillText(portal.tagline, width / 2, 510);

  // NLE Timeline Visualization in Center Screen
  const tlY = 570;
  const tlW = 900;
  ctx.fillStyle = 'rgba(15, 17, 23, 0.8)';
  ctx.fillRect(width / 2 - tlW / 2, tlY, tlW, 70);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.strokeRect(width / 2 - tlW / 2, tlY, tlW, 70);

  // Clips on timeline
  const clipXs = [-tlW / 2 + 10, -tlW / 2 + 230, -tlW / 2 + 480, -tlW / 2 + 700];
  const clipWs = [210, 240, 210, 190];
  const clipColors = ['#F59E0B', '#06B6D4', '#EC4899', '#10B981'];
  clipXs.forEach((cx, idx) => {
    ctx.fillStyle = `${clipColors[idx]}25`;
    ctx.fillRect(width / 2 + cx, tlY + 10, clipWs[idx], 50);
    ctx.strokeStyle = clipColors[idx];
    ctx.lineWidth = 1;
    ctx.strokeRect(width / 2 + cx, tlY + 10, clipWs[idx], 50);
  });

  // Timeline Playhead
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 20, tlY - 10);
  ctx.lineTo(width / 2 - 20, tlY + 80);
  ctx.stroke();

  // Scroll Callout Indicator
  const pillY = 740;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 280, pillY, 560, 76, 38);
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = '700 22px "Geist Mono", monospace';
  ctx.fillText('▼  SCROLL DOWN TO DIVE INTO PORTAL  ▼', width / 2, pillY + 46);

  // Bottom Telemetry
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '400 16px "Geist Mono", monospace';
  ctx.fillText('2400PX VIRTUAL RUNWAY · SENSITIVITY CALIBRATED · 60 FPS', width / 2, 890);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Circular soft particle texture for delicate daylight dust motes
 */
function createCircularParticleTexture(): THREE.CanvasTexture {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255, 245, 230, 0.9)');
    g.addColorStop(0.35, 'rgba(255, 240, 210, 0.4)');
    g.addColorStop(1, 'rgba(255, 240, 210, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

/**
 * Soft radial falloff texture for backlit frame LED halos
 */
function createHaloGradientTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 24, 64, 64, 64);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    g.addColorStop(0.5, 'rgba(255, 255, 255, 0.35)');
    g.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  return new THREE.CanvasTexture(canvas);
}

// ----------------------------------------------------------------------
// Gallery Scene Builder Implementation
// ----------------------------------------------------------------------

export function buildGalleryScene(renderer: THREE.WebGLRenderer): GallerySceneData {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060709);

  // Memory cleanup tracking
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];

  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  // 1. Studio Environment via PMREMGenerator & RoomEnvironment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const roomEnv = new RoomEnvironment();
  const pmremTarget = pmremGenerator.fromScene(roomEnv, 0.04);
  const pmremEnvTexture = pmremTarget.texture;
  scene.environment = pmremEnvTexture;
  scene.environmentIntensity = 0.35;
  roomEnv.dispose();
  pmremGenerator.dispose();

  // 2. Multi-Layered Symmetrical Architectural Lighting
  // Balanced sky/bounce hemisphere
  const hemiLight = new THREE.HemisphereLight(0x7c8ba1, 0x332b24, 1.2);
  hemiLight.position.set(0, 8, 0);
  scene.add(hemiLight);

  // Angled Skylight Key Light
  const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.45);
  sunLight.position.set(8, 15, 9);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.02;
  const shadowCam = sunLight.shadow.camera;
  shadowCam.left = -9;
  shadowCam.right = 9;
  shadowCam.top = 9;
  shadowCam.bottom = -9;
  shadowCam.near = 0.5;
  shadowCam.far = 40;
  shadowCam.updateProjectionMatrix();
  scene.add(sunLight);

  // Symmetrical Grazing Wall-Wash Accents on Both Left & Right Travertine Walls
  const leftWallLight = new THREE.PointLight(0xf59e0b, 0.95, 26, 1.1);
  leftWallLight.position.set(-4.0, 3.2, -2.5);
  scene.add(leftWallLight);

  const rightWallLight = new THREE.PointLight(0xf59e0b, 0.95, 26, 1.1);
  rightWallLight.position.set(4.0, 3.2, -2.5);
  scene.add(rightWallLight);

  // 3. Atrium Shell Geometry Hierarchy
  const atriumGroup = new THREE.Group();
  scene.add(atriumGroup);

  // Textures
  const floorTexture = createFloorConcreteTexture();
  floorTexture.anisotropy = maxAniso;
  textures.push(floorTexture);

  const concreteTexture = createBoardFormedConcreteTexture();
  concreteTexture.anisotropy = maxAniso;
  textures.push(concreteTexture);

  const travertineTexture = createTravertineTexture();
  travertineTexture.anisotropy = maxAniso;
  textures.push(travertineTexture);

  // Shared Travertine Material for both Left and Right walls and all 4 plinths
  const travertineWallMat = new THREE.MeshStandardMaterial({
    map: travertineTexture,
    roughness: 0.72,
    metalness: 0.04,
  });
  materials.push(travertineWallMat);

  // Shared Matte-Black Anodized Steel Material
  const bezelMat = new THREE.MeshStandardMaterial({
    color: 0x121417,
    roughness: 0.35,
    metalness: 0.85,
  });
  materials.push(bezelMat);

  // Floor Slab: Polished concrete slab covering X ∈ [-7.5, 7.5], Z ∈ [-14, 12] (length 26)
  const floorGeo = new THREE.BoxGeometry(15, 0.4, 26);
  geometries.push(floorGeo);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: 0.45,
    metalness: 0.08,
  });
  materials.push(floorMat);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.position.set(0, -0.2, -1);
  floorMesh.receiveShadow = true;
  atriumGroup.add(floorMesh);

  // Faint dark spatial coordinate grid floating just under the slab
  const gridHelper = new THREE.GridHelper(28, 28, 0x1f2937, 0x111827);
  gridHelper.position.set(0, -0.42, -1);
  atriumGroup.add(gridHelper);

  // LEFT WALL (X = -5.5): Exact same warm travertine as right wall, covering Z ∈ [-14, 12]
  const wallGeo = new THREE.BoxGeometry(0.5, 8.8, 26);
  geometries.push(wallGeo);
  const leftWall = new THREE.Mesh(wallGeo, travertineWallMat);
  leftWall.position.set(-5.75, 2.0, -1);
  leftWall.receiveShadow = true;
  leftWall.castShadow = true;
  atriumGroup.add(leftWall);

  // RIGHT WALL (X = +5.5): Warm-beige porous travertine stone, covering Z ∈ [-14, 12]
  const rightWall = new THREE.Mesh(wallGeo, travertineWallMat);
  rightWall.position.set(5.75, 2.0, -1);
  rightWall.receiveShadow = true;
  rightWall.castShadow = true;
  atriumGroup.add(rightWall);

  // --------------------------------------------------------------------
  // REAR WALL & NICHE: Strict Non-Overlapping Z-Depth Architecture
  // --------------------------------------------------------------------
  // 1. Continuous solid rear travertine wall spanning the full width/height at Z = -13.35
  const backWallGeo = new THREE.BoxGeometry(15.0, 8.8, 0.3);
  geometries.push(backWallGeo);
  const backWall = new THREE.Mesh(backWallGeo, travertineWallMat);
  backWall.position.set(0, 2.0, -13.35);
  backWall.receiveShadow = true;
  atriumGroup.add(backWall);

  // Inset dark steel niche liner against the solid rear wall
  const nicheLinerGeo = new THREE.BoxGeometry(6.38, 3.58, 0.02);
  geometries.push(nicheLinerGeo);
  const steelNicheMat = new THREE.MeshStandardMaterial({
    color: 0x0a0c10,
    roughness: 0.5,
    metalness: 0.8,
  });
  materials.push(steelNicheMat);
  const nicheLiner = new THREE.Mesh(nicheLinerGeo, steelNicheMat);
  nicheLiner.position.set(0, 2.15, -13.18);
  nicheLiner.receiveShadow = true;
  atriumGroup.add(nicheLiner);

  // 2. Separate non-overlapping travertine framing piers/lintel/sill around 6.4x3.6 opening at Y = 2.15
  // Spans Z = -13.20 to Z = -12.75 (depth: 0.45, center Z = -12.975)
  // Opening bounds: X ∈ [-3.2, 3.2], Y ∈ [0.35, 3.95]
  const pierDepth = 0.45;
  const pierZ = -12.975;

  // Left Pier: X ∈ [-7.5, -3.2] (width: 4.3, center X = -5.35)
  const leftPierGeo = new THREE.BoxGeometry(4.3, 8.8, pierDepth);
  geometries.push(leftPierGeo);
  const leftPier = new THREE.Mesh(leftPierGeo, travertineWallMat);
  leftPier.position.set(-5.35, 2.0, pierZ);
  leftPier.receiveShadow = true;
  leftPier.castShadow = true;
  atriumGroup.add(leftPier);

  // Right Pier: X ∈ [+3.2, +7.5] (width: 4.3, center X = +5.35)
  const rightPierGeo = new THREE.BoxGeometry(4.3, 8.8, pierDepth);
  geometries.push(rightPierGeo);
  const rightPier = new THREE.Mesh(rightPierGeo, travertineWallMat);
  rightPier.position.set(5.35, 2.0, pierZ);
  rightPier.receiveShadow = true;
  rightPier.castShadow = true;
  atriumGroup.add(rightPier);

  // Lintel (above opening): X ∈ [-3.2, +3.2], Y ∈ [3.95, 6.4] (height: 2.45, center Y = 5.175)
  const lintelGeo = new THREE.BoxGeometry(6.4, 2.45, pierDepth);
  geometries.push(lintelGeo);
  const lintel = new THREE.Mesh(lintelGeo, travertineWallMat);
  lintel.position.set(0, 5.175, pierZ);
  lintel.receiveShadow = true;
  lintel.castShadow = true;
  atriumGroup.add(lintel);

  // Sill (below opening): X ∈ [-3.2, +3.2], Y ∈ [-2.4, 0.35] (height: 2.75, center Y = -1.025)
  const sillGeo = new THREE.BoxGeometry(6.4, 2.75, pierDepth);
  geometries.push(sillGeo);
  const sill = new THREE.Mesh(sillGeo, travertineWallMat);
  sill.position.set(0, -1.025, pierZ);
  sill.receiveShadow = true;
  sill.castShadow = true;
  atriumGroup.add(sill);

  // Front Entry Wall / Framing Portico (Z = +11.5)
  const frontPillarGeo = new THREE.BoxGeometry(1.6, 8.8, 0.8);
  geometries.push(frontPillarGeo);
  const frontLeft = new THREE.Mesh(frontPillarGeo, travertineWallMat);
  frontLeft.position.set(-5.0, 2.0, 11.5);
  frontLeft.receiveShadow = true;
  atriumGroup.add(frontLeft);

  const frontRight = new THREE.Mesh(frontPillarGeo, travertineWallMat);
  frontRight.position.set(5.0, 2.0, 11.5);
  frontRight.receiveShadow = true;
  atriumGroup.add(frontRight);

  // Brutalist Skylight Coffered Ceiling (Y = 6.2, length 26 covering Z ∈ [-14, 12])
  const beamMat = new THREE.MeshStandardMaterial({
    map: concreteTexture,
    roughness: 0.88,
    metalness: 0.05,
  });
  materials.push(beamMat);

  // Longitudinal beams (along Z)
  const longBeamGeo = new THREE.BoxGeometry(0.45, 0.7, 26);
  geometries.push(longBeamGeo);
  [-4.0, -1.8, 0, 1.8, 4.0].forEach((bx) => {
    const beam = new THREE.Mesh(longBeamGeo, beamMat);
    beam.position.set(bx, 6.1, -1);
    beam.castShadow = true;
    beam.receiveShadow = true;
    atriumGroup.add(beam);
  });

  // Transverse beams (along X) forming coffers
  const transBeamGeo = new THREE.BoxGeometry(11, 0.7, 0.45);
  geometries.push(transBeamGeo);
  [-12, -8, -4, 0, 4, 8].forEach((bz) => {
    const beam = new THREE.Mesh(transBeamGeo, beamMat);
    beam.position.set(0, 6.1, bz);
    beam.castShadow = true;
    beam.receiveShadow = true;
    atriumGroup.add(beam);
  });

  // Angled Translucent Daylight Shaft Planes cutting through the ceiling
  const lightShaftGeo = new THREE.PlaneGeometry(3.5, 12);
  geometries.push(lightShaftGeo);
  const lightShaftMat = new THREE.MeshBasicMaterial({
    color: 0xfff6e9,
    transparent: true,
    opacity: 0.045,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  materials.push(lightShaftMat);

  const shaft1 = new THREE.Mesh(lightShaftGeo, lightShaftMat);
  shaft1.position.set(1.5, 3.2, -4);
  shaft1.rotation.set(0.2, 0.4, 0.6);
  atriumGroup.add(shaft1);

  const shaft2 = new THREE.Mesh(lightShaftGeo, lightShaftMat);
  shaft2.position.set(-1.0, 3.0, -8);
  shaft2.rotation.set(0.15, 0.35, 0.55);
  atriumGroup.add(shaft2);

  // Drifting Dust Motes (Soft circular particles floating across the extended hall)
  const moteTexture = createCircularParticleTexture();
  textures.push(moteTexture);

  const moteCount = 180;
  const motePositions = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    motePositions[i * 3 + 0] = (Math.random() - 0.5) * 8.0;
    motePositions[i * 3 + 1] = 0.5 + Math.random() * 4.5;
    motePositions[i * 3 + 2] = -12 + Math.random() * 22;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
  geometries.push(dustGeo);

  const dustMat = new THREE.PointsMaterial({
    map: moteTexture,
    color: 0xfff0d8,
    size: 0.12,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materials.push(dustMat);

  const dustPoints = new THREE.Points(dustGeo, dustMat);
  atriumGroup.add(dustPoints);

  // --------------------------------------------------------------------
  // 4. IDENTICAL EXHIBITION STANDS (Single shared builder function)
  // --------------------------------------------------------------------
  // Stand geometry definitions:
  // Base: height 0.08, width 0.78, depth 0.78 (recessed shadow-gap)
  // Shaft: height 1.01, width 0.86, depth 0.86
  // Top cap: height 0.06, width 0.88, depth 0.88 (top surface precisely at Y = 1.15)
  const standBaseGeo = new THREE.BoxGeometry(0.78, 0.08, 0.78);
  geometries.push(standBaseGeo);

  const standShaftGeo = new THREE.BoxGeometry(0.86, 1.01, 0.86);
  geometries.push(standShaftGeo);

  const standCapGeo = new THREE.BoxGeometry(0.88, 0.06, 0.88);
  geometries.push(standCapGeo);

  function createExhibitionStand(x: number, z: number): THREE.Group {
    const standGroup = new THREE.Group();
    standGroup.position.set(x, 0, z);

    // Recessed shadow-gap base (Y: 0.0 -> 0.08, center Y = 0.04)
    const baseMesh = new THREE.Mesh(standBaseGeo, bezelMat);
    baseMesh.position.set(0, 0.04, 0);
    baseMesh.receiveShadow = true;
    standGroup.add(baseMesh);

    // Monolithic travertine shaft (Y: 0.08 -> 1.09, center Y = 0.585)
    const shaftMesh = new THREE.Mesh(standShaftGeo, travertineWallMat);
    shaftMesh.position.set(0, 0.585, 0);
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    standGroup.add(shaftMesh);

    // Beveled travertine top cap (Y: 1.09 -> 1.15, center Y = 1.12)
    const capMesh = new THREE.Mesh(standCapGeo, travertineWallMat);
    capMesh.position.set(0, 1.12, 0);
    capMesh.castShadow = true;
    capMesh.receiveShadow = true;
    standGroup.add(capMesh);

    atriumGroup.add(standGroup);
    return standGroup;
  }

  // 4 Identical stands symmetrically placed at:
  // Back-Left: (-2.35, 0, -6.4)
  createExhibitionStand(-2.35, -6.4);
  // Back-Right: (+2.35, 0, -6.4)
  createExhibitionStand(2.35, -6.4);
  // Front-Left: (-2.35, 0, -1.8)
  createExhibitionStand(-2.35, -1.8);
  // Front-Right: (+2.35, 0, -1.8)
  createExhibitionStand(2.35, -1.8);

  // 4 Gallery Sculptures sitting atop stands at Y = 1.15 (with >= 0.005 clearance)
  // Sculpture 1: Back-Left (-2.35, -6.4) — Brushed Titanium Torus Ring
  const torusGeo = new THREE.TorusGeometry(0.28, 0.065, 32, 64);
  geometries.push(torusGeo);
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    roughness: 0.22,
    metalness: 0.95,
  });
  materials.push(titaniumMat);
  const ringMesh = new THREE.Mesh(torusGeo, titaniumMat);
  ringMesh.position.set(-2.35, 1.155 + 0.35, -6.4);
  ringMesh.rotation.set(0.6, 0.4, 0.3);
  ringMesh.castShadow = true;
  atriumGroup.add(ringMesh);

  // Sculpture 2: Back-Right (+2.35, -6.4) — Matte Bronze Abstract Torus Knot
  const knotGeo = new THREE.TorusKnotGeometry(0.22, 0.06, 64, 16, 2, 3);
  geometries.push(knotGeo);
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xc49a6c,
    roughness: 0.38,
    metalness: 0.85,
  });
  materials.push(bronzeMat);
  const bronzeMesh = new THREE.Mesh(knotGeo, bronzeMat);
  bronzeMesh.position.set(2.35, 1.155 + 0.32, -6.4);
  bronzeMesh.castShadow = true;
  atriumGroup.add(bronzeMesh);

  // Sculpture 3: Front-Left (-2.35, -1.8) — Smoked Glass Monolith
  const monolithGeo = new THREE.BoxGeometry(0.28, 0.65, 0.28);
  geometries.push(monolithGeo);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x111620,
    roughness: 0.1,
    transmission: 0.88,
    thickness: 0.5,
    ior: 1.52,
    transparent: true,
  });
  materials.push(glassMat);
  const glassMesh = new THREE.Mesh(monolithGeo, glassMat);
  glassMesh.position.set(-2.35, 1.155 + 0.325, -1.8);
  glassMesh.rotation.y = 0.35;
  glassMesh.castShadow = true;
  atriumGroup.add(glassMesh);

  // Sculpture 4: Front-Right (+2.35, -1.8) — Brushed Steel Geometric Octahedron
  const octaGeo = new THREE.OctahedronGeometry(0.32, 0);
  geometries.push(octaGeo);
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x8fa0b5,
    roughness: 0.28,
    metalness: 0.9,
  });
  materials.push(steelMat);
  const steelMesh = new THREE.Mesh(octaGeo, steelMat);
  steelMesh.position.set(2.35, 1.155 + 0.32, -1.8);
  steelMesh.rotation.set(0.4, 0.6, 0.2);
  steelMesh.castShadow = true;
  atriumGroup.add(steelMesh);

  // Architectural Planters in the far front corners
  const planterGeo = new THREE.BoxGeometry(0.9, 0.6, 0.9);
  geometries.push(planterGeo);
  [-4.5, 4.5].forEach((px) => {
    const planter = new THREE.Mesh(planterGeo, steelNicheMat);
    planter.position.set(px, 0.3, 4.5);
    planter.receiveShadow = true;
    atriumGroup.add(planter);

    const cylinderGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
    geometries.push(cylinderGeo);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x223326,
      roughness: 0.6,
    });
    materials.push(stemMat);
    const stem = new THREE.Mesh(cylinderGeo, stemMat);
    stem.position.set(px, 1.0, 4.5);
    stem.castShadow = true;
    atriumGroup.add(stem);
  });

  // --------------------------------------------------------------------
  // 5. INTERACTIVE WALL FRAMES (3 Left 9:16 + 3 Right 16:9 mounted at Y = 1.95)
  // --------------------------------------------------------------------
  const interactiveFrames: InteractiveFrame[] = [];
  const haloGradientTexture = createHaloGradientTexture();
  textures.push(haloGradientTexture);

  GALLERY_ARTWORKS.forEach((artwork) => {
    const frameGroup = new THREE.Group();
    frameGroup.position.set(...artwork.position);
    frameGroup.rotation.set(...artwork.rotation);

    const { width: fw, height: fh, depth: fd } = artwork.dimensions;

    // Artwork Poster Texture
    const artTexture = createArtworkPosterTexture(artwork);
    artTexture.anisotropy = maxAniso;
    textures.push(artTexture);

    const artMaterial = new THREE.MeshStandardMaterial({
      map: artTexture,
      emissiveMap: artTexture,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 0.35,
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    materials.push(artMaterial);

    const screenGeo = new THREE.PlaneGeometry(fw, fh);
    geometries.push(screenGeo);

    const screenMesh = new THREE.Mesh(screenGeo, artMaterial);
    screenMesh.position.set(0, 0, 0.015);
    screenMesh.userData = {
      isArtwork: true,
      artworkId: artwork.id,
      wall: artwork.wall,
      index: artwork.index,
    };
    frameGroup.add(screenMesh);

    // Slim matte-black aluminum bezel border (recessed behind screen)
    const bezelGeo = new THREE.BoxGeometry(fw + 0.08, fh + 0.08, fd);
    geometries.push(bezelGeo);
    const bezelMesh = new THREE.Mesh(bezelGeo, bezelMat);
    bezelMesh.position.set(0, 0, -fd * 0.4);
    bezelMesh.castShadow = true;
    frameGroup.add(bezelMesh);

    // Soft backlit LED perimeter halo
    const haloGeo = new THREE.PlaneGeometry(fw + 0.45, fh + 0.45);
    geometries.push(haloGeo);
    const haloMaterial = new THREE.MeshBasicMaterial({
      map: haloGradientTexture,
      color: new THREE.Color(artwork.glowColor),
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    materials.push(haloMaterial);

    const haloMesh = new THREE.Mesh(haloGeo, haloMaterial);
    haloMesh.position.set(0, 0, -fd * 0.5 - 0.01);
    frameGroup.add(haloMesh);

    scene.add(frameGroup);

    interactiveFrames.push({
      id: artwork.id,
      artwork,
      group: frameGroup,
      screenMesh,
      haloMesh,
      haloMaterial,
      artMaterial,
      baseEmissiveIntensity: 0.35,
    });
  });

  // --------------------------------------------------------------------
  // 6. RAISED CENTER OLED PORTAL SCREEN (Centered at X = 0, Y = 2.15, Z = -12.55)
  // --------------------------------------------------------------------
  const portalGroup = new THREE.Group();
  portalGroup.position.set(...PORTAL_DATA.position);
  portalGroup.rotation.set(...PORTAL_DATA.rotation);

  const { width: pw, height: ph } = PORTAL_DATA.dimensions;
  const portalTexture = createPortalPreviewTexture(PORTAL_DATA);
  portalTexture.anisotropy = maxAniso;
  textures.push(portalTexture);

  const portalArtMaterial = new THREE.MeshStandardMaterial({
    map: portalTexture,
    emissiveMap: portalTexture,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.88,
    roughness: 0.25,
    metalness: 0.1,
  });
  materials.push(portalArtMaterial);

  // Screen plane at world Z = -12.56 (local Z = -0.01)
  const portalScreenGeo = new THREE.PlaneGeometry(pw, ph);
  geometries.push(portalScreenGeo);
  const portalScreenMesh = new THREE.Mesh(portalScreenGeo, portalArtMaterial);
  portalScreenMesh.position.set(0, 0, -0.01);
  portalScreenMesh.userData = {
    isPortal: true,
    portalId: PORTAL_DATA.id,
  };
  portalGroup.add(portalScreenMesh);

  // Anodized matte-black steel bezel at world Z = -12.68 (local Z = -0.13)
  const portalBezelGeo = new THREE.BoxGeometry(pw + 0.22, ph + 0.22, 0.06);
  geometries.push(portalBezelGeo);
  const portalBezelMesh = new THREE.Mesh(portalBezelGeo, bezelMat);
  portalBezelMesh.position.set(0, 0, -0.13);
  portalBezelMesh.castShadow = true;
  portalGroup.add(portalBezelMesh);

  // Soft Cyan Halo Backlight for Portal at world Z = -12.72 (local Z = -0.17)
  const portalHaloGeo = new THREE.PlaneGeometry(pw + 0.9, ph + 0.9);
  geometries.push(portalHaloGeo);
  const portalHaloMaterial = new THREE.MeshBasicMaterial({
    map: haloGradientTexture,
    color: 0x0284c7,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  materials.push(portalHaloMaterial);

  const portalHaloMesh = new THREE.Mesh(portalHaloGeo, portalHaloMaterial);
  portalHaloMesh.position.set(0, 0, -0.17);
  portalGroup.add(portalHaloMesh);

  scene.add(portalGroup);

  const portalFrame: InteractivePortal = {
    id: PORTAL_DATA.id,
    portalData: PORTAL_DATA,
    group: portalGroup,
    screenMesh: portalScreenMesh,
    haloMesh: portalHaloMesh,
    haloMaterial: portalHaloMaterial,
    artMaterial: portalArtMaterial,
  };

  return {
    scene,
    atriumGroup,
    interactiveFrames,
    portalFrame,
    dustPoints,
    sunLight,
    hemiLight,
    leftWallLight,
    rightWallLight,
    cyanWallLight: leftWallLight,
    amberWallLight: rightWallLight,
    textures,
    materials,
    geometries,
    pmremEnvTexture,
  };
}

/**
 * Clean disposal of all WebGL resources on component unmount
 */
export function disposeGalleryScene(sceneData: GallerySceneData) {
  // Dispose all tracked textures
  sceneData.textures.forEach((t) => t.dispose());

  // Dispose all tracked materials
  sceneData.materials.forEach((m) => m.dispose());

  // Dispose all tracked geometries
  sceneData.geometries.forEach((g) => g.dispose());

  // Dispose environment map texture
  if (sceneData.pmremEnvTexture) {
    sceneData.pmremEnvTexture.dispose();
  }

  // Clear scene
  sceneData.scene.clear();
}
