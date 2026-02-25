<?php

namespace Tests\Feature;

use App\Models\Subsektor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class SubsektorTest extends TestCase
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

    public function test_can_get_all_subsektors(): void
    {
        Subsektor::create([
            'name' => 'Kuliner',
            'image' => 'kuliner.png',
            'description' => 'Subsektor kuliner',
        ]);

        $response = $this->get('/api/subsektor');

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data'
        ]);
    }

    public function test_admin_can_create_subsektor(): void
    {
        $response = $this->post('/api/subsektor', [
            'name' => 'New Subsektor',
            'image' => 'new.png',
            'description' => 'New subsektor description',
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(201);
        $response->seeJson([
            'success' => true,
        ]);
    }

    public function test_can_get_single_subsektor(): void
    {
        $subsektor = Subsektor::create([
            'name' => 'Kuliner',
            'image' => 'kuliner.png',
            'description' => 'Subsektor kuliner',
        ]);

        $response = $this->get('/api/subsektor/' . $subsektor->id);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
        ]);
    }
}
