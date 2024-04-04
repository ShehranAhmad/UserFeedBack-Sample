<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\BaseController;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends BaseController
{
    public function registerUser(RegisterRequest $request) {

        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth_token', ['issue-access-token'], now()->addDays(2))->plainTextToken;

        $cookie = cookie('auth_token', $token, 60 * 48); // 2 day

        return $this->sendResponse($token, 'User Registered Successfully');

    }


    // login a user method
    public function login(LoginRequest $request) {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return $this->sendError('Email or password is incorrect!',401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $cookie = cookie('auth_token', $token, 60 * 24); // 1 day

        return $this->sendResponse($token, 'User Login Successfully');
    }

    // logout a user method
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return $this->sendSuccess('User Logout Successfully');
    }
}
