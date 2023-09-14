<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/','HomeController@index');
Route::get('viewcode/{id}','HomeController@viewCode');
Route::post('filtercodes','HomeController@filtercodes');





########admin panel routes##################
Route::group(['prefix' => 'adminpanel'], function () {
    
  Route::any('login', 'SuperAdminController@login');
  Route::get('/','SuperAdminController@index');

  Route::group(['middleware' => ['AdminAuth']], function() {

    Route::any('logout', 'SuperAdminController@logout');

    Route::get('dashboard','SuperAdminController@dashboard');
    Route::post('changestatus', 'SuperAdminController@changeStatus');
   

    ######category controller routes#########
  Route::get('category/list', 'CategoryController@category');
  Route::any('category/add', 'CategoryController@categoryAdd');
  Route::any('category/edit/{id?}', 'CategoryController@categoryEdit');

  Route::get('subcategory/list', 'CategoryController@subcategory');
  Route::any('subcategory/add', 'CategoryController@subcategoryAdd');
  Route::any('subcategory/edit/{id?}', 'CategoryController@subcategoryEdit');

  Route::get('code/list', 'CodeController@code');
  Route::any('code/add', 'CodeController@codeAdd');
  Route::any('code/edit/{id?}', 'CodeController@codeEdit');
  Route::get('code/delete/{id?}','CodeController@codeDelete');
  Route::post('code/subcategory','CodeController@subcategory');
   
  });//for auth routes in admin panel

    
  
});