<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Lumen\Auth\Authorizable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, HasFactory, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'nik',
        'no_telp',
        'alamat',
        'email_verified_at',
        'is_active'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'name' => $this->name
        ];
    }

    /**
     * Get the beritas for the user.
     */
    public function beritas()
    {
        return $this->hasMany(Berita::class, 'author_id');
    }

    /**
     * Get the organisasi managed by this user.
     */
    public function organisasi()
    {
        return $this->hasMany(Organisasi::class, 'admin_id');
    }

    /**
     * Get user's bookings.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get user's tiket wisata.
     */
    public function tiketWisatas()
    {
        return $this->hasMany(TiketWisata::class);
    }

    /**
     * Get user's katalog produk (for UMKM owners).
     */
    public function katalogProduks()
    {
        return $this->hasMany(KatalogProduk::class, 'pemilik_id');
    }

    /**
     * Get fasilitas managed by this user (pengelola).
     */
    public function fasilitasManaged()
    {
        return $this->hasMany(Fasilitas::class, 'pengelola_id');
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is editor or admin
     */
    public function isEditor(): bool
    {
        return in_array($this->role, ['admin', 'editor']);
    }

    /**
     * Check if user is pengelola fasilitas
     */
    public function isPengelola(): bool
    {
        return in_array($this->role, ['admin', 'pengelola']);
    }

    /**
     * Check if user is admin OKP
     */
    public function isAdminOKP(): bool
    {
        return in_array($this->role, ['admin', 'admin_okp']);
    }

    /**
     * Check if user can book facilities
     */
    public function canBook(): bool
    {
        return in_array($this->role, ['admin', 'masyarakat', 'admin_okp']);
    }
}
