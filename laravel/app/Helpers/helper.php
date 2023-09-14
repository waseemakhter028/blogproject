<?php
   
   function getCategory()
   {
       $row = DB::table('categories')->select('name','id')->orderBy('name','ASC')->get();
       return $row;
   }
   
   function getSubCategory($id)
   {
       $row = DB::table('sub_categories')->where('category_id',$id)->select('name','id')->orderBy('name','ASC')->get();
       return $row;
   }

   function getFrontSubCategory($id)
   {
       $row = DB::table('sub_categories')->where('category_id',$id)->select('name','id')->orderBy('name','ASC')->get();
       $subcat_ids = [];
       foreach($row  as $cat):
        $subcat = DB::table('codes')->where('sub_category_id',$cat->id)->first();
        if(!empty($subcat))
        {
             array_push($subcat_ids,$cat->id);
        }
    endforeach;    

    $data  =DB::table('sub_categories')->whereIn('id',$subcat_ids)->where('status',1)->select('name','id')->orderBy('name','ASC')->get();
   
       return $data;
   }


   function dtf($date_string,$format='0'){
    switch ($format) {
      case '1':
      $date = date('m/d/Y H:i:s',strtotime($date_string));
      break;
      case '2':
      #for date only
      $date = date('Y/m/d',strtotime($date_string));
      break;
  
      default:
      $date = date('d-M-Y h:i A',strtotime($date_string));
      break;
    }
    return $date;
  }

?>