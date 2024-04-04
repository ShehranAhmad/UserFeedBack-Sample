<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FeedBackController;

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


Route::post('/register', [AuthController::class, 'registerUser']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function (){
    Route::post('feedback-save',[FeedBackController::class,'save']);
    Route::post('reply-save',[FeedBackController::class,'saveReply']);
    Route::get('feedback/list',[FeedBackController::class,'list']);
    Route::get('users',[FeedBackController::class,'fetchUsers']);


    Route::post('/logout', [AuthController::class, 'logout']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return response()->json(['status' => true,'data' => $request->user()],200);
});





