<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use App\Models\Order;
use Exception;

class ProductController extends Controller
{
    public function index(){
        try{
            $products = Product::all();
            return response()->json([
                'message' => 'Data retrieve success',
                'products' => $products
            ], 200);
        }
        catch(Exception $e){
            return response([
                'message' => 'Error Rule API',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'name'=>'required|string|max:255',
            'price'=>'required|numeric|min:1',
            'qty'=>'required|integer|min:1',
            'status'=>'required|in:active,inactive',
            'image'=>'nullable|image|max:2048',
        ]);

        if($validator->fails()){
            return response([
                'message' => 'Check All field, u has error validator rule',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $products = Product::create([
                'name' =>$request->name,
                'price' =>$request->price,
                'qty' =>$request->qty,
                'status' =>$request->status,
            ]);

            return response([
                'message' => 'Data create success',
                'products' => $products
            ], 201);
        } catch (Exception $e) {
            return response([
                'message' => 'Data create fails',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id){
        $product = Product::find($id);
        if (!$product) {
            return response([
                'message' => 'Product not found'
            ], 404);
        }
        return response([
            'message' => 'Data retrieved successfully',
            'product' => $product
        ], 200);
    }

    public function update($id,Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'qty' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => 'Validation failed. Please check all fields.',
                'errors' => $validator->errors()
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

    public function destroy($id){
        try {
        $product = Product::findOrFail($id);
        $product = Product::where('id', $id)->update([
            'status' => 'inactive'
        ]);

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

    public function getOrders(){
        $orders = Order::all();
        return response([
            'message' => 'Orders retrieved successfully',
            'orders' => $orders
        ], 200);
    }
}
