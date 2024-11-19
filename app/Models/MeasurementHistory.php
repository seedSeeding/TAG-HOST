<?php

namespace App\Models;
use App\Models\Pattern;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeasurementHistory extends Model
{
    use HasFactory;
    protected $table = 'measurement_histories';

  
    protected $fillable = [
        'category',
        'size_id',
        'pattern_id',
        'data',

    ];

    public function pattern()
    {
        return $this->belongsTo(Pattern::class);
    }
}
