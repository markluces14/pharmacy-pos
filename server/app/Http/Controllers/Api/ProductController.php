<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Product::all());
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'string',
            'stock' => 'integer|min:0',
            'price' => 'numeric|min:0',
        ]);

        $product->update($request->all());
        return response()->json($product);
    }

    public function destroy($id): JsonResponse
    {
        Product::destroy($id);
        return response()->json(null, 204);
    }
}
