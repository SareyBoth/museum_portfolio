'use client';

import React, { useState } from 'react';
import {
  updateInquiryStatusAction,
  updateInquiryNotesAction,
  deleteInquiryAction,
} from '../actions';
import { Trash2, Send, Mail, Clock, Check } from 'lucide-react';
import { Button } from '@/components/admin/ui/Button';
import { Textarea, Select } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog';
import { EmptyState } from '@/components/admin/ui/EmptyState';
import { useAdminToast } from '@/components/admin/ui/Toast';
import styles from './InquiriesInbox.module.scss';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  service: string | null;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  adminNotes: string | null;
  ipAddress: string | null;
  createdAt: Date;
}

export function InquiriesInbox({
  initialInquiries,
}: {
  initialInquiries: Inquiry[];
}) {
  const toast = useAdminToast();
  const [list, setList] = useState<Inquiry[]>(initialInquiries);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(
    initialInquiries.length > 0 ? initialInquiries[0] : null
  );
  const [notes, setNotes] = useState(
    initialInquiries.length > 0 ? initialInquiries[0].adminNotes || '' : ''
  );
  const [savingNotes, setSavingNotes] = useState(false);

  // Deletion state
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = filter === 'all' ? list : list.filter((i) => i.status === filter);

  const handleSelect = (inquiry: Inquiry) => {
    setActiveInquiry(inquiry);
    setNotes(inquiry.adminNotes || '');
    if (inquiry.status === 'new') {
      handleStatusChange(inquiry.id, 'read');
    }
  };

  const handleStatusChange = async (
    id: number,
    status: 'new' | 'read' | 'replied' | 'archived'
  ) => {
    await updateInquiryStatusAction(id, status);
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    if (activeInquiry?.id === id) {
      setActiveInquiry((prev) => (prev ? { ...prev, status } : null));
    }
    toast.info(`Inquiry marked as ${status}.`);
  };

  const handleSaveNotes = async () => {
    if (!activeInquiry) return;
    setSavingNotes(true);
    try {
      await updateInquiryNotesAction(activeInquiry.id, notes);
      setList((prev) =>
        prev.map((i) =>
          i.id === activeInquiry.id ? { ...i, adminNotes: notes } : i
        )
      );
      toast.success('Admin notes saved.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save notes failed');
    } finally {
      setSavingNotes(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await deleteInquiryAction(deleteTargetId);
      setList((prev) => prev.filter((i) => i.id !== deleteTargetId));
      if (activeInquiry?.id === deleteTargetId) {
        const remaining = list.filter((i) => i.id !== deleteTargetId);
        setActiveInquiry(remaining.length > 0 ? remaining[0] : null);
      }
      toast.success('Inquiry permanently deleted.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((tab) => {
          const count =
            tab === 'all'
              ? list.length
              : list.filter((i) => i.status === tab).length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={[
                styles.filterBtn,
                filter === tab ? styles.active : '',
              ].join(' ')}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Mail className="w-6 h-6" />}
          title="Inbox Empty"
          description="There are currently no client inquiries matching this status filter."
        />
      ) : (
        <div className={styles.layoutGrid}>
          {/* Master List */}
          <div className={styles.inboxList}>
            {filtered.map((inquiry) => {
              const isSelected = activeInquiry?.id === inquiry.id;
              const isUnread = inquiry.status === 'new';
              const badgeVariant =
                inquiry.status === 'new'
                  ? 'gold'
                  : inquiry.status === 'read'
                    ? 'info'
                    : inquiry.status === 'replied'
                      ? 'success'
                      : 'neutral';

              return (
                <div
                  key={inquiry.id}
                  onClick={() => handleSelect(inquiry)}
                  className={[
                    styles.inboxItem,
                    isSelected ? styles.active : '',
                    isUnread ? styles.unread : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className={styles.itemTopLine}>
                    <div className={styles.itemClient}>
                      <span className={styles.clientName}>{inquiry.name}</span>
                      <span className={styles.clientEmail}>
                        &lt;{inquiry.email}&gt;
                      </span>
                    </div>
                    <Badge variant={badgeVariant} dot={isUnread}>
                      {inquiry.status}
                    </Badge>
                  </div>

                  <p className={styles.messageSnippet}>{inquiry.message}</p>

                  <div className={styles.itemBottomLine}>
                    <span>{inquiry.service || 'General Commission'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock className="w-3 h-3" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail Pane */}
          {activeInquiry ? (
            <div className={styles.detailCard}>
              <div className={styles.detailHeader}>
                <div className={styles.detailTitleRow}>
                  <div>
                    <h3 className={styles.detailName}>{activeInquiry.name}</h3>
                    <div className={styles.detailMetaGrid}>
                      <span>Email: {activeInquiry.email}</span>
                      <span>Service: {activeInquiry.service || 'General Commission'}</span>
                      <span>Dispatched: {new Date(activeInquiry.createdAt).toLocaleString()}</span>
                      {activeInquiry.ipAddress && (
                        <span>Origin IP: {activeInquiry.ipAddress}</span>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTargetId(activeInquiry.id)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    aria-label="Delete inquiry"
                  />
                </div>

                <div>
                  <a
                    href={`mailto:${activeInquiry.email}?subject=RE:%20Atelier%20Inquiry%20-%20SareyBoth&body=Hi%20${encodeURIComponent(
                      activeInquiry.name
                    )},%0D%0A%0D%0AThank%20you%20for%20reaching%20out%20to%20the%20atelier.`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={<Send className="w-3.5 h-3.5" />}
                    >
                      Reply via Email ↗
                    </Button>
                  </a>
                </div>
              </div>

              {/* Message Body */}
              <div className={styles.messageFull}>
                {activeInquiry.message}
              </div>

              {/* Status Selector */}
              <div className={styles.statusChangeSection}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6875rem', color: '#b8b0a4', textTransform: 'uppercase' }}>
                  Update State:
                </span>
                <Select
                  value={activeInquiry.status}
                  onChange={(e) =>
                    handleStatusChange(
                      activeInquiry.id,
                      e.target.value as Inquiry['status']
                    )
                  }
                  style={{ width: 140, minHeight: 34 }}
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>

              {/* Admin Private Notes */}
              <div className={styles.notesSection}>
                <Textarea
                  label="Private Studio Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes regarding budget, timeline, call notes..."
                  rows={3}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSaveNotes}
                    loading={savingNotes}
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.detailCard}>
              <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#b8b0a4', textAlign: 'center', margin: '2rem 0' }}>
                Select an inquiry from the ledger to inspect details.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Client Inquiry?"
        message="This message record will be permanently deleted from the inquiries queue."
        confirmLabel="Delete Message"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
