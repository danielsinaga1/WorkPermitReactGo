<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Login user and return JWT token
     */
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $credentials = $request->only(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return $this->errorResponse('Email atau password salah!', 401);
        }

        $user = auth()->user();

        if (!$user->is_active) {
            auth()->logout();
            return $this->errorResponse('Akun Anda tidak aktif! Silakan hubungi administrator.', 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a new user (admin only)
     */
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'id' => Str::uuid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'masyarakat',
            'is_active' => true,
        ]);

        return $this->successResponse($user, 'User berhasil didaftarkan!', 201);
    }

    /**
     * Get the authenticated User
     */
    public function me()
    {
        return $this->successResponse(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token)
     */
    public function logout()
    {
        auth()->logout();
        return $this->successResponse(null, 'Berhasil logout!');
    }

    /**
     * Refresh a token
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Change password
     */
    public function changePassword(Request $request)
    {
        $this->validate($request, [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Password saat ini salah!', 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return $this->successResponse(null, 'Password berhasil diubah!');
    }

    /**
     * Update authenticated user's profile
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $this->validate($request, [
            'name'    => 'sometimes|string|max:255',
            'nik'     => 'nullable|string|max:20',
            'no_telp' => 'nullable|string|max:20',
            'alamat'  => 'nullable|string',
        ]);

        $user->update($request->only(['name', 'nik', 'no_telp', 'alamat']));

        return $this->successResponse($user, 'Profil berhasil diperbarui!');
    }

    /**
     * Get the token array structure
     */
    protected function respondWithToken($token)
    {
        return $this->successResponse([
            'user' => auth()->user(),
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ], 'Login berhasil!');
    }
}
