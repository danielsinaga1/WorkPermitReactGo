<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ToolboxAttendee extends Model
{
    protected $fillable = [
        'toolbox_meeting_id', 'personnel_id',
        'attendee_name', 'company', 'position',
        'signature_path', 'is_present', 'signed_at',
    ];

    protected $casts = [
        'is_present' => 'boolean',
        'signed_at'  => 'datetime',
    ];

    public function toolboxMeeting()
    {
        return $this->belongsTo(ToolboxMeeting::class);
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class);
    }
}
