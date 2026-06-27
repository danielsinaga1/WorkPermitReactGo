<?php

namespace App\Http\Controllers;

use App\Models\WorkArea;
use App\Models\Personnel;
use App\Models\PersonnelQualification;
use App\Models\Equipment;
use App\Models\EquipmentCertification;
use App\Models\PermitType;
use Illuminate\Http\Request;

class ResourceController extends Controller
{
    // ================================================================
    // WORK AREAS
    // ================================================================

    public function indexAreas(Request $request)
    {
        $query = WorkArea::query();
        if ($request->has('zone_type')) $query->byZone($request->zone_type);
        if ($request->has('active'))   $query->active();
        if ($request->has('search'))   $query->where('name', 'like', "%{$request->search}%");

        return $this->paginatedResponse($query->orderBy('name')->paginate($request->get('per_page', 50)));
    }

    public function showArea($id)
    {
        $area = WorkArea::with(['workPermits' => fn($q) => $q->active()])->find($id);
        if (!$area) return $this->notFoundResponse();
        return $this->successResponse($area);
    }

    public function storeArea(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:work_areas,code',
        ]);
        $area = WorkArea::create($request->all());
        return $this->successResponse($area, 'Area kerja berhasil dibuat', 201);
    }

    public function updateArea(Request $request, $id)
    {
        $area = WorkArea::find($id);
        if (!$area) return $this->notFoundResponse();
        $area->update($request->all());
        return $this->successResponse($area->fresh());
    }

    public function destroyArea($id)
    {
        $area = WorkArea::find($id);
        if (!$area) return $this->notFoundResponse();
        $area->delete();
        return $this->successResponse(null, 'Area kerja berhasil dihapus');
    }

    // ================================================================
    // PERSONNEL
    // ================================================================

    public function indexPersonnel(Request $request)
    {
        $query = Personnel::with('validQualifications');
        if ($request->has('company'))  $query->byCompany($request->company);
        if ($request->has('active'))   $query->active();
        if ($request->has('search'))   $query->search($request->search);

        return $this->paginatedResponse($query->orderBy('name')->paginate($request->get('per_page', 15)));
    }

    public function showPersonnel($id)
    {
        $person = Personnel::with(['qualifications', 'workPermits' => fn($q) => $q->latest()->limit(10)])->find($id);
        if (!$person) return $this->notFoundResponse();
        return $this->successResponse($person);
    }

    public function storePersonnel(Request $request)
    {
        $this->validate($request, [
            'employee_id' => 'required|string|unique:personnel,employee_id',
            'name'        => 'required|string|max:255',
            'company'     => 'required|string',
        ]);
        $person = Personnel::create($request->all());
        return $this->successResponse($person, 'Personel berhasil ditambahkan', 201);
    }

    public function updatePersonnel(Request $request, $id)
    {
        $person = Personnel::find($id);
        if (!$person) return $this->notFoundResponse();
        $person->update($request->all());
        return $this->successResponse($person->fresh());
    }

    public function addQualification(Request $request, $personnelId)
    {
        $person = Personnel::find($personnelId);
        if (!$person) return $this->notFoundResponse();

        $this->validate($request, [
            'qualification_type' => 'required|string',
            'issued_date'        => 'required|date',
            'expiry_date'        => 'required|date|after:issued_date',
        ]);

        $qual = PersonnelQualification::create(array_merge($request->all(), [
            'personnel_id' => $personnelId,
        ]));

        return $this->successResponse($qual, 'Kualifikasi berhasil ditambahkan', 201);
    }

    public function scanPersonnelQr(Request $request)
    {
        $person = Personnel::where('qr_code', $request->qr_code)->with('validQualifications')->first();
        if (!$person) return $this->notFoundResponse('QR Code tidak ditemukan');
        return $this->successResponse($person);
    }

    public function scanPersonnelNfc(Request $request)
    {
        $person = Personnel::where('nfc_tag_id', $request->nfc_tag_id)->with('validQualifications')->first();
        if (!$person) return $this->notFoundResponse('NFC Tag tidak ditemukan');
        return $this->successResponse($person);
    }

    // ================================================================
    // EQUIPMENT
    // ================================================================

    public function indexEquipment(Request $request)
    {
        $query = Equipment::with('validCertifications');
        if ($request->has('type'))   $query->byType($request->type);
        if ($request->has('active')) $query->active();
        if ($request->has('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('equipment_id', 'like', "%{$term}%");
            });
        }

        return $this->paginatedResponse($query->orderBy('name')->paginate($request->get('per_page', 15)));
    }

    public function showEquipment($id)
    {
        $equip = Equipment::with(['certifications', 'workPermits' => fn($q) => $q->latest()->limit(10)])->find($id);
        if (!$equip) return $this->notFoundResponse();
        return $this->successResponse($equip);
    }

    public function storeEquipment(Request $request)
    {
        $this->validate($request, [
            'equipment_id' => 'required|string|unique:equipment,equipment_id',
            'name'         => 'required|string|max:255',
            'type'         => 'required|string',
        ]);
        $equip = Equipment::create($request->all());
        return $this->successResponse($equip, 'Peralatan berhasil ditambahkan', 201);
    }

    public function updateEquipment(Request $request, $id)
    {
        $equip = Equipment::find($id);
        if (!$equip) return $this->notFoundResponse();
        $equip->update($request->all());
        return $this->successResponse($equip->fresh());
    }

    public function addCertification(Request $request, $equipmentId)
    {
        $equip = Equipment::find($equipmentId);
        if (!$equip) return $this->notFoundResponse();

        $this->validate($request, [
            'certification_type' => 'required|string',
            'issued_date'        => 'required|date',
            'expiry_date'        => 'required|date|after:issued_date',
        ]);

        $cert = EquipmentCertification::create(array_merge($request->all(), [
            'equipment_id' => $equipmentId,
        ]));

        return $this->successResponse($cert, 'Sertifikasi berhasil ditambahkan', 201);
    }

    // ================================================================
    // PERMIT TYPES
    // ================================================================

    public function indexPermitTypes()
    {
        return $this->successResponse(PermitType::active()->orderBy('name')->get());
    }

    public function showPermitType($id)
    {
        $type = PermitType::find($id);
        if (!$type) return $this->notFoundResponse();
        return $this->successResponse($type);
    }

    public function storePermitType(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|string|unique:permit_types,code',
            'name' => 'required|string|max:255',
        ]);
        $type = PermitType::create($request->all());
        return $this->successResponse($type, 'Tipe izin berhasil dibuat', 201);
    }

    public function updatePermitType(Request $request, $id)
    {
        $type = PermitType::find($id);
        if (!$type) return $this->notFoundResponse();
        $type->update($request->all());
        return $this->successResponse($type->fresh());
    }
}
