<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Exception;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();
        try {
            return response([
                'message' => 'Data retrieve success',
                'user' => $user
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Error Rule API',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => 'Check All field, u has error validator rule',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
            ]);
            return response([
                'message' => 'Data create success',
                'user' => $user
            ], 201);
        } catch (Exception $e) {
            return response([
                'message' => 'Data create fails',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response([
                'message' => 'Data not found',
            ], 404);
        }
        return response([
            'message' => 'Data found',
            'user' => $user
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'password' => 'required|string|min:8',
            'image' => 'nullable|image|max:2048',
        ]);
        if ($validator->fails()) {
            return response([
                'message' => 'Check All field, u has error validator rule',
                'errors' => $validator->errors()
            ], 422);
        }
        try {
            $user = User::find($id);
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);
            return response([
                'message' => 'Data update success',
                'user' => $user
            ], 200);
        } catch (Exception $e) {
            return response([
                'message' => 'Data update fails',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function destroy($id)
    {
        try {
            $user = User::find($id);
            $user->delete();
            return response([
                'message' => 'Data delete success',
                'user' => $user
            ],200);
        } catch (Exception $e) {
            return response([
                'message' => 'Data delete fails',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
