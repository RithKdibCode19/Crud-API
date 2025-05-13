<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/product',[ProductController::class,'index'])->name('pro');
Route::post('/product',[ProductController::class,'store'])->name('addpro');
Route::get('/product/{id}',[ProductController::class,'show'])->name('showpro');
Route::post('/product/{id}',[ProductController::class,'update'])->name('edit');
Route::delete('/product/{id}',[ProductController::class,'destroy'])->name('delpro');

