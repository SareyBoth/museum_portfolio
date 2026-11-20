'use client';

import React, { useState } from 'react';
import {
  createEducationAction,
  updateEducationAction,
  deleteEducationAction,
} from '../actions';
import { Plus, Trash2, Edit2, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input, Textarea } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './EducationManager.module.scss';

interface Education {
  id: number;
  period: string;
  degree: string;
  institution: string;
  location: string;
  focus: string;
  sortOrder: number;
}

export function EducationManager({
  initialEducation,
}: {
  initialEducation: Education[];
}) {
  const toast = useAdminToast();
  const [list, setList] = useState<Education[]>(initialEducation);
  const [editing, setEditing] = useState<Partial<Education> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleNew = () => {
    setEditing({
      period: '2022 — PRESENT',
      degree: '',
      institution: '',
      location: 'Phnom Penh, Cambodia',
      focus: '',
      sortOrder: list.length,
    });
    setIsNew(true);
  };

  const handleEdit = (edu: Education) => {
    setEditing({ ...edu });
    setIsNew(false);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteEducationAction(deleteTargetId);
      setList((prev) => prev.filter((e) => e.id !== deleteTargetId));
      if (editing?.id === deleteTargetId) setEditing(null);
      toast.success('Academic credential removed.');
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
    try {
      if (isNew) {
        const res = await createEducationAction({
          period: editing.period || '',
          degree: editing.degree || '',
          institution: editing.institution || '',
          location: editing.location || '',
          focus: editing.focus || '',
          sortOrder: editing.sortOrder ?? 0,
        });
        if (res.education) {
          setList((prev) => [...prev, res.education as Education]);
        }
        toast.success('Academic credential created.');
      } else if (editing.id) {
        await updateEducationAction(editing.id, {
          period: editing.period,
          degree: editing.degree,
          institution: editing.institution,
          location: editing.location,
          focus: editing.focus,
          sortOrder: editing.sortOrder,
        });
        setList((prev) =>
          prev.map((e) =>
            e.id === editing.id ? ({ ...e, ...editing } as Education) : e
          )
        );
        toast.success('Academic credential updated.');
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
        <span className={styles.countText}>Credentials: {list.length}</span>
        <Button
          variant="primary"
          onClick={handleNew}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Credential
        </Button>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-6 h-6" />}
          title="No Education Records"
          description="Add academic degrees, visual media training, and institutional certifications."
          action={
            <Button variant="secondary" size="sm" onClick={handleNew}>
              Add First Credential
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {list.map((edu) => (
            <div key={edu.id} className={styles.eduCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.degree}>{edu.degree}</h3>
                  <p className={styles.institution}>
                    {edu.institution} · {edu.location}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Badge variant="gold">{edu.period}</Badge>
                  <div className={styles.actions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(edu)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      aria-label="Edit credential"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTargetId(edu.id)}
                      icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
                      aria-label="Delete credential"
                    />
                  </div>
                </div>
              </div>

              {edu.focus && <p className={styles.focusText}>{edu.focus}</p>}
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
                {isNew ? 'New Credential' : `Edit: ${editing.degree}`}
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
                  label="Degree / Diploma Program"
                  required
                  value={editing.degree || ''}
                  placeholder="Management Information Systems (Media Focus)"
                  onChange={(e) => setEditing({ ...editing, degree: e.target.value })}
                />

                <Input
                  label="Institution / University"
                  required
                  value={editing.institution || ''}
                  placeholder="SETEC Institute"
                  onChange={(e) =>
                    setEditing({ ...editing, institution: e.target.value })
                  }
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <Input
                    label="Academic Period"
                    required
                    value={editing.period || ''}
                    placeholder="2022 — PRESENT"
                    onChange={(e) => setEditing({ ...editing, period: e.target.value })}
                  />
                  <Input
                    label="Location"
                    required
                    value={editing.location || ''}
                    placeholder="Phnom Penh, Cambodia"
                    onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Curriculum &amp; Technical Focus"
                  required
                  value={editing.focus || ''}
                  onChange={(e) => setEditing({ ...editing, focus: e.target.value })}
                  rows={4}
                  placeholder="Digital media systems, visual typography..."
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
                  {isNew ? 'Create Credential' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Academic Credential?"
        message="This academic record will be permanently deleted from the database."
        confirmLabel="Delete Credential"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
