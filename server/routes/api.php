<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\FeedbackController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);

// Protected routes with Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin');
    Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');

    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::get('/transactions', [TransactionController::class, 'index'])->middleware('can:view-transactions');
    Route::post('/transactions', [TransactionController::class, 'store'])->middleware('can:add-transaction');

    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update'])->middleware(config('constants.ROLE_ADMIN_MANAGER'));
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware(config('constants.ROLE_ADMIN_MANAGER'));

    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback', [FeedbackController::class, 'index'])->middleware('can:view-feedback');

    Route::post('/checkout', [TransactionController::class, 'store']);
});
