'use client';

import React, { useState, useMemo } from 'react';
import { R2Uploader } from '@/components/dashboard/R2Uploader';
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from '../actions';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Video,
  Image as ImageIcon,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input, Textarea, Select } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './ProjectsManager.module.scss';

interface Project {
  id: number;
  slug: string;
  galleryArtworkId: string | null;
  plaqueNumber: string;
  title: string;
  shortTitle: string;
  category: string;
  aspect: string;
  specLabel: string;
  year: string;
  duration: string | null;
  accentColor: string;
  platePreset: string;
  inspectionMode: string;
  description: string;
  curatorNote: string;
  tools: string[];
  deliverables: string;
  thumbnailAssetId: number | null;
  videoAssetId: number | null;
  externalVideoUrl: string | null;
  published: boolean;
  featured: boolean;
  sortOrder: number;
}

interface MediaItem {
  id: number;
  originalFilename: string | null;
  url: string;
}

interface ProjectsManagerProps {
  initialProjects: Project[];
  mediaMap: Record<number, MediaItem>;
}

export function ProjectsManager({
  initialProjects,
  mediaMap,
}: ProjectsManagerProps) {
  const toast = useAdminToast();
  const [projectsList, setProjectsList] = useState<Project[]>(initialProjects);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterAspect, setFilterAspect] = useState<'all' | '16:9' | '9:16' | 'published' | 'draft'>('all');

  // Deletion confirm state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsNew(false);
  };

  const handleNew = () => {
    setEditingProject({
      slug: `p-${String(projectsList.length + 1).padStart(2, '0')}`,
      plaqueNumber: `EXH-${String(projectsList.length + 1).padStart(2, '0')}`,
      title: '',
      shortTitle: '',
      category: 'Video Edits',
      aspect: '16:9',
      specLabel: '16:9 · VIDEO EDIT',
      year: new Date().getFullYear().toString(),
      duration: '02:45',
      accentColor: '#F59E0B',
      platePreset: 'nle-timeline',
      inspectionMode: 'timeline',
      description: '',
      curatorNote: '',
      tools: ['Adobe Premiere Pro', 'DaVinci Resolve'],
      deliverables: 'Master DCI 4K Export',
      published: true,
      featured: false,
      sortOrder: projectsList.length,
    });
    setIsNew(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteProjectAction(deleteTargetId);
      setProjectsList((prev) => prev.filter((p) => p.id !== deleteTargetId));
      if (editingProject?.id === deleteTargetId) setEditingProject(null);
      toast.success('Project deleted successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleTogglePublished = async (project: Project) => {
    try {
      await updateProjectAction(project.id, { published: !project.published });
      setProjectsList((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, published: !p.published } : p
        )
      );
      toast.info(`Project ${!project.published ? 'published' : 'moved to draft'}.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);

    try {
      if (isNew) {
        const res = await createProjectAction({
          slug: editingProject.slug || `p-${Date.now()}`,
          galleryArtworkId: editingProject.galleryArtworkId || null,
          plaqueNumber: editingProject.plaqueNumber || 'EXH-00',
          title: editingProject.title || '',
          shortTitle: editingProject.shortTitle || '',
          category: editingProject.category || 'Video Edits',
          aspect: (editingProject.aspect as '16:9' | '9:16') || '16:9',
          specLabel: editingProject.specLabel || '',
          year: editingProject.year || '2025',
          duration: editingProject.duration || null,
          accentColor: editingProject.accentColor || '#F59E0B',
          platePreset: editingProject.platePreset || 'nle-timeline',
          inspectionMode: editingProject.inspectionMode || 'timeline',
          description: editingProject.description || '',
          curatorNote: editingProject.curatorNote || '',
          tools: editingProject.tools || [],
          deliverables: editingProject.deliverables || '',
          thumbnailAssetId: editingProject.thumbnailAssetId || null,
          videoAssetId: editingProject.videoAssetId || null,
          externalVideoUrl: editingProject.externalVideoUrl || null,
          published: editingProject.published ?? true,
          featured: editingProject.featured ?? false,
          sortOrder: editingProject.sortOrder ?? 0,
        });
        if (res.project) {
          setProjectsList((prev) => [...prev, res.project as Project]);
        }
        toast.success('Project created and added to portfolio.');
      } else if (editingProject.id) {
        await updateProjectAction(editingProject.id, {
          slug: editingProject.slug,
          galleryArtworkId: editingProject.galleryArtworkId,
          plaqueNumber: editingProject.plaqueNumber,
          title: editingProject.title,
          shortTitle: editingProject.shortTitle,
          category: editingProject.category,
          aspect: editingProject.aspect as '16:9' | '9:16' | undefined,
          specLabel: editingProject.specLabel,
          year: editingProject.year,
          duration: editingProject.duration,
          accentColor: editingProject.accentColor,
          platePreset: editingProject.platePreset,
          inspectionMode: editingProject.inspectionMode,
          description: editingProject.description,
          curatorNote: editingProject.curatorNote,
          tools: editingProject.tools,
          deliverables: editingProject.deliverables,
          thumbnailAssetId: editingProject.thumbnailAssetId,
          videoAssetId: editingProject.videoAssetId,
          externalVideoUrl: editingProject.externalVideoUrl,
          published: editingProject.published,
          featured: editingProject.featured,
          sortOrder: editingProject.sortOrder,
        });
        setProjectsList((prev) =>
          prev.map((p) =>
            p.id === editingProject.id
              ? ({ ...p, ...editingProject } as Project)
              : p
          )
        );
        toast.success('Project updated.');
      }
      setEditingProject(null);
      setIsNew(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projectsList.filter((p) => {
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.shortTitle.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (filterAspect === '16:9') return p.aspect === '16:9';
      if (filterAspect === '9:16') return p.aspect === '9:16';
      if (filterAspect === 'published') return p.published;
      if (filterAspect === 'draft') return !p.published;
      return true;
    });
  }, [projectsList, search, filterAspect]);

  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <div className={styles.searchWrap}>
            <Input
              type="search"
              placeholder="Search works..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leadingIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          {(['all', '16:9', '9:16', 'published', 'draft'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterAspect(tab)}
              className={[
                styles.filterBtn,
                filterAspect === tab ? styles.active : '',
              ].join(' ')}
            >
              {tab === 'all'
                ? `All (${projectsList.length})`
                : tab === '16:9'
                  ? 'Cinema (16:9)'
                  : tab === '9:16'
                    ? 'Posters (9:16)'
                    : tab}
            </button>
          ))}
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleNew}
          icon={<Plus className="w-4 h-4" />}
        >
          New Work
        </Button>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<Video className="w-6 h-6" />}
          title="No Works Found"
          description="Try adjusting your filter search criteria or create a new portfolio work."
          action={
            <Button variant="secondary" size="sm" onClick={handleNew}>
              Create First Work
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map((p) => {
            const thumbUrl = p.thumbnailAssetId ? mediaMap[p.thumbnailAssetId]?.url : null;
            return (
              <div key={p.id} className={styles.projectCard}>
                <div className={styles.thumbnailWrap}>
                  {thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbUrl}
                      alt={p.title}
                      className={styles.thumbnailImg}
                    />
                  ) : (
                    <div className={styles.thumbnailFallback}>
                      {p.aspect === '16:9' ? (
                        <Video className="w-8 h-8 text-[var(--museum-ash)]" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[var(--museum-ash)]" />
                      )}
                      <span>{p.platePreset}</span>
                    </div>
                  )}

                  <div className={styles.aspectPill}>
                    <Badge variant="neutral">{p.aspect}</Badge>
                  </div>

                  <div className={styles.statusPills}>
                    {p.featured && <Badge variant="gold">Featured</Badge>}
                    <Badge variant={p.published ? 'success' : 'neutral'} dot>
                      {p.published ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardMetaLine}>
                    <span>{p.plaqueNumber}</span>
                    <span>{p.category} · {p.year}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{p.title}</h3>
                  <p className={styles.cardDesc}>{p.description}</p>
                </div>

                <div className={styles.cardFooter}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublished(p)}
                    icon={
                      p.published ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                      )
                    }
                  >
                    {p.published ? 'Live' : 'Hidden'}
                  </Button>

                  <div className={styles.cardActions}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEdit(p)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteTargetId(p.id)}
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      aria-label="Delete work"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Drawer Editor */}
      {editingProject && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setEditingProject(null)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                {isNew ? 'Create New Work' : `Edit: ${editingProject.title}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#b8b0a4',
                  cursor: 'pointer',
                  padding: 4,
                }}
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className={styles.drawerBody}>
                <div className={styles.grid2}>
                  <Input
                    label="Plaque Identifier"
                    required
                    value={editingProject.plaqueNumber || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, plaqueNumber: e.target.value })
                    }
                  />
                  <Input
                    label="URL Slug"
                    required
                    value={editingProject.slug || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, slug: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Exhibition Work Title"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                />

                <div className={styles.grid2}>
                  <Input
                    label="Short Title (Nav/Tabs)"
                    required
                    value={editingProject.shortTitle || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, shortTitle: e.target.value })
                    }
                  />
                  <Select
                    label="Discipline Category"
                    value={editingProject.category || 'Video Edits'}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                  >
                    <option value="Video Edits">Video Edits</option>
                    <option value="Photo Retouching">Photo Retouching</option>
                    <option value="Poster Design">Poster Design</option>
                  </Select>
                </div>

                <div className={styles.grid2}>
                  <Select
                    label="Aspect Ratio"
                    value={editingProject.aspect || '16:9'}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        aspect: e.target.value,
                        specLabel: e.target.value === '16:9' ? '16:9 · CINEMA EDIT' : '9:16 · POSTER DESIGN',
                      })
                    }
                  >
                    <option value="16:9">16:9 Landscape (Cinema)</option>
                    <option value="9:16">9:16 Portrait (Poster)</option>
                  </Select>
                  <Input
                    label="Technical Spec Label"
                    value={editingProject.specLabel || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, specLabel: e.target.value })
                    }
                  />
                </div>

                <div className={styles.grid2}>
                  <Input
                    label="Production Year"
                    value={editingProject.year || '2025'}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, year: e.target.value })
                    }
                  />
                  <Input
                    label="Duration (optional)"
                    value={editingProject.duration || ''}
                    placeholder="02:30"
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, duration: e.target.value })
                    }
                  />
                </div>

                <Textarea
                  label="Exhibition Description"
                  required
                  value={editingProject.description || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  rows={3}
                />

                <Textarea
                  label="Curator Note"
                  value={editingProject.curatorNote || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, curatorNote: e.target.value })
                  }
                  rows={2}
                />

                {/* Media Uploaders */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ fontFamily: 'monospace', fontSize: '0.6875rem', fontWeight: 600, color: '#b8b0a4', textTransform: 'uppercase' }}>
                    Thumbnail Poster Image (R2)
                  </label>
                  <R2Uploader
                    kind="image"
                    folder="projects"
                    onUploaded={(asset) => {
                      setEditingProject((prev) => ({
                        ...prev,
                        thumbnailAssetId: asset.id,
                      }));
                      toast.success('Thumbnail asset uploaded.');
                    }}
                  />
                </div>

                <div className={styles.grid2}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem', color: '#f4efe6' }}>
                    <input
                      type="checkbox"
                      checked={editingProject.published ?? true}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, published: e.target.checked })
                      }
                      style={{ accentColor: '#e5a93c', width: 16, height: 16 }}
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontFamily: 'monospace', fontSize: '0.75rem', color: '#f4efe6' }}>
                    <input
                      type="checkbox"
                      checked={editingProject.featured ?? false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      style={{ accentColor: '#e5a93c', width: 16, height: 16 }}
                    />
                    <span>Feature on Portal</span>
                  </label>
                </div>
              </div>

              <div className={styles.drawerFooter}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  {isNew ? 'Create Work' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Portfolio Work?"
        message="This will permanently delete this exhibition piece from the database and remove it from the live museum floor."
        confirmLabel="Delete Work"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
