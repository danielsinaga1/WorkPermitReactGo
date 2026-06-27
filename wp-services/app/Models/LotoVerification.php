<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LotoVerification extends Model
{
    protected $fillable = [
        'loto_procedure_id', 'loto_point_id', 'work_permit_id',
        'verified_by_name', 'verified_by_id', 'verified_at',
        'verification_result', 'remarks', 'method_used',
        'readings', 'photo_evidence_path',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
        'readings'    => 'array',
    ];

    public function procedure()
    {
        return $this->belongsTo(LotoProcedure::class, 'loto_procedure_id');
    }

    public function point()
    {
        return $this->belongsTo(LotoPoint::class, 'loto_point_id');
    }

    public function verifier()
    {
        return $this->belongsTo(Personnel::class, 'verified_by_id');
    }
}
