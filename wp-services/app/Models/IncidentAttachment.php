<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IncidentAttachment extends Model
{
    protected $fillable = [
        'incident_id', 'file_name', 'file_path',
        'file_type', 'file_size', 'category',
    ];

    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }
}
