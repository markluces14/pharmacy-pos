<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SlackNotifier
{
    public static function send(string $message): void
    {
        $webhookUrl = config('services.slack.webhook_url');

        if (!$webhookUrl) {
            Log::warning('Slack webhook URL is not configured.');
            return;
        }

        Http::post($webhookUrl, [
            'text' => $message,
        ]);
    }
}
