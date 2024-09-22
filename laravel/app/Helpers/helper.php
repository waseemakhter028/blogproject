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

   function getFrontSubCategory($category_id)
   {
    
    $data = \App\Models\SubCategory::whereHas('codes', function ($query) {
                $query->where('status', 1);
              })->where([
                'category_id' => $category_id,
                'status' => 1
                ])->select('id','name')->orderBy('name')->get();
   
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
