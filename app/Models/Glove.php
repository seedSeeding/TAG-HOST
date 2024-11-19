<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Glove extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $fillable = [
        'pattern_id',
        'size_id',
        'palm_shell',
        'black_shell',
        'wrist',
        'approval_time',
        'palm_thumb',
        'back_thumb',
        'reason',
        'index_finger',
        'middle_finger',
        'ring_finger',
        'little_finger',
        'approval_state',
        'submit_date',
        'submitted',
        'saved'
    ];
    public function sizes()
    {
        return $this->belongTo(Size::class);
    }
    
}
