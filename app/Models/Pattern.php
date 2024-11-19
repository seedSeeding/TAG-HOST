<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Glove;
use App\Models\Scarf;
use App\Models\MakerNotification;
use App\Models\Hat;
use App\Models\Size;
class Pattern extends Model
{
    use HasFactory;
    protected $fillable = [
        'category',
        'maker_id',
        'image',
        'pattern_number',
        'name',
        'brand',
        'outer_material',
        'lining_material',
       // 'submitted',
    ];
    public function maker_notifications()
    {
        return $this->hasMany(MakerNotification::class);
    }
    public function sizes()
    {
        return $this->hasMany(Size::class);
    }
    
    public function gloves()
    {
        return $this->hasMany(Glove::class);
    }

    public function scarves()
    {
        return $this->hasMany(Scarf::class);
    }

    public function hats()
    {
        return $this->hasMany(Hat::class);
    }
}
