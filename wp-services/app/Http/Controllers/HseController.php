<?php

namespace App\Http\Controllers;

use App\Models\ToolboxMeeting;
use App\Models\ToolboxAttendee;
use App\Models\SafetyObservation;
use App\Models\ObservationPhoto;
use App\Models\CorrectiveAction;
use App\Models\Incident;
use App\Models\IncidentWitness;
use App\Models\IncidentRootCause;
use App\Models\AuditTrail;
use Illuminate\Http\Request;

class HseController extends Controller
{
    // ================================================================
    // TOOLBOX MEETINGS
    // ================================================================

    public function indexToolbox(Request $request)
    {
        $query = ToolboxMeeting::with(['workArea', 'conductor']);

        if ($request->has('status'))    $query->where('status', $request->status);
        if ($request->has('date_from')) $query->where('meeting_date', '>=', $request->date_from);
        if ($request->has('date_to'))   $query->where('meeting_date', '<=', $request->date_to);
        if ($request->has('work_area')) $query->where('work_area_id', $request->work_area);

        return $this->paginatedResponse(
            $query->orderBy('meeting_date', 'desc')->paginate($request->get('per_page', 15))
        );
    }

    public function showToolbox($id)
    {
        $tbm = ToolboxMeeting::with(['workArea', 'workPermit', 'conductor', 'attendees.personnel'])->find($id);
        if (!$tbm) return $this->notFoundResponse();
        return $this->successResponse($tbm);
    }

    public function storeToolbox(Request $request)
    {
        $this->validate($request, [
            'title'        => 'required|string|max:255',
            'topic'        => 'required|string',
            'conducted_by' => 'required|string',
            'meeting_date' => 'required|date',
        ]);

        $tbm = ToolboxMeeting::create(array_merge($request->all(), [
            'meeting_number' => ToolboxMeeting::generateNumber(),
            'status'         => $request->get('status', 'planned'),
        ]));

        // Tambahkan peserta bila diberikan
        if ($request->has('attendees')) {
            foreach ($request->attendees as $att) {
                ToolboxAttendee::create(array_merge($att, [
                    'toolbox_meeting_id' => $tbm->id,
                ]));
            }
        }

        AuditTrail::log('hse', $tbm, 'created', $request->conducted_by);

        return $this->successResponse($tbm->load('attendees'), 'Toolbox meeting berhasil dibuat', 201);
    }

    public function updateToolbox(Request $request, $id)
    {
        $tbm = ToolboxMeeting::find($id);
        if (!$tbm) return $this->notFoundResponse();
        $tbm->update($request->all());
        return $this->successResponse($tbm->fresh()->load('attendees'));
    }

    public function completeToolbox(Request $request, $id)
    {
        $tbm = ToolboxMeeting::find($id);
        if (!$tbm) return $this->notFoundResponse();

        $tbm->update(['status' => 'completed']);
        AuditTrail::log('hse', $tbm, 'completed', $request->get('completed_by', 'User'));

        return $this->successResponse($tbm->fresh());
    }

    // ================================================================
    // SAFETY OBSERVATIONS & INSPECTIONS
    // ================================================================

    public function indexObservations(Request $request)
    {
        $query = SafetyObservation::with(['workArea', 'reporter']);

        if ($request->has('type'))     $query->where('type', $request->type);
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->has('severity')) $query->bySeverity($request->severity);
        if ($request->has('status'))   $query->where('status', $request->status);
        if ($request->has('date_from')) $query->where('observed_at', '>=', $request->date_from);
        if ($request->has('date_to'))   $query->where('observed_at', '<=', $request->date_to);

