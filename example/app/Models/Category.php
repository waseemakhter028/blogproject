<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCategory;

class Category extends Model
{
    protected $fillable = [
        'name', 'status'
    ];

    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }

    public function subcategory()
    {
        return $this->hasMany(SubCategory::class);
    }
}
