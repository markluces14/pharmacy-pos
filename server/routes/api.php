<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\API\TransactionController;
use App\Http\Controllers\API\FeedbackController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Api\AuthController;

// Define constants for repeated middleware strings
const ROLE_ADMIN_MANAGER = 'role:admin|manager';

// Public login/logout routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);


Route::middleware('auth:sanctum')->group(function () {
    // Users - only admin
    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin');
    Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');

    // Dashboard
    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Transactions with permission checks
    Route::get('/transactions', [TransactionController::class, 'index'])->middleware('can:view-transactions');
    Route::post('/transactions', [TransactionController::class, 'store'])->middleware('can:add-transaction');

    // Products with role-based access
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store'])->middleware(ROLE_ADMIN_MANAGER);
    Route::put('/products/{id}', [ProductController::class, 'update'])->middleware(ROLE_ADMIN_MANAGER);
    Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware(ROLE_ADMIN_MANAGER);

    // Feedback routes
    Route::post('/feedback', [FeedbackController::class, 'store']);
    Route::get('/feedback', [FeedbackController::class, 'index'])->middleware('can:view-feedback');

    // Checkout (likely duplicates transaction store)
    Route::post('/checkout', [TransactionController::class, 'store']);
});
