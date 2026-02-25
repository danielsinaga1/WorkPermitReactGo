<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use DatabaseMigrations;

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
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'message',
            'data' => [
                'access_token',
                'token_type',
                'expires_in',
                'user'
            ]
        ]);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'wrongpassword',
        ]);

        $response->seeStatusCode(401);
        $response->seeJson([
            'success' => false,
        ]);
    }

    public function test_user_cannot_login_without_email(): void
    {
        $response = $this->post('/api/auth/login', [
            'password' => 'password123',
        ]);

        $response->seeStatusCode(422);
    }

    public function test_user_cannot_login_without_password(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
        ]);

        $response->seeStatusCode(422);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $loginResponse = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $token = json_decode($loginResponse->response->getContent(), true)['data']['access_token'];

        $response = $this->get('/api/auth/me', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data' => [
                'id',
                'name',
                'email',
                'role'
            ]
        ]);
    }

    public function test_unauthenticated_user_cannot_get_profile(): void
    {
        $response = $this->get('/api/auth/me');

        $response->seeStatusCode(401);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $loginResponse = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $token = json_decode($loginResponse->response->getContent(), true)['data']['access_token'];

        $response = $this->post('/api/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
        ]);
    }

    public function test_authenticated_user_can_refresh_token(): void
    {
        $loginResponse = $this->post('/api/auth/login', [
            'email' => 'admin@test.com',
            'password' => 'password123',
        ]);

        $token = json_decode($loginResponse->response->getContent(), true)['data']['access_token'];

        $response = $this->post('/api/auth/refresh', [], [
            'Authorization' => 'Bearer ' . $token,
        ]);

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data' => [
                'access_token',
                'token_type',
                'expires_in'
            ]
        ]);
    }
}
