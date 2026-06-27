<?php

namespace App\Http\Controllers;

use App\Models\TrainingProgram;
use App\Models\TrainingSession;
use App\Models\TrainingRecord;
use App\Models\TrainingMatrix;
use App\Models\CertificationReminder;
use App\Models\Personnel;
use App\Models\PersonnelQualification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrainingController extends Controller
{
    // ============= PROGRAMS =============
    public function indexPrograms(Request $request)
    {
        $query = TrainingProgram::query();
        if ($request->has('category')) $query->where('category', $request->category);
        if ($request->boolean('mandatory_only')) $query->where('is_mandatory', true);
        return response()->json(['success' => true, 'data' => $query->orderBy('name')->get()]);
    }

    public function showProgram($id)
    {
        return response()->json([
            'success' => true,
            'data' => TrainingProgram::with('sessions')->findOrFail($id),
        ]);
    }

    public function storeProgram(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:training_programs',
            'name' => 'required|string',
            'category' => 'required|string',
            'validity_months' => 'integer|min:1',
            'duration_hours' => 'integer|min:1',
        ]);
        $program = TrainingProgram::create($request->all());
        return response()->json(['success' => true, 'data' => $program], 201);
    }

    public function updateProgram(Request $request, $id)
    {
        $program = TrainingProgram::findOrFail($id);
        $program->update($request->all());
        return response()->json(['success' => true, 'data' => $program]);
    }

    // ============= SESSIONS =============
    public function indexSessions(Request $request)
    {
        $query = TrainingSession::with('program');
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('from')) $query->where('scheduled_start', '>=', $request->from);
        if ($request->has('to')) $query->where('scheduled_end', '<=', $request->to);
        return response()->json([
            'success' => true,
            'data' => $query->orderBy('scheduled_start', 'desc')->paginate(20),
        ]);
    }

    public function storeSession(Request $request)
    {
        $this->validate($request, [
            'training_program_id' => 'required|exists:training_programs,id',
            'session_code' => 'required|unique:training_sessions',
            'scheduled_start' => 'required|date',
            'scheduled_end' => 'required|date|after:scheduled_start',
            'trainer_name' => 'required|string',
        ]);
        $session = TrainingSession::create($request->all());
        return response()->json(['success' => true, 'data' => $session], 201);
    }

    public function completeSession(Request $request, $id)
    {
        $this->validate($request, [
            'records' => 'required|array',
            'records.*.personnel_id' => 'required|exists:personnel,id',
            'records.*.result' => 'required|in:pass,fail,pending',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $session = TrainingSession::with('program')->findOrFail($id);
            $validityMonths = $session->program->validity_months;

            foreach ($request->records as $rec) {
                $expiry = isset($rec['completion_date'])
                    ? \Carbon\Carbon::parse($rec['completion_date'])->addMonths($validityMonths)
                    : now()->addMonths($validityMonths);

                $record = TrainingRecord::updateOrCreate(
                    [
                        'training_session_id' => $session->id,
                        'personnel_id' => $rec['personnel_id'],
                    ],
                    [
                        'completion_date' => $rec['completion_date'] ?? now(),
                        'expiry_date' => $rec['result'] === 'pass' ? $expiry : null,
                        'score' => $rec['score'] ?? null,
                        'result' => $rec['result'],
                        'certificate_number' => $rec['certificate_number'] ?? null,
                        'remarks' => $rec['remarks'] ?? null,
                    ]
                );

                if ($rec['result'] === 'pass') {
                    $this->createReminder('training', $record->id, $rec['personnel_id'], $expiry);
                }
            }

            $session->update(['status' => 'completed']);

            return response()->json([
                'success' => true,
                'data' => $session->load('records'),
            ]);
        });
    }

    // ============= RECORDS =============
    public function indexRecords(Request $request)
    {
        $query = TrainingRecord::with(['session.program', 'personnel']);
        if ($request->has('personnel_id')) $query->where('personnel_id', $request->personnel_id);
        if ($request->has('result')) $query->where('result', $request->result);
        if ($request->boolean('expiring_soon')) $query->expiringSoon($request->input('days', 30));
        if ($request->boolean('expired')) $query->expired();
        return response()->json([
            'success' => true,
            'data' => $query->latest()->paginate(50),
        ]);
    }

    public function personnelTrainingMatrix($personnelId)
    {
        $personnel = Personnel::findOrFail($personnelId);
        $position = $personnel->position;

        $required = TrainingMatrix::with('program')
            ->where('role_or_position', $position)
            ->where('is_required', true)
            ->get();

        $records = TrainingRecord::with('session.program')
            ->where('personnel_id', $personnelId)
            ->where('result', 'pass')
            ->get()
            ->keyBy(fn($r) => $r->session->training_program_id);

        $matrix = $required->map(function ($req) use ($records) {
            $record = $records->get($req->training_program_id);
            $isExpired = $record && $record->expiry_date && $record->expiry_date->isPast();
            $daysToExpiry = $record && $record->expiry_date
                ? now()->diffInDays($record->expiry_date, false)
                : null;

            return [
                'program' => $req->program,
                'is_required' => $req->is_required,
                'has_record' => (bool) $record,
                'completion_date' => $record?->completion_date,
                'expiry_date' => $record?->expiry_date,
                'days_to_expiry' => $daysToExpiry,
                'status' => !$record ? 'missing' : ($isExpired ? 'expired' : ($daysToExpiry < 30 ? 'expiring' : 'valid')),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'personnel' => $personnel,
                'matrix' => $matrix,
                'compliance_rate' => $required->count() > 0
                    ? round(($matrix->where('status', 'valid')->count() / $required->count()) * 100, 2)
                    : 100,
            ],
        ]);
    }

    // ============= MATRIX (training requirements per role) =============
    public function indexMatrix()
    {
        return response()->json([
            'success' => true,
            'data' => TrainingMatrix::with('program')->get()->groupBy('role_or_position'),
        ]);
    }

    public function storeMatrix(Request $request)
    {
        $this->validate($request, [
            'role_or_position' => 'required|string',
            'training_program_id' => 'required|exists:training_programs,id',
            'is_required' => 'boolean',
        ]);
        $matrix = TrainingMatrix::updateOrCreate(
            [
                'role_or_position' => $request->role_or_position,
                'training_program_id' => $request->training_program_id,
            ],
            $request->only(['is_required', 'refresh_months'])
        );
        return response()->json(['success' => true, 'data' => $matrix], 201);
    }

    public function destroyMatrix($id)
    {
        TrainingMatrix::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ============= EXPIRY DASHBOARD =============
    public function expiryDashboard(Request $request)
    {
        $days = $request->input('days', 60);

        $trainings = TrainingRecord::with(['personnel', 'session.program'])
            ->expiringSoon($days)->get();

        $qualifications = PersonnelQualification::with('personnel')
            ->expiringSoon($days)->get();

        $expiredTrainings = TrainingRecord::with(['personnel', 'session.program'])
            ->expired()->where('result', 'pass')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'expiring_trainings' => $trainings,
                'expiring_qualifications' => $qualifications,
                'expired_trainings' => $expiredTrainings,
                'total_expiring' => $trainings->count() + $qualifications->count(),
                'total_expired' => $expiredTrainings->count(),
            ],
        ]);
    }

    private function createReminder(string $type, int $sourceId, int $personnelId, $expiry): void
    {
        foreach ([60, 30, 7] as $days) {
            $notifyAt = \Carbon\Carbon::parse($expiry)->subDays($days);
            if ($notifyAt->isFuture()) {
                CertificationReminder::create([
                    'source_type' => $type,
                    'source_id' => $sourceId,
                    'personnel_id' => $personnelId,
                    'expiry_date' => $expiry,
                    'days_before' => $days,
                    'notify_at' => $notifyAt,
                    'channel' => 'in_app',
                ]);
            }
        }
    }
}
