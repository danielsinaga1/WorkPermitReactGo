import { useState, useRef, useCallback, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { lessonService } from '../../services/extendedHseService';
import type { LessonLearned } from '../../types/workPermitTypes';

interface Props {
  permitId: number;
  personnelId: number;
  visible: boolean;
  onHide: () => void;
  /** Called when ALL mandatory lessons are acknowledged */
  onAllAcknowledged: () => void;
}

export default function LessonLearnedModal({ permitId, personnelId, visible, onHide, onAllAcknowledged }: Props) {
  const toast = useRef<Toast>(null);
  const [lessons, setLessons] = useState<LessonLearned[]>([]);
  const [loading, setLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (visible) {
      setLoading(true);
      lessonService.getMandatory(permitId)
        .then((data) => {
          setLessons(data);
          // Pre-populate already-acknowledged lessons
          const preAcked = new Set<number>();
          data.forEach((l) => { if (l.is_acknowledged) preAcked.add(l.id); });
          setAcknowledged(preAcked);
        })
        .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load lessons' }))
        .finally(() => setLoading(false));
    }
  }, [visible, permitId]);

  const handleAcknowledge = useCallback(async (lessonId: number) => {
    try {
      await lessonService.acknowledge(lessonId, personnelId, permitId);
      setAcknowledged((prev) => new Set(prev).add(lessonId));
      toast.current?.show({ severity: 'success', summary: 'Acknowledged', detail: 'Lesson acknowledged' });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to acknowledge' });
    }
  }, [personnelId, permitId]);

  const allDone = lessons.length > 0 && lessons.every((l) => acknowledged.has(l.id));

  useEffect(() => {
    if (allDone && visible) onAllAcknowledged();
  }, [allDone, visible, onAllAcknowledged]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="📖 Mandatory Lessons Learned"
        visible={visible}
        onHide={onHide}
        style={{ width: '640px' }}
        data-testid="lesson-learned-dialog"
        closable={allDone}
      >
        {loading ? (
          <p>Loading…</p>
        ) : lessons.length === 0 ? (
          <p className="text-green-600 font-semibold" data-testid="no-mandatory-lessons">
            No mandatory lessons for this permit type.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600">
              You must read and acknowledge all lessons below before proceeding.
            </p>
            {lessons.map((lesson) => (
              <div key={lesson.id} className="border rounded p-3" data-testid={`lesson-${lesson.id}`}>
                <h4 className="font-semibold text-md mb-1">{lesson.title}</h4>
                {lesson.incident_id && (
                  <p className="text-xs text-gray-400 mb-1">Incident ID: {lesson.incident_id}</p>
                )}
                <p className="text-sm mb-2">{lesson.summary}</p>
                <div className="bg-yellow-50 rounded p-2 mb-2">
                  <strong className="text-sm">Preventive Measures:</strong>
                  <p className="text-sm">{lesson.preventive_measures}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={acknowledged.has(lesson.id)}
                    onChange={() => {
                      if (!acknowledged.has(lesson.id)) handleAcknowledge(lesson.id);
                    }}
                    disabled={acknowledged.has(lesson.id)}
                    data-testid={`ack-checkbox-${lesson.id}`}
                  />
                  <span className="text-sm">
                    {acknowledged.has(lesson.id) ? '✅ Acknowledged' : 'I have read and understood this lesson'}
                  </span>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <Button
                label="Continue"
                icon="pi pi-arrow-right"
                disabled={!allDone}
                onClick={onHide}
                data-testid="btn-lessons-continue"
              />
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
