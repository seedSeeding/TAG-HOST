<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Pattern;
use App\Models\Glove;
use App\Models\Scarf;
use App\Models\Hat;
class Size extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
    ];

    public function patterns()
    {
        
        return $this->hasMany(Pattern::class);
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
