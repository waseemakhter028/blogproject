<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\SubCategory;

class Category extends Model
{
    
    public function subcategory()
{
    return $this->hasMany(SubCategory::class, 'category_id', 'id');
}
}
