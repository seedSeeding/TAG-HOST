<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hat extends Model
{
    use HasFactory;
    protected $fillable = [
        'pattern_id',
        'size_id',
        'strap',
        'body_crown',
        'crown',
        'reason',
        'approval_time',
        'brim',
        'bill',
        'approval_state',
        
        'submit_date',
        'submitted',
        'saved'
    ];
}
