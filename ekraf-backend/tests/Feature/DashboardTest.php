<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use DatabaseMigrations;

    protected $adminToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $adminLogin = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);
        $this->adminToken = json_decode($adminLogin->response->getContent(), true)['data']['access_token'];
    }

    public function test_admin_can_access_dashboard_stats(): void
    {
        $response = $this->get('/api/dashboard/stats', [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data' => [
                'total_berita',
                'total_pengumuman',
                'total_promosi',
                'total_produk_hukum',
                'total_users',
            ]
        ]);
    }

    public function test_admin_can_get_recent_activities(): void
    {
        $response = $this->get('/api/dashboard/recent', [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data'
        ]);
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $response = $this->get('/api/dashboard/stats');

        $response->seeStatusCode(401);
    }
}
