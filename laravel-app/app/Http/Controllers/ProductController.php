<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use Exception;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::all();
            return response([
                'message' => 'Products retrieved successfully',
                'products' => $products
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Failed to retrieve products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'qty' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => 'Check All field, u has error validator rule'
            ], 422);
        }
        try {
            $product = Product::create([
                'name' => $request->name,
                'price' => $request->price,
                'qty' => $request->qty,
                'status' => $request->status,
            ]);

            return response([
                'message' => 'Product created successfully',
                'product' => $product
            ], 201);

        } catch (Exception $e) {
            return response([
                'message' => 'Product created failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::findOrFail($id);
            return response([
                'message' => 'Product retrieved successfully',
                'product' => $product
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Product not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'qty' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => 'Check All field, u has error validator rule'
            ], 422);
        }

        try {
            $product = Product::findOrFail($id);
            $product->update([
                'name' => $request->name,
                'price' => $request->price,
                'qty' => $request->qty,
                'status' => $request->status,
            ]);

            return response([
                'message' => 'Product updated successfully',
                'product' => $product
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Product update failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            $product->delete();
            return response([
                'message' => 'Product deleted successfully'
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Product deletion failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
