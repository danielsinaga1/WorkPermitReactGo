<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\UserRole;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    // ============= ROLES =============
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Role::with('permissions')->get(),
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'success' => true,
            'data' => Role::with(['permissions', 'users'])->findOrFail($id),
        ]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:roles',
            'name' => 'required|string',
            'permission_ids' => 'array',
        ]);

        return DB::transaction(function () use ($request) {
            $role = Role::create($request->only(['code', 'name', 'description']));
            if ($request->has('permission_ids')) {
                $role->permissions()->sync($request->permission_ids);
            }
            return response()->json(['success' => true, 'data' => $role->load('permissions')], 201);
        });
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        if ($role->is_system) {
            return response()->json(['success' => false, 'message' => 'Cannot modify system role'], 403);
        }

        return DB::transaction(function () use ($request, $role) {
            $role->update($request->only(['name', 'description']));
            if ($request->has('permission_ids')) {
                $role->permissions()->sync($request->permission_ids);
            }
            return response()->json(['success' => true, 'data' => $role->load('permissions')]);
        });
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        if ($role->is_system) {
            return response()->json(['success' => false, 'message' => 'Cannot delete system role'], 403);
        }
        $role->delete();
        return response()->json(['success' => true]);
    }

    // ============= PERMISSIONS =============
    public function indexPermissions()
    {
        return response()->json([
            'success' => true,
            'data' => Permission::all()->groupBy('module'),
        ]);
    }

    public function storePermission(Request $request)
    {
        $this->validate($request, [
            'code' => 'required|unique:permissions',
            'name' => 'required|string',
            'module' => 'required|string',
        ]);
        $perm = Permission::create($request->all());
        return response()->json(['success' => true, 'data' => $perm], 201);
    }

    // ============= USER ROLE ASSIGNMENT =============
    public function indexUsers(Request $request)
    {
        $query = User::with(['roles' => fn($q) => $q->withPivot('work_area_id', 'expires_at')]);
        if ($request->has('search')) {
            $term = $request->search;
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")->orWhere('email', 'like', "%{$term}%");
            });
        }
        return response()->json([
            'success' => true,
            'data' => $query->orderBy('name')->paginate(50),
        ]);
    }

    public function assignRole(Request $request, $userId)
    {
        $this->validate($request, [
            'role_id' => 'required|exists:roles,id',
        ]);

        $assignment = UserRole::updateOrCreate(
            [
                'user_id' => $userId,
                'role_id' => $request->role_id,
                'work_area_id' => $request->work_area_id,
            ],
            [
                'assigned_at' => now(),
                'expires_at' => $request->expires_at,
            ]
        );
        return response()->json(['success' => true, 'data' => $assignment], 201);
    }

    public function revokeRole($userId, $roleId)
    {
        UserRole::where('user_id', $userId)->where('role_id', $roleId)->delete();
        return response()->json(['success' => true]);
    }

    public function userPermissions($userId)
    {
        $user = User::with('roles.permissions')->findOrFail($userId);
        $perms = $user->roles->flatMap->permissions->pluck('code')->unique()->values();
        return response()->json(['success' => true, 'data' => $perms]);
    }
}
