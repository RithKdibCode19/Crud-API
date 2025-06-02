<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            // Assuming you have a Customer model
            $customers = \App\Models\Customer::all();
            foreach ($customers as $customer) {
                $customer->total_orders = $customer->orders()->count();
            }
            if ($customers->isEmpty()) {
                return response()->json([
                    'message' => 'No customers found'
                ], 404);
            }
            // Return the customers in a JSON response
            return response()->json([
                'message' => 'Data retrieved successfully',
                'customers' => $customers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving data',
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email',
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);
        try {
            $customer = \App\Models\Customer::create($request->all());
            return response()->json([
                'message' => 'Customer created successfully',
                'customer' => $customer
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating customer',
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
        $customer = \App\Models\Customer::find($id);
        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }
        return response()->json([
            'message' => 'Data retrieved successfully',
            'customer' => $customer
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $id,
            'phone' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        $customer = \App\Models\Customer::find($id);
        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        try {
            $customer->update($request->all());
            return response()->json([
                'message' => 'Customer updated successfully',
                'customer' => $customer
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating customer',
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
        $customer = \App\Models\Customer::find($id);
        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found'
            ], 404);
        }

        try {
            $customer->delete();
            return response()->json([
                'message' => 'Customer deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting customer',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
