<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GloveHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'glove_id',
        'pattern_id',
        'size_id',
        'palm_shell',
        'black_shell',
        'wrist',
        'palm_thumb',
        'back_thumb',
        'index_finger',
        'middle_finger',
        'ring_finger',
        'little_finger',
        'approval_state',
        'approval_time',
        'submit_date',
        'submitted',
        'saved',
        'reason',
    ];

    public function glove()
    {
        return $this->belongsTo(Glove::class);
    }

    public function pattern()
    {
        return $this->belongsTo(Pattern::class);
    }

    public function size()
    {
        return $this->belongsTo(Size::class);
    }
}