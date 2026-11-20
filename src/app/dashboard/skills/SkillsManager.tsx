'use client';

import React, { useState } from 'react';
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from '../actions';
import { Plus, Trash2, Edit2, X, Wrench } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Input, Textarea } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './SkillsManager.module.scss';

interface Skill {
  id: number;
  code: string;
  title: string;
  summary: string;
  tools: string[];
  sortOrder: number;
}

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const toast = useAdminToast();
  const [skillsList, setSkillsList] = useState<Skill[]>(initialSkills);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [toolsInput, setToolsInput] = useState('');
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  // Deletion confirm
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleNew = () => {
    setEditing({
      code: String(skillsList.length + 1).padStart(2, '0'),
      title: '',
      summary: '',
      tools: [],
      sortOrder: skillsList.length,
    });
    setToolsInput('');
    setIsNew(true);
  };

  const handleEdit = (s: Skill) => {
    setEditing({ ...s });
    setToolsInput(s.tools ? s.tools.join(', ') : '');
    setIsNew(false);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteSkillAction(deleteTargetId);
      setSkillsList((prev) => prev.filter((s) => s.id !== deleteTargetId));
      if (editing?.id === deleteTargetId) setEditing(null);
      toast.success('Craft competency removed.');
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

    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (isNew) {
        const res = await createSkillAction({
          code: editing.code || '',
          title: editing.title || '',
          summary: editing.summary || '',
          tools,
          sortOrder: editing.sortOrder ?? 0,
        });
        if (res.skill) setSkillsList((prev) => [...prev, res.skill as Skill]);
        toast.success('Craft competency created.');
      } else if (editing.id) {
        await updateSkillAction(editing.id, {
          code: editing.code,
          title: editing.title,
          summary: editing.summary,
          tools,
          sortOrder: editing.sortOrder,
        });
        setSkillsList((prev) =>
          prev.map((s) =>
            s.id === editing.id ? ({ ...s, ...editing, tools } as Skill) : s
          )
        );
        toast.success('Craft competency updated.');
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
        <span className={styles.countText}>
          Total competencies: {skillsList.length}
        </span>
        <Button
          variant="primary"
          onClick={handleNew}
          icon={<Plus className="w-4 h-4" />}
        >
          New Craft
        </Button>
      </div>

      {skillsList.length === 0 ? (
        <EmptyState
          icon={<Wrench className="w-6 h-6" />}
          title="No Skills Defined"
          description="Add technical competencies, software toolchains, and editorial crafts to feature on the portfolio."
          action={
            <Button variant="secondary" size="sm" onClick={handleNew}>
              Add First Craft
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {skillsList.map((skill) => (
            <div key={skill.id} className={styles.skillCard}>
              <div className={styles.cardHeader}>
                <span className={styles.codeBadge}>[0{skill.code}]</span>
                <div className={styles.actions}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    aria-label="Edit craft"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTargetId(skill.id)}
                    icon={<Trash2 className="w-3.5 h-3.5 text-red-400" />}
                    aria-label="Delete craft"
                  />
                </div>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.title}>{skill.title}</h3>
                <p className={styles.summary}>{skill.summary}</p>
              </div>

              <div className={styles.toolsList}>
                {skill.tools.map((tool) => (
                  <Badge key={tool} variant="neutral">
                    {tool}
                  </Badge>
                ))}
              </div>
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
                {isNew ? 'New Craft Competency' : `Edit: ${editing.title}`}
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
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
                  <Input
                    label="Index Code"
                    required
                    value={editing.code || ''}
                    placeholder="01"
                    onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                  />
                  <Input
                    label="Discipline Title"
                    required
                    value={editing.title || ''}
                    placeholder="Speed-Ramp & Kinetic Pacing"
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Craft Technical Summary"
                  required
                  value={editing.summary || ''}
                  onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                  rows={4}
                />

                <Input
                  label="Associated Tools &amp; Software (Comma Separated)"
                  value={toolsInput}
                  placeholder="Adobe Premiere Pro, DaVinci Resolve Studio"
                  onChange={(e) => setToolsInput(e.target.value)}
                  hint="Enter tool names separated by commas."
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
                  {isNew ? 'Create Craft' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Craft Competency?"
        message="This skill record will be permanently removed from your studio portfolio ledger."
        confirmLabel="Delete Craft"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
