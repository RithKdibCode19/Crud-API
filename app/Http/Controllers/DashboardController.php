<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboardSummary()
    {
        return response()->json([
            'totalSales' => Order::where('status', 'completed')->sum('total_amount'),
            'orders' => Order::count(),
            'products' => Product::count(),
            'customers' => Customer::count(),
        ]);
    }
}
