<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Product;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function summary()
    {
        // Total sales and customer count for today
        $today = now()->startOfDay();
        $transactions = \App\Models\Transaction::where('created_at', '>=', $today)->get();

        $total_sales = $transactions->sum(function ($tx) {
            return floatval($tx->total);
        });

        $customer_count = $transactions->count();

        // Low stock products (e.g., stock <= 10)
        $low_stock = \App\Models\Product::where('stock', '<=', 10)
            ->get(['id', 'name', 'stock']);

        return response()->json([
            'total_sales' => $total_sales,
            'customer_count' => $customer_count,
            'low_stock' => $low_stock,
        ]);
    }
}
