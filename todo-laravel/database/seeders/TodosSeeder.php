<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = \Faker\Factory::create();
        for ($i=0; $i < 5; $i++) { 
            Todos::create([
                'name' => $faker->name,
                'description' => $faker->setence,
                'status'=>'active',
            ]);
        }
    }
}
