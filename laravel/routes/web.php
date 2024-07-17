<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CodeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class, 'index']);
Route::get('viewcode/{id}', [HomeController::class, 'viewCode']);
Route::post('filtercodes', [HomeController::class, 'filtercodes']);

########admin panel routes##################
Route::group(['prefix' => 'adminpanel'], function () {
    
  Route::any('login', [SuperAdminController::class, 'login']);
  Route::get('/', [SuperAdminController::class, 'index']);

  Route::group(['middleware' => ['AdminAuth']], function() {

    Route::any('logout', [SuperAdminController::class, 'logout']);

    Route::get('dashboard', [SuperAdminController::class, 'dashboard']);
    Route::post('changestatus', [SuperAdminController::class, 'changeStatus']);
        ######category controller routes#########
        Route::get('category/list', [CategoryController::class, 'category']);
        Route::any('category/add', [CategoryController::class, 'categoryAdd']);
        Route::any('category/edit/{id?}', [CategoryController::class, 'categoryEdit']);

        Route::get('subcategory/list', [CategoryController::class, 'subcategory']);
        Route::any('subcategory/add', [CategoryController::class, 'subcategoryAdd']);
        Route::any('subcategory/edit/{id?}',  [CategoryController::class, 'subcategoryEdit']);

        Route::get('code/list', [CodeController::class, 'code']);
        Route::any('code/add', [CodeController::class, 'codeAdd']);
        Route::any('code/edit/{id?}', [CodeController::class, 'codeEdit']);
        Route::get('code/delete/{id?}', [CodeController::class, 'codeDelete']);
        Route::post('code/subcategory', [CodeController::class, 'subcategory']);
  });//for auth routes in admin panel
});
