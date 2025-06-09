<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($tx) {
                return [
                    'id' => $tx->id,
                    'total' => $tx->total,
                    'vat' => $tx->vat,
                    'cash' => $tx->cash,
                    'change' => $tx->change,
                    'items' => json_decode($tx->items),
                    'user_name' => $tx->user->name ?? null,
                    'created_at' => $tx->created_at,
                ];
            });

        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'total' => 'required|numeric',
            'vat' => 'required|numeric',
            'cash' => 'required|numeric',
            'change' => 'required|numeric',
            'items' => 'required|array',
        ]);

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'total' => $data['total'],
            'vat' => $data['vat'],
            'cash' => $data['cash'],
            'change' => $data['change'],
            'items' => json_encode($data['items']),
        ]);

        return response()->json($transaction, 201);
    }
}
