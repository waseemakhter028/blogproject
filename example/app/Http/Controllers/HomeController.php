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
        $allcat  = Category::where('status',1)->select('id')->get();
        $category_ids  = [];

        foreach($allcat  as $cat):
            $subcat = SubCategory::where('category_id',$cat->id)->where('status',1)->first();
            if(!empty($subcat))
            {
                $codecheck = Code::where('sub_category_id',$subcat->id)->where('status',1)->first();
                if(!empty($codecheck))
                {
                    array_push($category_ids,$cat->id);
                }

            }
        endforeach;

        $category  = Category::whereIn('id',$category_ids)->where('status',1)->select('id','name')->get()->sortBy('name');



        $codes = Code::where('status',1)->orderBy('id','DESC')->get();

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
        $codes = null;
       if($request->action=='filtercodes')
       {
           $ids = implode(",",$request->subcat_ids);
            $codes  = Code::whereRaw("sub_category_id IN ({$ids})")->orderBy('id','DESC')->get();
       }
       elseif ($request->action=='clearfilter')
       {
        $codes = Code::where('status',1)->orderBy('id','DESC')->get();
       }
       return view('user.ajaxcode')->withcodes($codes);
    }//filtercodes emthod close

}#home controller method close
