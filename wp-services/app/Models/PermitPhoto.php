<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitPhoto extends Model
{
    protected $fillable = [
        'work_permit_id', 'photo_path', 'thumbnail_path',
        'photo_type', 'caption',
        'uploaded_by_name', 'uploaded_by_id',
        'gps_latitude', 'gps_longitude',
    ];

    protected $casts = [
        'gps_latitude'  => 'decimal:7',
        'gps_longitude' => 'decimal:7',
    ];

    public function workPermit()
    {
        return $this->belongsTo(WorkPermit::class);
    }

    public function uploader()
    {
        return $this->belongsTo(Personnel::class, 'uploaded_by_id');
    }
}
