<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FeedBack>
 */
class FeedBackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create();
        $userIds = User::pluck('id')->toArray();
        $randomUserId = $faker->randomElement($userIds);
        $categories = ["Other","Bug","Feature Request"];
        return [
            'title' => $faker->sentence,
            'category' => $faker->randomElement($categories),
            'description' => $faker->paragraph,
            'user_id' => $randomUserId,
        ];
    }
}
