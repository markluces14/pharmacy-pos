<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SlackNotifier;

class SlackWebhookController extends Controller
{
    public function sendTransactionNotification(Request $request)
    {
        $data = $request->validate([
            'transaction_id' => 'required|integer',
            'user_name' => 'required|string',
            'total' => 'required|numeric',
            'vat' => 'required|numeric',
            'cash' => 'required|numeric',
            'change' => 'required|numeric',
            'products' => 'required|array',
        ]);

        $productDetails = [];
        foreach ($data['products'] as $item) {
            $name = $item['name'] ?? 'Unknown';
            $qty = $item['quantity'] ?? 0;
            $stock = $item['stock'] ?? 'N/A';
            $productDetails[] = "- *{$name}* (Qty: {$qty}, Stock: {$stock})";
        }

        $message = "*🧾 New Transaction Made!*\n"
            . "*Transaction ID:* #{$data['transaction_id']}\n"
            . "*Cashier:* {$data['user_name']}\n"
            . "*Total:* ₱" . number_format($data['total'], 2) . "\n"
            . "*VAT:* ₱" . number_format($data['vat'], 2) . "\n"
            . "*Cash:* ₱" . number_format($data['cash'], 2) . "\n"
            . "*Change:* ₱" . number_format($data['change'], 2) . "\n"
            . "*Time:* " . now()->format('Y-m-d h:i A') . "\n"
            . "\n*🧪 Products Sold:*\n" . implode("\n", $productDetails);

        SlackNotifier::send($message);

        return response()->json(['message' => 'Notification sent to Slack.']);
    }
}
