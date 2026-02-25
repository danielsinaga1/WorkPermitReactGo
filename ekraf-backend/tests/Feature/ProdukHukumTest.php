<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ProdukHukum;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Tests\TestCase;

class ProdukHukumTest extends TestCase
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

    public function test_can_get_all_produk_hukum(): void
    {
        ProdukHukum::create([
            'title' => 'UU Test',
            'author' => 'Presiden RI',
            'date' => '2024-01-01',
            'hits' => 0,
            'file_url' => 'test.pdf',
            'category' => 'undang_undang',
            'is_published' => true,
        ]);

        $response = $this->get('/api/produk-hukum');

        $response->seeStatusCode(200);
        $response->seeJsonStructure([
            'success',
            'data'
        ]);
    }

    public function test_can_filter_produk_hukum_by_category(): void
    {
        ProdukHukum::create([
            'title' => 'UU Test',
            'author' => 'Presiden RI',
            'date' => '2024-01-01',
            'hits' => 0,
            'file_url' => 'test.pdf',
            'category' => 'undang_undang',
            'is_published' => true,
        ]);

        ProdukHukum::create([
            'title' => 'PP Test',
            'author' => 'Presiden RI',
            'date' => '2024-01-01',
            'hits' => 0,
            'file_url' => 'test2.pdf',
            'category' => 'peraturan_pemerintah',
            'is_published' => true,
        ]);

        $response = $this->get('/api/produk-hukum?category=undang_undang');

        $response->seeStatusCode(200);
    }

    public function test_admin_can_create_produk_hukum(): void
    {
        $response = $this->post('/api/produk-hukum', [
            'title' => 'New UU',
            'author' => 'Presiden RI',
            'date' => '2024-01-15',
            'file_url' => 'new-uu.pdf',
            'category' => 'undang_undang',
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->seeStatusCode(201);
        $response->seeJson([
            'success' => true,
        ]);
    }

    public function test_can_get_single_produk_hukum(): void
    {
        $produkHukum = ProdukHukum::create([
            'title' => 'UU Test',
            'author' => 'Presiden RI',
            'date' => '2024-01-01',
            'hits' => 0,
            'file_url' => 'test.pdf',
            'category' => 'undang_undang',
            'is_published' => true,
        ]);

        $response = $this->get('/api/produk-hukum/' . $produkHukum->id);

        $response->seeStatusCode(200);
        $response->seeJson([
            'success' => true,
        ]);
    }

    public function test_hit_counter_increments_on_view(): void
    {
        $produkHukum = ProdukHukum::create([
            'title' => 'UU Test',
            'author' => 'Presiden RI',
            'date' => '2024-01-01',
            'hits' => 0,
            'file_url' => 'test.pdf',
            'category' => 'undang_undang',
            'is_published' => true,
        ]);

        $this->get('/api/produk-hukum/' . $produkHukum->id);

        $updatedProdukHukum = ProdukHukum::find($produkHukum->id);
        $this->assertEquals(1, $updatedProdukHukum->hits);
    }
}
