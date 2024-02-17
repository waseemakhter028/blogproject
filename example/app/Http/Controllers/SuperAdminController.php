<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Session;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;


# load models
use App\Models\SuperAdmin;
use App\Models\Code;
use App\Models\Category;
use App\Models\SubCategory;



class SuperAdminController extends Controller
{

  protected $modalcalled;
  

    public function __construct()
    {

     $this->modalcalled=new SuperAdmin;
    }//__construct method close

  
    protected function index()
    {
         
          if(!empty(session('admin_session_data')['admin_user_id']) )
          {  
              return Redirect::to('/adminpanel/dashboard');             
          }
          else
          {
             Session::flush();   
            return Redirect::to('/adminpanel/login'); 
             exit();
          }
        
    }//index method end


    protected function dashboard()
    {
    	
        $data['cat']=Category::get()->count();
        $data['subcat']=SubCategory::get()->count();
        $data['code']=Code::get()->count();
        $data['latest_cat']=Category::orderBy('id','DESC')->limit(8)->get();

        return view('admin.superadmin.dashboard',$data);
    }//dashboard method end
  

  protected function login(Request $request)
  {
     if(!empty(session('admin_session_data')['admin_user_id']))
       return Redirect::to('/adminpanel'); 

     if($request->isMethod("POST")):
     $email = trim($request->email);
     $password = trim($request->password);
    if($email != "" && $password != "")
    {
      
      $LoginUser = $this->modalcalled->LoginUser($email,$password);
      return response()->json($LoginUser);
    }

    else
    {
         return response()->json(
            [
            'status' =>'401',
            'msg' => 'All fileds required.'
            ]);// all fileds required;
    }
     endif;
     return view('admin.superadmin.login');
  }//login method end

  protected function logout()
  {
   Session::flush();
   return Redirect::to('/adminpanel/login');
   exit();
   }// end of function logout


  protected function changeStatus(Request $request)
  {
   
  
  DB::table($request->table)->where([$request->idcolumn=>$request->id])->update([$request->statuscolumn=>$request->status]);
  return response()->json(
         [
         'status' =>'200',
         'msg' => 'Status Changed.'
         ]);
  }//changesttus method close

}//superadmin controller close
