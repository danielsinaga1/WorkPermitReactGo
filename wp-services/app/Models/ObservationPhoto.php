<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObservationPhoto extends Model
{
    protected $fillable = [
        'safety_observation_id', 'photo_path', 'thumbnail_path',
        'caption', 'annotations', 'photo_type', 'sort_order',
    ];

    protected $casts = [
        'annotations' => 'array',
    ];

    public function observation()
    {
        return $this->belongsTo(SafetyObservation::class, 'safety_observation_id');
    }
}
