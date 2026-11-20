'use client';

import React, { useState } from 'react';
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction,
} from '../actions';
import { Plus, Trash2, Edit2, X, Briefcase } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input, Textarea } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './ExperienceManager.module.scss';

interface Experience {
  id: number;
  period: string;
  role: string;
  organization: string;
  location: string;
  highlights: string[];
  sortOrder: number;
}

export function ExperienceManager({
  initialExperience,
}: {
  initialExperience: Experience[];
}) {
  const toast = useAdminToast();
  const [list, setList] = useState<Experience[]>(initialExperience);
  const [editing, setEditing] = useState<Partial<Experience> | null>(null);
  const [highlightsInput, setHighlightsInput] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleNew = () => {
    setEditing({
      period: '2025 — PRESENT',
      role: '',
      organization: '',
      location: 'Phnom Penh, Cambodia',
      highlights: [],
      sortOrder: list.length,
    });
    setHighlightsInput('');
    setIsNew(true);
  };

  const handleEdit = (exp: Experience) => {
    setEditing({ ...exp });
    setHighlightsInput(exp.highlights ? exp.highlights.join('\n') : '');
    setIsNew(false);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteExperienceAction(deleteTargetId);
      setList((prev) => prev.filter((e) => e.id !== deleteTargetId));
      if (editing?.id === deleteTargetId) setEditing(null);
      toast.success('Experience record removed.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      if (isNew) {
        const res = await createExperienceAction({
          period: editing.period || '',
          role: editing.role || '',
          organization: editing.organization || '',
          location: editing.location || '',
          highlights,
          sortOrder: editing.sortOrder ?? 0,
        });
        if (res.experience) {
          setList((prev) => [...prev, res.experience as Experience]);
        }
        toast.success('Experience entry created.');
      } else if (editing.id) {
        await updateExperienceAction(editing.id, {
          period: editing.period,
          role: editing.role,
          organization: editing.organization,
          location: editing.location,
          highlights,
          sortOrder: editing.sortOrder,
        });
        setList((prev) =>
          prev.map((e) =>
            e.id === editing.id
              ? ({ ...e, ...editing, highlights } as Experience)
              : e
          )
        );
        toast.success('Experience entry updated.');
      }
      setEditing(null);
      setIsNew(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <span className={styles.countText}>Career milestones: {list.length}</span>
        <Button
          variant="primary"
          onClick={handleNew}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Role
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="w-6 h-6" />}
          title="No Career Records"
          description="Add production houses, agency roles, and freelance editing tenures to build your curriculum ledger."
          action={
            <Button variant="secondary" size="sm" onClick={handleNew}>
              Add First Role
            </Button>
          }
        />
      ) : (
        <div className={styles.timeline}>
          {list.map((exp) => (
            <div key={exp.id} className={styles.itemCard}>
              <div className={styles.itemHeader}>
                <div>
                  <h3 className={styles.itemRole}>{exp.role}</h3>
                  <p className={styles.itemOrgLine}>
                    {exp.organization} · {exp.location}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="gold">{exp.period}</Badge>
                  <div className={styles.actions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(exp)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      aria-label="Edit role"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetId(exp.id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
                      aria-label="Delete role"
                    />
                  </div>
                </div>
              </div>

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={styles.highlightsList}>
                  {exp.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Drawer Editor */}
      {editing && (
        <div
          className={styles.drawerBackdrop}
          onClick={() => setEditing(null)}
        >
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>
                {isNew ? 'New Career Role' : `Edit: ${editing.role}`}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
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
                <Input
                  label="Role Title"
                  required
                  value={editing.role || ''}
                  placeholder="Lead Commercial Video Editor"
                  onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Studio / Organization"
                    required
                    value={editing.organization || ''}
                    placeholder="Independent Practice / Production"
                    onChange={(e) =>
                      setEditing({ ...editing, organization: e.target.value })
                    }
                  />
                  <Input
                    label="Tenure Period"
                    required
                    value={editing.period || ''}
                    placeholder="2024 — PRESENT"
                    onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                  />
                </div>

                <Input
                  label="Location"
                  required
                  value={editing.location || ''}
                  placeholder="Phnom Penh, Cambodia"
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                />

                <Textarea
                  label="Role Key Highlights (One Per Line)"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  rows={5}
                  placeholder="Cut high-energy commercial reels&#10;Built DaVinci Resolve color pipelines"
                  hint="Each line will render as a distinct bullet point."
                />
              </div>

              <div className={styles.drawerFooter}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                >
                  {isNew ? 'Create Role' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Career Milestone?"
        message="This professional role record will be permanently deleted from the database."
        confirmLabel="Delete Role"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