        return $this->paginatedResponse(
            $query->orderBy('observed_at', 'desc')->paginate($request->get('per_page', 15))
        );
    }

    public function showObservation($id)
    {
        $obs = SafetyObservation::with(['workArea', 'workPermit', 'reporter', 'photos', 'correctiveActions.assignee'])->find($id);
        if (!$obs) return $this->notFoundResponse();
        return $this->successResponse($obs);
    }

    public function storeObservation(Request $request)
    {
        $this->validate($request, [
            'type'             => 'required|in:observation,inspection,audit',
            'category'         => 'required|string',
            'reported_by_name' => 'required|string',
            'observed_at'      => 'required|date',
            'description'      => 'required|string',
            'severity'         => 'required|in:low,medium,high,critical',
        ]);

        $obs = SafetyObservation::create(array_merge($request->all(), [
            'observation_number' => SafetyObservation::generateNumber(),
            'is_mobile_report'   => $request->get('is_mobile_report', false),
        ]));

        AuditTrail::log('hse', $obs, 'created', $request->reported_by_name, $request->reported_by_id);

        return $this->successResponse($obs, 'Observasi berhasil dilaporkan', 201);
    }

    public function addObservationPhoto(Request $request, $id)
    {
        $obs = SafetyObservation::find($id);
        if (!$obs) return $this->notFoundResponse();

        $this->validate($request, [
            'photo_path' => 'required|string',
        ]);

        $photo = ObservationPhoto::create(array_merge($request->all(), [
            'safety_observation_id' => $id,
        ]));

        return $this->successResponse($photo, 'Foto berhasil ditambahkan', 201);
    }

    public function assignCorrectiveAction(Request $request, $observationId)
    {
        $obs = SafetyObservation::find($observationId);
        if (!$obs) return $this->notFoundResponse();

        $this->validate($request, [
            'description'      => 'required|string',
            'assigned_to_name' => 'required|string',
            'due_date'         => 'required|date|after_or_equal:today',
            'priority'         => 'in:low,medium,high,critical',
        ]);

        $ca = CorrectiveAction::create(array_merge($request->all(), [
            'action_number'   => CorrectiveAction::generateNumber(),
            'actionable_type' => SafetyObservation::class,
            'actionable_id'   => $observationId,
        ]));

        $obs->update(['status' => 'action_assigned']);

        return $this->successResponse($ca, 'Corrective action berhasil ditugaskan', 201);
    }

    // ================================================================
    // CORRECTIVE ACTIONS (cross-module)
    // ================================================================

    public function indexCorrectiveActions(Request $request)
    {
        $query = CorrectiveAction::with('assignee');

        if ($request->has('status'))   $query->where('status', $request->status);
        if ($request->has('priority')) $query->where('priority', $request->priority);
        if ($request->has('overdue') && $request->overdue) $query->overdue();

        return $this->paginatedResponse(
            $query->orderBy('due_date', 'asc')->paginate($request->get('per_page', 15))
        );
    }

    public function completeCorrectiveAction(Request $request, $id)
    {
        $ca = CorrectiveAction::find($id);
        if (!$ca) return $this->notFoundResponse();

        $ca->update([
            'status'           => 'completed',
            'completed_date'   => now(),
            'completion_notes' => $request->get('notes'),
            'evidence_path'    => $request->get('evidence_path'),
        ]);

        return $this->successResponse($ca->fresh());
    }

    // ================================================================
    // INCIDENTS & NEAR-MISS
    // ================================================================

    public function indexIncidents(Request $request)
    {
        $query = Incident::with(['workArea', 'reporter']);

        if ($request->has('type'))     $query->byType($request->type);
        if ($request->has('severity')) $query->where('severity', $request->severity);
        if ($request->has('status'))   $query->where('status', $request->status);
        if ($request->has('date_from')) $query->where('incident_date', '>=', $request->date_from);
        if ($request->has('date_to'))   $query->where('incident_date', '<=', $request->date_to);

        return $this->paginatedResponse(
            $query->orderBy('incident_date', 'desc')->paginate($request->get('per_page', 15))
        );
    }

    public function showIncident($id)
    {
        $incident = Incident::with([
            'workArea', 'workPermit', 'reporter',
            'witnesses', 'rootCauses', 'attachments',
            'correctiveActions.assignee',
        ])->find($id);

        if (!$incident) return $this->notFoundResponse();
        return $this->successResponse($incident);
    }

    public function storeIncident(Request $request)
    {
        $this->validate($request, [
            'type'             => 'required|string',
            'severity'         => 'required|in:minor,moderate,major,catastrophic',
            'reported_by_name' => 'required|string',
            'incident_date'    => 'required|date',
            'description'      => 'required|string',
        ]);

        $incident = Incident::create(array_merge($request->all(), [
            'incident_number' => Incident::generateNumber(),
            'reported_date'   => now(),
            'status'          => 'reported',
        ]));

        // Tambahkan saksi
        if ($request->has('witnesses')) {
            foreach ($request->witnesses as $w) {
                IncidentWitness::create(array_merge($w, ['incident_id' => $incident->id]));
            }
        }

        AuditTrail::log('incident', $incident, 'created', $request->reported_by_name, $request->reported_by_id);

        return $this->successResponse($incident->load('witnesses'), 'Insiden berhasil dilaporkan', 201);
    }

    public function updateIncident(Request $request, $id)
    {
        $incident = Incident::find($id);
        if (!$incident) return $this->notFoundResponse();
        $incident->update($request->all());
        return $this->successResponse($incident->fresh());
    }

    /**
     * Root Cause Analysis.
     */
    public function addRootCause(Request $request, $incidentId)
    {
        $incident = Incident::find($incidentId);
        if (!$incident) return $this->notFoundResponse();

        $this->validate($request, [
            'rca_method'    => 'required|in:5_why,fishbone,fault_tree,taproot,bowtie',
            'analysis_data' => 'required|array',
            'root_cause'    => 'required|string',
            'analyzed_by'   => 'required|string',
        ]);

        $rca = IncidentRootCause::create(array_merge($request->all(), [
            'incident_id' => $incidentId,
            'analyzed_at'  => now(),
        ]));

        $incident->update(['status' => 'rca_in_progress']);

        AuditTrail::log('incident', $incident, 'rca_added', $request->analyzed_by);

        return $this->successResponse($rca, 'Root cause analysis berhasil ditambahkan', 201);
    }

    /**
     * Tutup insiden.
     */
    public function closeIncident(Request $request, $id)
    {
        $incident = Incident::find($id);
        if (!$incident) return $this->notFoundResponse();

        $incident->update([
            'status'    => 'closed',
            'closed_at' => now(),
            'closed_by' => $request->get('closed_by', 'Admin'),
            'lessons_learned' => $request->get('lessons_learned'),
        ]);

        AuditTrail::log('incident', $incident, 'closed', $request->get('closed_by', 'Admin'));

        return $this->successResponse($incident->fresh());
    }
}
