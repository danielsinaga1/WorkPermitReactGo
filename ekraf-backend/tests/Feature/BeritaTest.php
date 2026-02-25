<?php

namespace Tests\Feature;

use App\Models\Berita;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class BeritaTest extends TestCase
{
    use DatabaseMigrations;

    protected $adminToken;
    protected $userToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create admin user
        User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test Admin',
            'email' => 'admin@test.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create regular user
        User::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Test User',
            'email' => 'user@test.com',
            'password' => Hash::make('password123'),
            'role' => 'user',
            'is_active' => true,
        ]);

        // Get tokens
        $adminLogin = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);
        $this->adminToken = json_decode($adminLogin->response->getContent(), true)['data']['access_token'];

        $userLogin = $this->post('/api/auth/login', [
            'email' => 'user@test.com',
            'password' => 'password123',
        ]);
        $this->userToken = json_decode($userLogin->response->getContent(), true)['data']['access_token'];
    }

    public function test_can_get_all_berita(): void
    {
        $response = $this->get('/api/berita');

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data'
        ]);
    }

    public function test_admin_can_create_berita(): void
    {
        $response = $this->post('/api/berita', [
            'title' => 'Test Berita',
            'content' => 'Test content for berita',
            'date' => '2024-01-15',
            'thumbnail' => 'test.jpg',
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(201);
        $response->seeJson([
            'success' => true,
            'message' => 'Berita created successfully',
        ]);
    }

    public function test_user_cannot_create_berita(): void
    {
        $response = $this->post('/api/berita', [
            'title' => 'Test Berita',
            'content' => 'Test content for berita',
            'date' => '2024-01-15',
            'thumbnail' => 'test.jpg',
        ], [
            'Authorization' => 'Bearer ' . $this->userToken,
        ]);

        $response->seeStatusCode(403);
    }

    public function test_can_get_single_berita(): void
    {
        $admin = User::where('email', 'admin@test.com')->first();
        
        $berita = Berita::create([
            'author_id' => $admin->id,
            'title' => 'Test Berita',
            'content' => 'Test content',
            'date' => '2024-01-15',
            'thumbnail' => 'test.jpg',
            'images' => json_encode([]),
            'descriptions' => json_encode([]),
            'is_published' => true,
        ]);

        $response = $this->get('/api/berita/' . $berita->id);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
        ]);
    }

    public function test_admin_can_update_berita(): void
    {
        $admin = User::where('email', 'admin@test.com')->first();
        
        $berita = Berita::create([
            'author_id' => $admin->id,
            'title' => 'Test Berita',
            'content' => 'Test content',
            'date' => '2024-01-15',
            'thumbnail' => 'test.jpg',
            'images' => json_encode([]),
            'descriptions' => json_encode([]),
            'is_published' => true,
        ]);

        $response = $this->put('/api/berita/' . $berita->id, [
            'title' => 'Updated Berita Title',
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
            'message' => 'Berita updated successfully',
        ]);
    }

    public function test_admin_can_delete_berita(): void
    {
        $admin = User::where('email', 'admin@test.com')->first();
        
        $berita = Berita::create([
            'author_id' => $admin->id,
            'title' => 'Test Berita',
            'content' => 'Test content',
            'date' => '2024-01-15',
            'thumbnail' => 'test.jpg',
            'images' => json_encode([]),
            'descriptions' => json_encode([]),
            'is_published' => true,
        ]);

        $response = $this->delete('/api/berita/' . $berita->id, [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
            'message' => 'Berita deleted successfully',
        ]);
    }

    public function test_returns_404_for_nonexistent_berita(): void
    {
        $response = $this->get('/api/berita/99999');

        $response->seeStatusCode(404);
    }
}
