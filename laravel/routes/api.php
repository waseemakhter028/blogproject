<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\HomeApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/', [HomeApiController::class, 'index']);
Route::get('getsubcat/{id}', [HomeApiController::class, 'getSubCat']);
Route::get('viewcode/{id}', [HomeApiController::class, 'viewCode']);
Route::post('filtercodes', [HomeApiController::class, 'filtercodes']);