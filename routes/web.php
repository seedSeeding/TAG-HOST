<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*'); 

Route::get('/storage/{path}', function ($path) {
    return response()->file(storage_path("/storage/{$path}"));
})->where('path', '.*');