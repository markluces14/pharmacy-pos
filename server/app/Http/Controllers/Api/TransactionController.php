<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\Product;
use App\Services\SlackNotifier;
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

        $productDetails = [];

        foreach ($data['items'] as $item) {
            if (isset($item['id'])) {
                $product = Product::find($item['id']);
                if ($product) {
                    $product->stock = max(0, $product->stock - $item['quantity']);
                    $product->save();

                    $productDetails[] = "- *{$product->name}* (Qty: {$item['quantity']}, New Stock: {$product->stock})";
                }
            }
        }

        $message = "*🧾 New Transaction Made!*\n"
            . "*Transaction ID:* #{$transaction->id}\n"
            . "*Cashier:* " . Auth::user()->name . "\n"
            . "*Total:* ₱" . number_format($transaction->total, 2) . "\n"
            . "*VAT:* ₱" . number_format($transaction->vat, 2) . "\n"
            . "*Cash:* ₱" . number_format($transaction->cash, 2) . "\n"
            . "*Change:* ₱" . number_format($transaction->change, 2) . "\n"
            . "*Time:* " . now()->format('Y-m-d h:i A') . "\n"
            . "\n*🧪 Products Sold:*\n" . implode("\n", $productDetails);

        SlackNotifier::send($message);

        return response()->json($transaction, 201);
    }
}
