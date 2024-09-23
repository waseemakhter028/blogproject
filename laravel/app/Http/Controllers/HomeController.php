<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Code;
use DB;

class HomeController extends Controller
{
    protected function index()
    {
        $category  = Category::whereHas('subCategories', function ($query) {
            $query->where('status', 1);
        })->where('status', 1)->select('id','name')->orderBy('name')->get();

        $codes = Code::where('status',1)->orderBy('id','DESC')->paginate(6);

        return view('user.code')->withcategory($category)->withcodes($codes);
    }//index method close

    protected function viewCode($id=null)
    {
       $row =  Code::findOrFail($id);
       //$related = Code::where('category_id',)->ordeBy('id','DESC')->get();
       return view('user.viewcode')->withrow($row);
    }//view code method close

    protected function filtercodes(Request $request)
    {
       $codes = Code::where('status', 1);

       if($request->action=='filtercodes')
       {
            $ids = $request->subcat_ids ? $request->subcat_ids: [] ;
            $codes = $codes->whereIn("sub_category_id", $ids);
       }
       
       $codes = $codes->orderBy('id','DESC')->get();
       return view('user.ajaxcode')->withcodes($codes);
    }//filtercodes method close

}#home controller method close
