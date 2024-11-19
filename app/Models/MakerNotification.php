<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Pattern;
class MakerNotification extends Model
{
    use HasFactory;
    protected $table = 'maker_notifications';
    protected $fillable = [
        'user_id',    
        'message',   
        'pattern_id',
        'is_read',    
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function pattern()
{
    return $this->belongsTo(Pattern::class);
}

}
