<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Code;
use DB;

class HomeApiController extends Controller
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

        $category  = Category::whereIn('id',$category_ids)->where('status',1)->select('id','name')->orderBy('name','ASC')->get();



        $codes = Code::where('status',1)->orderBy('id','DESC')->paginate(6);

         return response()->json( [
          'status'     =>200,
          'categories' => $category,
          'codes'      => $codes
         ]);

    }//index method close

    protected function getSubCat($id=null)
    {

      $row =  getFrontSubCategory($id);
      return response()->json([
          'status'     => 200,
           'data'      => $row
         ]);
    }//getSubCate Method close

    protected function viewCode($id=null)
    {
       $row =  Code::find($id);
       if(empty($row)):
         return response()->json( [
          'status'     => 404,
          'data'       => []
         ]);
       else:
        return response()->json( [
          'status'     => 200,
          'data'       => $row
         ]);
       endif;


    }//view code method close

    protected function filtercodes(Request $request)
    {
        $codes = null;
        $all   = null;
       if($request->action=='filtercodes' && $request->subcat_ids!=null)
       {

           $ids = ($request->subcat_ids!=null) ? implode(",",$request->subcat_ids) : 0000;
            $codes  = Code::whereRaw("sub_category_id IN ({$ids})")->orderBy('id','DESC')->get();
           $all   = 0;
       }
       elseif ($request->action=='clearfilter' || $request->subcat_ids==null)
       {
        $codes = Code::where('status',1)->orderBy('id','DESC')->get();
        $all = 1;
       }

        return response()->json([
          'status'     =>200,
           'data'      => $codes,
           'all'       => $all
         ]);

    }//filtercodes emthod close

}#home controller method close
