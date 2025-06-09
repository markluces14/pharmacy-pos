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
        $today = Carbon::today();

        $transactions = Transaction::whereDate('created_at', $today)->get();

        $totalSales = $transactions->sum('total');
        $customerCount = $transactions->count();

        $lowStock = Product::where('stock', '<=', 10)->get(['id', 'name', 'stock']);

        return response()->json([
            'total_sales' => $totalSales,
            'customer_count' => $customerCount,
            'low_stock' => $lowStock,
        ]);
    }
}
