<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FeedbackController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string|min:5',
        ]);

        $feedback = Feedback::create([
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return response()->json($feedback, 201);
    }

    public function index()
    {
        return Feedback::with('user')->latest()->get();
    }
}
