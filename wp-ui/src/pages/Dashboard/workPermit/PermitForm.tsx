import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Chips } from 'primereact/chips';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toast } from 'primereact/toast';
import { workPermitService, workAreaService, permitTypeService } from '../../../services/workPermitService';
import type { CreatePermitPayload, PermitType, WorkArea, PermitPriority } from '../../../types/workPermitTypes';

const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

const PermitForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [permitTypes, setPermitTypes] = useState<PermitType[]>([]);
  const [workAreas, setWorkAreas] = useState<WorkArea[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CreatePermitPayload & { id?: number }>({
    permit_type_id: 0,
    work_area_id: 0,
    requested_by: 0,
    title: '',
    work_description: '',
    planned_start: '',
    planned_end: '',
    priority: 'medium',
    safety_precautions: [],
    ppe_requirements: [],
    special_conditions: '',
  });

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Work Permits', command: () => navigate('/dashboard/work-permits') },
    { label: isEdit ? 'Edit' : 'New Permit' },
  ];

  useEffect(() => {
    Promise.all([
      permitTypeService.list(),
      workAreaService.list({ per_page: 100 }),
    ]).then(([types, areas]) => {
      setPermitTypes(types);
      setWorkAreas(areas.data);
    });
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      workPermitService.detail(Number(id)).then((p) => {
        setForm({
          id: p.id,
          permit_type_id: p.permit_type_id,
          work_area_id: p.work_area_id,
          requested_by: p.requested_by,
          title: p.title,
          work_description: p.work_description,
          planned_start: p.planned_start,
          planned_end: p.planned_end,
          priority: p.priority,
          safety_precautions: p.safety_precautions || [],
          ppe_requirements: p.ppe_requirements || [],
          special_conditions: p.special_conditions || '',
        });
      });
    }
  }, [isEdit, id]);

  const handleSave = async () => {
    if (!form.title || !form.permit_type_id || !form.work_area_id || !form.planned_start || !form.planned_end) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please fill all required fields' });
      return;
    }
    setSaving(true);
    try {
      const payload: CreatePermitPayload = { ...form };
      if (isEdit && form.id) {
        await workPermitService.update(form.id, payload);
        toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Permit updated' });
      } else {
        const created = await workPermitService.create(payload);
        toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Permit created' });
        navigate(`/dashboard/work-permits/${created.id}`);
        return;
      }
      navigate('/dashboard/work-permits');
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="mb-3 border-none p-0" />

      <Card className="shadow-1" title={isEdit ? 'Edit Work Permit' : 'Create New Work Permit'}>
        <div className="grid">
          {/* Title */}
          <div className="col-12">
            <label className="font-bold block mb-1">Title *</label>
            <InputText value={form.title} onChange={(e) => update('title', e.target.value)} className="w-full" placeholder="Enter permit title" />
          </div>

          {/* Permit Type & Work Area */}
          <div className="col-12 md:col-6">
            <label className="font-bold block mb-1">Permit Type *</label>
            <Dropdown
              value={form.permit_type_id}
              options={permitTypes.map((pt) => ({ label: `${pt.code} — ${pt.name}`, value: pt.id }))}
              onChange={(e) => update('permit_type_id', e.value)}
              placeholder="Select permit type"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-6">
            <label className="font-bold block mb-1">Work Area *</label>
            <Dropdown
              value={form.work_area_id}
              options={workAreas.map((wa) => ({ label: `${wa.code} — ${wa.name}`, value: wa.id }))}
              onChange={(e) => update('work_area_id', e.value)}
              placeholder="Select work area"
              className="w-full"
            />
          </div>

          {/* Priority & Dates */}
          <div className="col-12 md:col-4">
            <label className="font-bold block mb-1">Priority</label>
            <Dropdown
              value={form.priority}
              options={PRIORITY_OPTIONS}
              onChange={(e) => update('priority', e.value as PermitPriority)}
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-4">
            <label className="font-bold block mb-1">Planned Start *</label>
            <Calendar
              value={form.planned_start ? new Date(form.planned_start) : null}
              onChange={(e) => update('planned_start', e.value ? (e.value as Date).toISOString() : '')}
              showTime
              hourFormat="24"
              className="w-full"
            />
          </div>
          <div className="col-12 md:col-4">
            <label className="font-bold block mb-1">Planned End *</label>
            <Calendar
              value={form.planned_end ? new Date(form.planned_end) : null}
              onChange={(e) => update('planned_end', e.value ? (e.value as Date).toISOString() : '')}
              showTime
              hourFormat="24"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="col-12">
            <label className="font-bold block mb-1">Work Description *</label>
            <InputTextarea value={form.work_description} onChange={(e) => update('work_description', e.target.value)} rows={4} className="w-full" />
          </div>

          {/* PPE & Safety */}
          <div className="col-12 md:col-6">
            <label className="font-bold block mb-1">PPE Requirements (press Enter to add)</label>
            <Chips value={form.ppe_requirements} onChange={(e) => update('ppe_requirements', e.value)} className="w-full" />
          </div>
          <div className="col-12 md:col-6">
            <label className="font-bold block mb-1">Safety Precautions (press Enter to add)</label>
            <Chips value={form.safety_precautions} onChange={(e) => update('safety_precautions', e.value)} className="w-full" />
          </div>

          {/* Special Conditions */}
          <div className="col-12">
            <label className="font-bold block mb-1">Special Conditions</label>
            <InputTextarea value={form.special_conditions} onChange={(e) => update('special_conditions', e.target.value)} rows={2} className="w-full" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-content-end gap-2 mt-4">
          <Button label="Cancel" severity="secondary" text onClick={() => navigate('/dashboard/work-permits')} />
          <Button label={isEdit ? 'Update Permit' : 'Create Permit'} icon="pi pi-save" onClick={handleSave} loading={saving} />
        </div>
      </Card>
    </div>
  );
};

export default PermitForm;
