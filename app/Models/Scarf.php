<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scarf extends Model
{
    use HasFactory;
    protected $fillable = [
        'pattern_id',
        'size_id',
        'body',
        'fringers',
        'edges',
        'reason',
        'approval_time',
        'approval_state',
        'submit_date',
        'submitted',
        'saved',
        
       
    ];
}
