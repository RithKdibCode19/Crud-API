<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
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

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
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
}
