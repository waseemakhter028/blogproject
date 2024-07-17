<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Session;

class SuperAdmin extends Model
{
    public function LoginUser($email,$password)
    {
        $passwordmd5 = md5($password);

        $Login = Superadmin::where('email', '=',$email)
                            ->where('password', '=',$passwordmd5)
                            ->get(['id']);            
        if(count($Login) > 0)
        {
            $admin_user_uniqueid = $Login[0]->id;
            $admin_user_status = 1;
            if($admin_user_status == 0)
            {
                return ([
                        'status' =>'401',
                        'msg' => 'Your account is deactivated by admin. Please contact to our support team.'
                        ]);
            }
            else
            {

                $data=[
                    'admin_user_id'=>$Login[0]->id,
                    ];
                Session::put('admin_session_data', $data);

                return ([
                        'status' =>'200',
                        'msg' => 'Signing in ...'
                        ]);   
            }

            
        }
        else
        {
            return ([
                    'status' =>'401',
                    'msg' => 'Invalid e-mail or password.'
                    ]);
        }

    } // end of function LoginUser
}
