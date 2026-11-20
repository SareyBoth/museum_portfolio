'use client';

import React, { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import {
  buildGalleryScene,
  disposeGalleryScene,
  GallerySceneData,
} from './GallerySceneBuilder';
import { ArtworkData, GALLERY_ARTWORKS, PORTAL_DATA } from '@/data/gallery';
import { CameraMode } from './GalleryHUD';

export interface GalleryCanvasHandle {
  enterPortal: () => void;
  exitPortal: () => void;
  backToOverview: () => void;
  stepArtwork: (direction: -1 | 1) => void;
  inspectArtworkById: (artworkId: string) => void;
  reverseScroll: (deltaY: number) => void;
}

interface GalleryCanvasProps {
  paused?: boolean;
  onModeChange: (mode: CameraMode) => void;
  onActiveArtworkChange: (artwork: ArtworkData | null) => void;
  onPortalProgressChange: (progress: number) => void;
  onHoveredTargetChange: (name: string | null) => void;
  canExitOnEscape?: () => boolean;
}

export const GalleryCanvas = forwardRef<GalleryCanvasHandle, GalleryCanvasProps>(
  (
    { paused = false, onModeChange, onActiveArtworkChange, onPortalProgressChange, onHoveredTargetChange, canExitOnEscape },
    ref
  ) => {
    const canExitOnEscapeRef = useRef(canExitOnEscape);
    useEffect(() => {
      canExitOnEscapeRef.current = canExitOnEscape;
    }, [canExitOnEscape]);

    const containerRef = useRef<HTMLDivElement>(null);
    const sceneDataRef = useRef<GallerySceneData | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animateFnRef = useRef<(() => void) | null>(null);
    const pausedRef = useRef(paused);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

    // State machine
    const modeRef = useRef<CameraMode>('OVERVIEW');
    const activeArtworkRef = useRef<ArtworkData | null>(null);
    const targetPortalProgressRef = useRef<number>(0.0);
    const currentPortalProgressRef = useRef<number>(0.0);
    const lastReportedProgressRef = useRef<number>(-1);

    const resumeAnimationLoop = useCallback(() => {
      pausedRef.current = false;
      if (rendererRef.current && animateFnRef.current) {
        rendererRef.current.setAnimationLoop(animateFnRef.current);
      }
    }, []);

    useEffect(() => {
      pausedRef.current = paused;
      if (!rendererRef.current || !animateFnRef.current) return;
      if (paused && targetPortalProgressRef.current >= 0.995) {
        rendererRef.current.setAnimationLoop(null);
      } else {
        rendererRef.current.setAnimationLoop(animateFnRef.current);
      }
    }, [paused]);

    // Camera target positions: Direct symmetrical one-point perspective from back of hall
    const camPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0.0, 2.15, 8.8));
    const lookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0.0, 2.15, -12.55));
    const targetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0.0, 2.15, 8.8));
    const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0.0, 2.15, -12.55));

    // Pointer parallax & interaction
    const pointerNDC = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
    const pointerSmooth = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
    const isPointerDown = useRef<boolean>(false);
    const pointerDownCoord = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    // Inspect mode orbit/zoom
    const inspectPan = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
    const inspectZoom = useRef<number>(1.0);
    const hoveredFrameId = useRef<string | null>(null);

    // Helper to switch mode smoothly
    const setMode = useCallback(
      (newMode: CameraMode) => {
        modeRef.current = newMode;
        onModeChange(newMode);
        if (newMode === 'OVERVIEW') {
          activeArtworkRef.current = null;
          onActiveArtworkChange(null);
          inspectPan.current.set(0, 0);
          inspectZoom.current = 1.0;
        }
      },
      [onModeChange, onActiveArtworkChange]
    );

    // Select artwork in inspect mode
    const selectArtwork = useCallback(
      (artwork: ArtworkData) => {
        activeArtworkRef.current = artwork;
        onActiveArtworkChange(artwork);
        inspectPan.current.set(0, 0);
        inspectZoom.current = 1.0;
        setMode('FRAME_INSPECT');
      },
      [onActiveArtworkChange, setMode]
    );

    // Step to prev/next artwork among 6 wall posters
    const stepArtwork = useCallback(
      (direction: -1 | 1) => {
        if (!activeArtworkRef.current) {
          selectArtwork(GALLERY_ARTWORKS[0]);
          return;
        }
        const currentIndex = activeArtworkRef.current.index;
        const nextIndex = (currentIndex + direction + GALLERY_ARTWORKS.length) % GALLERY_ARTWORKS.length;
        selectArtwork(GALLERY_ARTWORKS[nextIndex]);
      },
      [selectArtwork]
    );

    const prefersReducedMotion = useCallback(
      () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      []
    );

    // Direct Portal Enter
    const enterPortal = useCallback(() => {
      resumeAnimationLoop();
      targetPortalProgressRef.current = 1.0;
      if (prefersReducedMotion()) {
        currentPortalProgressRef.current = 1.0;
        lastReportedProgressRef.current = 1.0;
        onPortalProgressChange(1.0);
      }
      setMode('PORTAL_PORTFOLIO');
    }, [onPortalProgressChange, prefersReducedMotion, resumeAnimationLoop, setMode]);

    // Exit Portal (keep PORTAL_PORTFOLIO while damping 1 -> 0 unless reduced motion)
    const exitPortal = useCallback(() => {
      resumeAnimationLoop();
      targetPortalProgressRef.current = 0.0;
      if (prefersReducedMotion() || currentPortalProgressRef.current <= 0.005) {
        currentPortalProgressRef.current = 0.0;
        lastReportedProgressRef.current = 0.0;
        onPortalProgressChange(0.0);
        setMode('OVERVIEW');
      } else {
        setMode('PORTAL_PORTFOLIO');
      }
    }, [onPortalProgressChange, prefersReducedMotion, resumeAnimationLoop, setMode]);

    // Back to Overview
    const backToOverview = useCallback(() => {
      resumeAnimationLoop();
      targetPortalProgressRef.current = 0.0;
      currentPortalProgressRef.current = 0.0;
      lastReportedProgressRef.current = 0.0;
      onPortalProgressChange(0.0);
      setMode('OVERVIEW');
    }, [onPortalProgressChange, resumeAnimationLoop, setMode]);

    // Direct jump from inner portfolio lightbox to inspect a specific 3D gallery wall frame
    const inspectArtworkById = useCallback(
      (artworkId: string) => {
        const art = GALLERY_ARTWORKS.find((a) => a.id === artworkId);
        if (!art) return;
        resumeAnimationLoop();
        targetPortalProgressRef.current = 0.0;
        currentPortalProgressRef.current = 0.0;
        lastReportedProgressRef.current = 0.0;
        onPortalProgressChange(0.0);
        selectArtwork(art);
      },
      [onPortalProgressChange, resumeAnimationLoop, selectArtwork]
    );

    // Reverse scroll from PortalShell (never silently mutate modeRef; let animate() damp & transition)
    const reverseScroll = useCallback((deltaY: number) => {
      resumeAnimationLoop();
      const step = deltaY / 2400;
      targetPortalProgressRef.current = Math.max(
        0.0,
        Math.min(1.0, targetPortalProgressRef.current + step)
      );
      if (targetPortalProgressRef.current < 0.999 && modeRef.current !== 'PORTAL_PORTFOLIO') {
        setMode('PORTAL_PORTFOLIO');
      }
    }, [resumeAnimationLoop, setMode]);

    // Expose handle to parent component
    useImperativeHandle(
      ref,
      () => ({
        enterPortal,
        exitPortal,
        backToOverview,
        stepArtwork,
        inspectArtworkById,
        reverseScroll,
      }),
      [enterPortal, exitPortal, backToOverview, stepArtwork, inspectArtworkById, reverseScroll]
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. WebGLRenderer Setup
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // 2. Camera Setup: Direct symmetrical one-point perspective from back of hall
      const camera = new THREE.PerspectiveCamera(56, width / height, 0.1, 100);
      camera.position.set(0.0, 2.15, 8.8);
      camera.lookAt(0.0, 2.15, -12.55);
      cameraRef.current = camera;
      const initialAspect = width / height;
      if (initialAspect < 1.0) {
        camera.fov = Math.min(74, Math.max(56, (56 / initialAspect) * 0.74));
        camera.updateProjectionMatrix();
      }

      // 3. Procedural Brutalist Travertine Scene
      const sceneData = buildGalleryScene(renderer);
      sceneDataRef.current = sceneData;

      // Raycaster for click & hover
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      // Expose to window for site-check and performance diagnostics
      type GalleryDebugWindow = Window & {
        __app?: {
          renderer: THREE.WebGLRenderer;
          scene: THREE.Scene;
          camera: THREE.PerspectiveCamera;
          THREE: typeof THREE;
        };
        __ready?: boolean;
      };
      if (typeof window !== 'undefined') {
        const debugWin = window as GalleryDebugWindow;
        debugWin.__app = {
          renderer,
          scene: sceneData.scene,
          camera,
          THREE,
        };
        debugWin.__ready = true;
      }

      // Timing with THREE.Timer
      const timer = new THREE.Timer();
      timer.connect(document);

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const animate = () => {
        timer.update();
        const dt = Math.min(timer.getDelta(), 0.05);
        const reduceMotion = reducedMotionQuery.matches;

        // A. Update Drifting Dust Particles (paused under reduced-motion)
        if (!reduceMotion) {
          const dustPos = sceneData.dustPoints.geometry.attributes.position;
          const count = dustPos.count;
          for (let i = 0; i < count; i++) {
            let y = dustPos.getY(i) - 0.12 * dt;
            if (y < 0.2) y = 4.8;
            dustPos.setY(i, y);
          }
          dustPos.needsUpdate = true;
        }

        // B. Interpolate Pointer Smooth Parallax (disabled under reduced-motion)
        if (reduceMotion) {
          pointerSmooth.current.set(0, 0);
        } else {
          pointerSmooth.current.lerp(pointerNDC.current, 1 - Math.exp(-6.0 * dt));
        }

        // C. Camera State Machine Calculations
        const currentMode = modeRef.current;

        if (currentMode === 'OVERVIEW') {
          if (currentPortalProgressRef.current > 0.001 || lastReportedProgressRef.current > 0.001) {
            currentPortalProgressRef.current = 0.0;
            lastReportedProgressRef.current = 0.0;
            onPortalProgressChange(0.0);
          }
          // If virtual scroll progress was nudged, enter portal mode
          if (targetPortalProgressRef.current > 0.01) {
            setMode('PORTAL_PORTFOLIO');
          } else {
            // Direct symmetrical one-point perspective with subtle damped pointer parallax (±0.22)
            const px = pointerSmooth.current.x;
            const py = pointerSmooth.current.y;
            targetPosRef.current.set(px * 0.22, 2.15 + py * 0.12, 8.8);
            targetLookAtRef.current.set(px * 0.10, 2.15 + py * 0.08, -12.55);
          }
        } else if (currentMode === 'FRAME_INSPECT') {
          const artwork = activeArtworkRef.current;
          if (artwork) {
            const baseInspectPos = artwork.cameraInspect.position;
            const baseLookAt = artwork.cameraInspect.lookAt;

            // Apply bounded orbit & zoom
            const zFactor = inspectZoom.current;
            const isLeft = artwork.wall === 'left';
            const dx = isLeft ? 1.5 * zFactor : -1.5 * zFactor;

            targetPosRef.current.set(
              artwork.position[0] + dx,
              baseInspectPos[1] + inspectPan.current.y * 0.4,
              baseInspectPos[2] + inspectPan.current.x * 0.6
            );
            targetLookAtRef.current.set(
              baseLookAt[0],
              baseLookAt[1] + inspectPan.current.y * 0.2,
              baseLookAt[2] + inspectPan.current.x * 0.3
            );
          }
        } else if (currentMode === 'PORTAL_PORTFOLIO') {
          // Exponential damping toward target progress (snaps immediately when reduced-motion is preferred)
          const pTarget = targetPortalProgressRef.current;
          const pCurr = currentPortalProgressRef.current;
          const pNext = reduceMotion
            ? pTarget
            : pCurr + (pTarget - pCurr) * (1 - Math.exp(-3.4 * dt));
          currentPortalProgressRef.current = pNext;

          if (
            Math.abs(pNext - lastReportedProgressRef.current) > 0.005 ||
            (pTarget === 1.0 && pNext > 0.99) ||
            (pTarget === 0.0 && pNext < 0.01)
          ) {
            lastReportedProgressRef.current = pNext;
            onPortalProgressChange(pNext);
          }

          // Reverse back to Overview only after progress finishes damping to 0
          if (pNext < 0.005 && pTarget <= 0.001) {
            currentPortalProgressRef.current = 0.0;
            lastReportedProgressRef.current = 0.0;
            onPortalProgressChange(0.0);
            setMode('OVERVIEW');
          }

          // Smooth Center-Aisle Scroll-In:
          // Straight forward down the center aisle (Z: 8.8 -> -11.35) at constant eye level Y = 2.15
          const p = THREE.MathUtils.clamp(pNext, 0, 1);
          const t = THREE.MathUtils.smoothstep(p, 0, 1);
          // Fade parallax to 0 during scroll-in
          const parallaxFade = Math.max(0, 1 - p * 2.0);
          const px = pointerSmooth.current.x * 0.22 * parallaxFade;
          const py = pointerSmooth.current.y * 0.12 * parallaxFade;

          targetPosRef.current.set(
            px,
            2.15 + py,
            THREE.MathUtils.lerp(8.8, -11.35, t)
          );
          targetLookAtRef.current.set(0.0, 2.15, -12.55);
        }

        // D. Camera Glide Damping
        const camLerp = reduceMotion ? 1 : 1 - Math.exp(-5.0 * dt);
        camPosRef.current.lerp(targetPosRef.current, camLerp);
        lookAtRef.current.lerp(targetLookAtRef.current, camLerp);
        camera.position.copy(camPosRef.current);
        camera.lookAt(lookAtRef.current);

        // E. Smooth Hover Glow Dynamics on Frames
        sceneData.interactiveFrames.forEach((frame) => {
          const isHovered = frame.id === hoveredFrameId.current;
          const isInspected = activeArtworkRef.current?.id === frame.id;
          const targetGlow = isInspected ? 0.85 : isHovered ? 0.65 : 0.35;
          const targetEmissive = isInspected ? 0.55 : isHovered ? 0.45 : 0.28;

          frame.haloMaterial.opacity = THREE.MathUtils.lerp(
            frame.haloMaterial.opacity,
            targetGlow,
            1 - Math.exp(-8 * dt)
          );
          frame.artMaterial.emissiveIntensity = THREE.MathUtils.lerp(
            frame.artMaterial.emissiveIntensity,
            targetEmissive,
            1 - Math.exp(-8 * dt)
          );
        });

        // Portal Screen Hover Glow
        const isPortalHovered = hoveredFrameId.current === PORTAL_DATA.id;
        const targetPortalHalo = isPortalHovered ? 0.75 : 0.38;
        sceneData.portalFrame.haloMaterial.opacity = THREE.MathUtils.lerp(
          sceneData.portalFrame.haloMaterial.opacity,
          targetPortalHalo,
          1 - Math.exp(-8 * dt)
        );

        renderer.render(sceneData.scene, camera);
      };

      rendererRef.current = renderer;
      animateFnRef.current = animate;
      renderer.setAnimationLoop(pausedRef.current ? null : animate);

      // Event Handlers
      const getClickables = () => {
        const meshes: THREE.Mesh[] = [];
        sceneData.interactiveFrames.forEach((f) => meshes.push(f.screenMesh));
        meshes.push(sceneData.portalFrame.screenMesh);
        return meshes;
      };

      const handlePointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        pointerNDC.current.copy(pointer);

        // Drag to pan in inspect mode
        if (isPointerDown.current && modeRef.current === 'FRAME_INSPECT') {
          const deltaX = (e.clientX - pointerDownCoord.current.x) * 0.004;
          const deltaY = (e.clientY - pointerDownCoord.current.y) * 0.004;
          inspectPan.current.x = Math.max(-1.0, Math.min(1.0, inspectPan.current.x + deltaX));
          inspectPan.current.y = Math.max(-0.6, Math.min(0.6, inspectPan.current.y - deltaY));
          pointerDownCoord.current = { x: e.clientX, y: e.clientY };
          return;
        }

        // Raycast for hover state in Overview mode
        if (modeRef.current === 'OVERVIEW') {
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObjects(getClickables(), false);
          if (hits.length > 0) {
            const hitMesh = hits[0].object as THREE.Mesh;
            container.style.cursor = 'pointer';
            let nextId: string | null = null;
            let nextTitle: string | null = null;

            if (hitMesh.userData.isArtwork) {
              const art = GALLERY_ARTWORKS.find((a) => a.id === hitMesh.userData.artworkId);
              nextId = hitMesh.userData.artworkId;
              nextTitle = art ? `${art.title} (${art.aspectRatio})` : null;
            } else if (hitMesh.userData.isPortal) {
              nextId = PORTAL_DATA.id;
              nextTitle = 'PORTAL // DIGITAL ATELIER [SCROLL / CLICK]';
            }

            if (nextId !== hoveredFrameId.current) {
              hoveredFrameId.current = nextId;
              onHoveredTargetChange(nextTitle);
            }
          } else {
            container.style.cursor = 'default';
            if (hoveredFrameId.current !== null) {
              hoveredFrameId.current = null;
              onHoveredTargetChange(null);
            }
          }
        }
      };

      const handlePointerDown = (e: PointerEvent) => {
        isPointerDown.current = true;
        pointerDownCoord.current = { x: e.clientX, y: e.clientY };
      };

      const handlePointerUp = (e: PointerEvent) => {
        const wasDown = isPointerDown.current;
        isPointerDown.current = false;
        if (!wasDown) return;

        const dist = Math.hypot(
          e.clientX - pointerDownCoord.current.x,
          e.clientY - pointerDownCoord.current.y
        );

        // Click threshold: only trigger if pointer didn't drag and release occurred inside canvas container
        if (dist < 8 && (e.target === renderer.domElement || container.contains(e.target as Node))) {
          const rect = container.getBoundingClientRect();
          if (rect.width <= 0 || rect.height <= 0) return;
          pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);

          const hits = raycaster.intersectObjects(getClickables(), false);

          if (hits.length > 0) {
            const hitMesh = hits[0].object as THREE.Mesh;
            if (hitMesh.userData.isArtwork) {
              const art = GALLERY_ARTWORKS.find((a) => a.id === hitMesh.userData.artworkId);
              if (art) {
                selectArtwork(art);
              }
            } else if (hitMesh.userData.isPortal) {
              enterPortal();
            }
          } else {
            // Clicked empty space outside frames
            if (modeRef.current === 'FRAME_INSPECT') {
              backToOverview();
            }
          }
        }
      };

      const handleWheel = (e: WheelEvent) => {
        // OVERVIEW: scrolling down nudges portal scroll runway ONLY, NEVER cycles wall frames
        if (modeRef.current === 'OVERVIEW') {
          if (e.deltaY > 0) {
            const step = e.deltaY / 2400;
            targetPortalProgressRef.current = Math.min(1.0, targetPortalProgressRef.current + step);
            if (targetPortalProgressRef.current > 0.01) {
              setMode('PORTAL_PORTFOLIO');
            }
          }
        } else if (modeRef.current === 'PORTAL_PORTFOLIO') {
          e.preventDefault();
          const step = e.deltaY / 2400;
          targetPortalProgressRef.current = Math.max(
            0.0,
            Math.min(1.0, targetPortalProgressRef.current + step)
          );
        } else if (modeRef.current === 'FRAME_INSPECT') {
          // In inspect mode: wheel zooms poster between 0.75 and 1.45
          e.preventDefault();
          const zoomDelta = e.deltaY * 0.0015;
          inspectZoom.current = Math.max(0.75, Math.min(1.45, inspectZoom.current + zoomDelta));
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (e.repeat || e.defaultPrevented || document.querySelector('dialog[open]')) {
            return;
          }
          if (modeRef.current === 'FRAME_INSPECT') {
            backToOverview();
          } else if (modeRef.current === 'PORTAL_PORTFOLIO') {
            if (canExitOnEscapeRef.current && !canExitOnEscapeRef.current()) {
              return;
            }
            exitPortal();
          }
        } else if (modeRef.current === 'FRAME_INSPECT' || modeRef.current === 'OVERVIEW') {
          if (e.key === 'ArrowLeft') {
            stepArtwork(-1);
          } else if (e.key === 'ArrowRight') {
            stepArtwork(1);
          }
        }
      };

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        const aspect = w / h;
        camera.aspect = aspect;
        if (aspect < 1.0) {
          // On mobile portrait, widen vertical FOV up to 74deg so both side walls and stands remain well framed
          camera.fov = Math.min(74, Math.max(56, (56 / aspect) * 0.74));
        } else {
          camera.fov = 56;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerdown', handlePointerDown);
      window.addEventListener('pointerup', handlePointerUp);
      container.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerdown', handlePointerDown);
        window.removeEventListener('pointerup', handlePointerUp);
        container.removeEventListener('wheel', handleWheel);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);

        timer.disconnect();
        timer.dispose();
        animateFnRef.current = null;
        rendererRef.current = null;
        renderer.setAnimationLoop(null);
        disposeGalleryScene(sceneData);
        renderer.dispose();
        renderer.forceContextLoss();

        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }

        if (typeof window !== 'undefined') {
          const debugWin = window as GalleryDebugWindow;
          delete debugWin.__app;
          delete debugWin.__ready;
        }
      };
    }, [
      selectArtwork,
      stepArtwork,
      enterPortal,
      exitPortal,
      backToOverview,
      setMode,
      onPortalProgressChange,
      onHoveredTargetChange,
    ]);

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950 touch-none select-none"
      />
    );
  }
);

GalleryCanvas.displayName = 'GalleryCanvas';
