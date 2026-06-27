import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Toast } from 'primereact/toast';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Timeline } from 'primereact/timeline';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { workPermitService } from '../../../services/workPermitService';
import type { WorkPermit, PermitApproval, PermitStatus, ClashDetection } from '../../../types/workPermitTypes';

const statusSeverity = (status: PermitStatus) => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'submitted': case 'under_review': case 'pending_approval': return 'info';
    case 'approved': case 'active': return 'success';
    case 'suspended': case 'expired': return 'warning';
    case 'completed': case 'closed': return null;
    case 'rejected': case 'cancelled': return 'danger';
    default: return 'info';
  }
};

const PermitDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [permit, setPermit] = useState<WorkPermit | null>(null);
  const [loading, setLoading] = useState(true);
  const [clashes, setClashes] = useState<ClashDetection[]>([]);

  // Approval Dialog
  const [showApproval, setShowApproval] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'approved' | 'rejected' | 'returned'>('approved');
  const [approvalRemarks, setApprovalRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  const breadcrumbHome = { icon: 'pi pi-home', command: () => navigate('/dashboard') };
  const breadcrumbItems = [
    { label: 'Work Permits', command: () => navigate('/dashboard/work-permits') },
    { label: permit?.permit_number || '...' },
  ];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    workPermitService
      .detail(Number(id))
      .then(setPermit)
      .catch(() => toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load permit' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!permit) return;
    setProcessing(true);
    try {
      const updated = await workPermitService.submit(permit.id);
      setPermit(updated);
      toast.current?.show({ severity: 'success', summary: 'Submitted', detail: 'Permit submitted for review' });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Submission failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleApproval = async () => {
    if (!permit) return;
    setProcessing(true);
    try {
      const { permit: updated } = await workPermitService.processApproval(permit.id, {
        decision: approvalDecision,
        remarks: approvalRemarks,
        approver_id: 0, // This would come from user context in real app
      });
      setPermit(updated);
      setShowApproval(false);
      toast.current?.show({ severity: 'success', summary: 'Done', detail: `Permit ${approvalDecision}` });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Approval failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleActivate = async () => {
    if (!permit) return;
    setProcessing(true);
    try {
      const updated = await workPermitService.activate(permit.id);
      setPermit(updated);
      toast.current?.show({ severity: 'success', summary: 'Activated', detail: 'Permit is now active' });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Activation failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = async () => {
    if (!permit) return;
    setProcessing(true);
    try {
      const updated = await workPermitService.close(permit.id, { closure_remarks: 'Work completed' });
      setPermit(updated);
      toast.current?.show({ severity: 'success', summary: 'Closed', detail: 'Permit closed' });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Close failed' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckClash = async () => {
    if (!permit) return;
    try {
      const c = await workPermitService.checkClash(permit.id);
      setClashes(c);
      toast.current?.show({
        severity: c.length ? 'warn' : 'success',
        summary: c.length ? 'Clashes Found' : 'No Clashes',
        detail: c.length ? `${c.length} clash(es) detected` : 'No scheduling conflicts',
      });
    } catch {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Clash check failed' });
    }
  };

  // Approval timeline
  const approvalEvents = (permit?.approvals || []).map((a: PermitApproval) => ({
    status: a.decision,
    stage: a.stage_name,
    role: a.approver_role,
    approver: a.approver_name,
    remarks: a.remarks,
    date: a.decided_at ? new Date(a.decided_at).toLocaleString() : 'Pending',
    icon: a.decision === 'approved' ? 'pi pi-check-circle' : a.decision === 'rejected' ? 'pi pi-times-circle' : a.decision === 'returned' ? 'pi pi-replay' : 'pi pi-clock',
    color: a.decision === 'approved' ? '#22c55e' : a.decision === 'rejected' ? '#ef4444' : a.decision === 'returned' ? '#f59e0b' : '#94a3b8',
  }));

  if (loading) return <div className="p-4"><i className="pi pi-spin pi-spinner text-4xl" /></div>;
  if (!permit) return <div className="p-4"><p>Permit not found.</p></div>;

  return (
    <div className="p-4">
      <Toast ref={toast} />
      <BreadCrumb model={breadcrumbItems} home={breadcrumbHome} className="mb-3 border-none p-0" />

      {/* Header */}
      <Card className="shadow-1 mb-4">
        <div className="flex flex-wrap align-items-center justify-content-between gap-3">
          <div>
            <h2 className="text-xl font-bold m-0">{permit.permit_number}</h2>
            <p className="text-lg mt-1 mb-0">{permit.title}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Tag value={permit.status.replace(/_/g, ' ').toUpperCase()} severity={statusSeverity(permit.status) as any} className="text-sm" />
            <Tag value={permit.priority.toUpperCase()} severity={permit.priority === 'critical' ? 'danger' : permit.priority === 'high' ? 'danger' : permit.priority === 'medium' ? 'warning' : 'success'} className="text-sm" />
            {permit.has_clash && <Tag value="CLASH" severity="warning" icon="pi pi-exclamation-triangle" />}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {permit.status === 'draft' && (
            <>
              <Button label="Submit" icon="pi pi-send" size="small" onClick={handleSubmit} loading={processing} />
              <Button label="Edit" icon="pi pi-pencil" severity="info" size="small" onClick={() => navigate(`/dashboard/work-permits/${permit.id}/edit`)} />
            </>
          )}
          {['submitted', 'under_review', 'pending_approval'].includes(permit.status) && (
            <Button label="Process Approval" icon="pi pi-check-square" size="small" onClick={() => setShowApproval(true)} />
          )}
          {permit.status === 'approved' && (
            <Button label="Activate" icon="pi pi-play" severity="success" size="small" onClick={handleActivate} loading={processing} />
          )}
          {permit.status === 'active' && (
            <Button label="Close Permit" icon="pi pi-lock" severity="warning" size="small" onClick={handleClose} loading={processing} />
          )}
          <Button label="Check Clash" icon="pi pi-search" severity="secondary" outlined size="small" onClick={handleCheckClash} />
        </div>
      </Card>

      {/* Tabs */}
      <TabView>
        {/* Overview */}
        <TabPanel header="Overview">
          <div className="grid">
            <div className="col-12 md:col-6">
              <h4 className="text-500 text-sm mb-2">Work Description</h4>
              <p className="line-height-3">{permit.work_description}</p>

              <h4 className="text-500 text-sm mt-4 mb-2">Schedule</h4>
              <div className="grid">
                <div className="col-6"><span className="text-500 block text-xs">Planned Start</span><strong>{new Date(permit.planned_start).toLocaleString()}</strong></div>
                <div className="col-6"><span className="text-500 block text-xs">Planned End</span><strong>{new Date(permit.planned_end).toLocaleString()}</strong></div>
                {permit.actual_start && <div className="col-6"><span className="text-500 block text-xs">Actual Start</span><strong>{new Date(permit.actual_start).toLocaleString()}</strong></div>}
                {permit.actual_end && <div className="col-6"><span className="text-500 block text-xs">Actual End</span><strong>{new Date(permit.actual_end).toLocaleString()}</strong></div>}
              </div>

              {permit.special_conditions && (<><h4 className="text-500 text-sm mt-4 mb-2">Special Conditions</h4><p>{permit.special_conditions}</p></>)}
              {permit.rejection_reason && (<><h4 className="text-500 text-sm mt-4 mb-2 text-red-500">Rejection Reason</h4><p>{permit.rejection_reason}</p></>)}
            </div>
            <div className="col-12 md:col-6">
              <h4 className="text-500 text-sm mb-2">Permit Type</h4>
              <p>{permit.permit_type?.name || '-'}</p>
              <h4 className="text-500 text-sm mt-4 mb-2">Work Area</h4>
              <p>{permit.work_area?.name || '-'} {permit.work_area?.zone_type && <Tag value={permit.work_area.zone_type} className="ml-2" severity="info" />}</p>

              {permit.ppe_requirements && permit.ppe_requirements.length > 0 && (
                <>
                  <h4 className="text-500 text-sm mt-4 mb-2">PPE Requirements</h4>
                  <div className="flex flex-wrap gap-1">{permit.ppe_requirements.map((p, i) => <Tag key={i} value={p} />)}</div>
                </>
              )}
              {permit.safety_precautions && permit.safety_precautions.length > 0 && (
                <>
                  <h4 className="text-500 text-sm mt-4 mb-2">Safety Precautions</h4>
                  <ul className="pl-3 m-0">{permit.safety_precautions.map((s, i) => <li key={i} className="py-1 text-sm">{s}</li>)}</ul>
                </>
              )}
            </div>
          </div>
        </TabPanel>

        {/* Approval Workflow */}
        <TabPanel header="Approval Workflow">
          {approvalEvents.length > 0 ? (
            <Timeline
              value={approvalEvents}
              opposite={(item) => <span className="text-500 text-sm">{item.date}</span>}
              content={(item) => (
                <div>
                  <span className="font-bold">{item.stage}</span>
                  {item.role && <span className="text-500 text-sm ml-2">({item.role})</span>}
                  {item.approver && <div className="text-sm">By: {item.approver}</div>}
                  {item.remarks && <div className="text-sm text-500 mt-1">{item.remarks}</div>}
                </div>
              )}
              marker={(item) => (
                <span className="flex align-items-center justify-content-center border-circle" style={{ width: 32, height: 32, backgroundColor: item.color }}>
                  <i className={`${item.icon} text-white text-sm`} />
                </span>
              )}
            />
          ) : (
            <p className="text-500">No approval stages configured.</p>
          )}
        </TabPanel>

        {/* Risk Assessment */}
        <TabPanel header="Risk Assessment">
          <DataTable value={permit.risk_assessments || []} emptyMessage="No risk assessments." stripedRows size="small">
            <Column field="hazard_category" header="Category" />
            <Column field="hazard_description" header="Hazard" />
            <Column field="likelihood" header="L" style={{ width: '4%' }} />
            <Column field="severity" header="S" style={{ width: '4%' }} />
            <Column field="risk_score" header="Score" style={{ width: '6%' }} />
            <Column field="risk_level" header="Level" body={(r) => <Tag value={r.risk_level?.toUpperCase()} severity={r.risk_level === 'extreme' || r.risk_level === 'high' ? 'danger' : r.risk_level === 'medium' ? 'warning' : 'success'} />} />
            <Column field="control_measures" header="Controls" />
          </DataTable>
        </TabPanel>

        {/* Personnel */}
        <TabPanel header="Personnel">
          <DataTable value={permit.personnel || []} emptyMessage="No personnel assigned." stripedRows size="small">
            <Column field="employee_id" header="Employee ID" />
            <Column field="name" header="Name" />
            <Column field="company" header="Company" />
            <Column field="position" header="Position" />
          </DataTable>
        </TabPanel>

        {/* Equipment */}
        <TabPanel header="Equipment">
          <DataTable value={permit.equipment || []} emptyMessage="No equipment assigned." stripedRows size="small">
            <Column field="equipment_id" header="Equipment ID" />
            <Column field="name" header="Name" />
            <Column field="type" header="Type" />
            <Column field="condition" header="Condition" body={(r) => <Tag value={r.condition} severity={r.condition === 'good' ? 'success' : r.condition === 'fair' ? 'warning' : 'danger'} />} />
          </DataTable>
        </TabPanel>

        {/* Clash Detection */}
        <TabPanel header="Clashes">
          <DataTable value={clashes.length ? clashes : (permit.clashes || [])} emptyMessage="No clashes detected." stripedRows size="small">
            <Column field="clash_type" header="Type" body={(r) => <Tag value={r.clash_type} />} />
            <Column field="severity" header="Severity" body={(r) => <Tag value={r.severity} severity={r.severity === 'critical' ? 'danger' : 'warning'} />} />
            <Column field="description" header="Description" />
            <Column field="resolution_status" header="Resolution" body={(r) => <Tag value={r.resolution_status} severity={r.resolution_status === 'resolved' ? 'success' : 'warning'} />} />
          </DataTable>
        </TabPanel>
      </TabView>

      {/* Approval Dialog */}
      <Dialog
        header="Process Approval"
        visible={showApproval}
        onHide={() => setShowApproval(false)}
        style={{ width: '30rem' }}
        footer={
          <div>
            <Button label="Cancel" severity="secondary" text onClick={() => setShowApproval(false)} />
            <Button label="Submit" icon="pi pi-check" onClick={handleApproval} loading={processing} />
          </div>
        }
      >
        <div className="flex flex-column gap-3">
          <div>
            <label className="font-bold block mb-1">Decision</label>
            <Dropdown
              value={approvalDecision}
              options={[
                { label: 'Approve', value: 'approved' },
                { label: 'Reject', value: 'rejected' },
                { label: 'Return for Revision', value: 'returned' },
              ]}
              onChange={(e) => setApprovalDecision(e.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="font-bold block mb-1">Remarks</label>
            <InputTextarea value={approvalRemarks} onChange={(e) => setApprovalRemarks(e.target.value)} rows={4} className="w-full" />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PermitDetail;
