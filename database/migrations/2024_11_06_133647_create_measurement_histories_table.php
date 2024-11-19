<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('measurement_histories', function (Blueprint $table) {
            $table->id();
            $table->string('category');                
            $table->integer('size_id');                
            $table->foreignId('pattern_id')->constrained('patterns')->onDelete('cascade');
            $table->json('data');                      
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('measurement_histories');
    }
};
