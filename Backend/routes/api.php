<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/signup',[UserController::class,'signup']
);
Route::post('/verify-email',[UserController::class,'verifyemail']
);
Route::post('/Resendverify-email',[UserController::class,'ResendverifyEmail']
);
Route::post('/login', [UserController::class,'login'])->name('login');;
Route::middleware('auth:sanctum')->post('/logout', [UserController::class,'logoutt']);

Route::post('/forgot-password', [UserController::class,'forogotpassword']);
Route::post('/reset-password/{passtoken}', [UserController::class,'resetpassword']);
Route::middleware('auth:sanctum')->get('/auth-check', [UserController::class,'authcheck']);

Route::get('/sanctum/csrf-cookie', CsrfCookieController::class . '@show')->middleware('web');