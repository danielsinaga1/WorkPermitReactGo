<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JsaRecord extends Model
{
    protected $fillable = [
        'work_permit_id', 'jsa_template_id', 'steps',
        'prepared_by', 'reviewed_by', 'status', 'approved_at',
    ];

    protected $casts = [
        'steps'       => 'array',
        'approved_at' => 'datetime',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function template()
    {
        return $this->belongsTo(JsaTemplate::class, 'jsa_template_id');
    }
}
