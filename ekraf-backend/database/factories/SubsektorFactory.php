<?php

namespace Database\Factories;

use App\Models\Subsektor;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubsektorFactory extends Factory
{
    protected $model = Subsektor::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'image' => 'subsektor/default.png',
            'description' => $this->faker->sentence(),
        ];
    }
}
