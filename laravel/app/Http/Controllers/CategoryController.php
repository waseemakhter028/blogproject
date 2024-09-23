<?php

namespace App\Http\Controllers;

use App\Category as AppCategory;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;

class CategoryController extends Controller
{
    protected function category()
    {
        $data = Category::query()->latest('id')->paginate(5);
        return view('admin.category.list', compact('data'));
    }//category method close

    protected function categoryAdd(Request $request)
    {
        if($request->isMethod("POST"))
        {
           # Validation Logic
      $rules = [
        'name'              => 'required|string|max:40|unique:categories',
        'status'            => 'required',
    ];
    $messages = [
        'required'        => 'Please Enter :attribute',
        'status.required' => 'Please Select :attribute'
    ];
    
    $this->validate($request,$rules,$messages);
     $category = new Category;
     $category->name = ucwords(strtolower($request->name));
     $category->status= $request->status;
     $save_status = $category->save();
       if($save_status)
       {
               return redirect('adminpanel/category/add')->with('success','Category Added Successfully');
       }
        }//method check if close
        else{
            return view('admin.category.add');
        }
        
    }//categoryadd method close

    protected function categoryEdit($id=null,Request $request)
    {
        if($request->isMethod("POST"))
        {
            $category = Category::findOrFail($request->id);

            $nameRules =  'required|string|max:40|unique:categories,name,'.$request->id;
           # Validation Logic
      $rules = [
        'name'              => $nameRules,
        'status'            => 'required',
    ];
    $messages = [
        'required'        => 'Please Enter :attribute',
        'status.required' => 'Please Select :attribute'
    ];
    
    $this->validate($request,$rules,$messages);
     
     $category->name = ucwords(strtolower($request->name));
     $category->status= $request->status;
     $save_status = $category->save();
       if($save_status)
       {
               return redirect('adminpanel/category/edit/'.$request->id)->with('success','Category Details Updated Successfully');
       }
        }//method check if close
        else{
            $data = Category::findOrFail($id);
            return view('admin.category.edit')->withrow($data);
        }
        
    }//categoryadd method close

    protected function subcategory()
    {
        $data = SubCategory::query()->with('category')->paginate(10);
        return view('admin.subcategory.list', compact('data'));
    }//subcategory method close

    protected function subcategoryAdd(Request $request)
    {
        if($request->isMethod("POST"))
        {
           # Validation Logic
      $rules = [
        'category'          => 'required',
        'name'              => 'required|string|max:40|unique:sub_categories',
        'status'            => 'required',
    ];
    $messages = [
        'required'        => 'Please Enter :attribute',
        'status.required' => 'Please Select :attribute',
        'category.required' => 'Please Select :attribute'
    ];
    
    $this->validate($request,$rules,$messages);
     $category = new SubCategory;
     $category->category_id = $request->category;
     $category->name = ucwords(strtolower($request->name));
     $category->status= $request->status;
     $save_status = $category->save();
       if($save_status)
       {
               return redirect('adminpanel/subcategory/add')->with('success','Sub Category Added Successfully');
       }
        }//method check if close
        else{
            return view('admin.subcategory.add');
        }
        
    }//subcategoryadd method close

    protected function subcategoryEdit($id=null,Request $request)
    {
        if($request->isMethod("POST"))
        {
            $category = SubCategory::findOrFail($request->id);

            $nameRules = 'required|string|max:40|unique:sub_categories,name,'.$request->id;

           # Validation Logic
        $rules = [
            'category'          => 'required',
            'name'              => $nameRules,
            'status'            => 'required',
        ];
        $messages = [
            'required'        => 'Please Enter :attribute',
            'status.required' => 'Please Select :attribute',
            'category.required' => 'Please Select :attribute'
        ];
    
    $this->validate($request,$rules,$messages);
    
    $category->category_id = $request->category;
    $category->name = ucwords(strtolower($request->name));
    $category->status= $request->status;
    $save_status = $category->save();
       if($save_status)
       {
               return redirect('adminpanel/subcategory/edit/'.$request->id)->with('success','Sub Category Details Updated Successfully');
       }
        }//method check if close
        else{
            $data = SubCategory::findOrFail($id);
            return view('admin.subcategory.edit')->withrow($data);
        }
        
    }//subcategoryedit method close


}//categorycontroller close