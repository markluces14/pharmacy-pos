<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:500',
        ]);

        $response = Http::post('https://hook.eu2.make.com/ya7rb34vgnqw4416ejbxou6y5n7ned16', [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => $response->successful()
                ? 'Thank you for your feedback!'
                : 'Failed to submit feedback',
            'success' => $response->successful()
        ], $response->status());
    }
    public function index()
    {
        return view('feedback.feedback');
    }
}
