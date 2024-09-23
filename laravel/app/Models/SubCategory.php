<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Code;

class SubCategory extends Model
{
    protected $fillable = [
        'name', 'category_id', 'status',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function codes()
    {
        return $this->hasMany(Code::class);
    }
}
