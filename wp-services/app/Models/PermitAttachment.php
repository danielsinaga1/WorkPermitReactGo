<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitAttachment extends Model
{
    protected $fillable = [
        'work_permit_id', 'file_name', 'file_path',
        'file_type', 'file_size', 'category', 'uploaded_by',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }
}
