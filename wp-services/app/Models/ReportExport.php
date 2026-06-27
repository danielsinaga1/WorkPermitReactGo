<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportExport extends Model
{
    protected $fillable = [
        'report_type', 'format', 'parameters',
        'file_path', 'file_name', 'file_size',
        'status', 'requested_by', 'error_message', 'completed_at',
    ];

    protected $casts = [
        'parameters'   => 'array',
        'completed_at' => 'datetime',
    ];

    public function scopePending($query)
    {
        return $query->whereIn('status', ['queued', 'processing']);
    }
}
