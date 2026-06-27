<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentWitness extends Model
{
    protected $fillable = [
        'incident_id', 'personnel_id', 'witness_name',
        'company', 'statement', 'statement_date', 'signature_path',
    ];

    protected $casts = [
        'statement_date' => 'datetime',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }
}
