<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Transaction;
use App\Models\Product;

class DashboardController extends Controller
{
    public function summary()
    {
        $today = Carbon::today();

        $transactions = Transaction::whereDate('created_at', '>=', $today)->get();

        $total_sales = $transactions->sum(fn($tx) => floatval($tx->total));
        $customer_count = $transactions->count();

        $low_stock = Product::where('stock', '<=', 100)->get(['id', 'name', 'stock']);

        return response()->json([
            'total_sales' => $total_sales,
            'customer_count' => $customer_count,
            'low_stock' => $low_stock,
        ]);
    }
}
