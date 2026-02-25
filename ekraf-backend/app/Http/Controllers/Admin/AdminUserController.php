<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    /**
     * List all users with filters.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return $this->paginatedResponse($users);
    }

    /**
     * Get single user detail.
     */
    public function show($id)
    {
        $user = User::with(['organisasi', 'bookings', 'tiketWisatas'])->find($id);

        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        return $this->successResponse($user);
    }

    /**
     * Create a new user (admin can create any role).
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,editor,user,masyarakat,admin_okp,pengelola',
            'nik'      => 'nullable|string|max:20',
            'no_telp'  => 'nullable|string|max:20',
            'alamat'   => 'nullable|string',
        ]);

        $user = User::create([
            'id'       => Str::uuid()->toString(),
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'nik'      => $request->nik,
            'no_telp'  => $request->no_telp,
            'alamat'   => $request->alamat,
            'is_active' => $request->input('is_active', true),
        ]);

        return $this->successResponse($user, 'User berhasil dibuat', 201);
    }

    /**
     * Update a user (role, status, etc).
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        $this->validate($request, [
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'role'     => 'sometimes|in:admin,editor,user,masyarakat,admin_okp,pengelola',
            'nik'      => 'nullable|string|max:20',
            'no_telp'  => 'nullable|string|max:20',
            'alamat'   => 'nullable|string',
            'password' => 'nullable|string|min:6',
        ]);

        $data = $request->only(['name', 'email', 'role', 'nik', 'no_telp', 'alamat']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return $this->successResponse($user, 'User berhasil diperbarui');
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return $this->errorResponse('Tidak dapat menghapus akun sendiri', 403);
        }

        $user->delete();

        return $this->successResponse(null, 'User berhasil dihapus');
    }
}
