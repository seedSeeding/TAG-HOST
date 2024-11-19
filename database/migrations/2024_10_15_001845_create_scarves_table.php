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
        Schema::create('scarves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pattern_id')->constrained('patterns')->onDelete('cascade');
            $table->foreignId('size_id')->constrained()->onDelete('cascade'); 
            $table->json('body')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('fringers')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->json('edges')->default(json_encode([
                [
                    'length' => 0.00,
                    'width' => 0.00,
                ]
            ]));
            $table->string('approval_state')->default('pending'); 
            $table->timestamp('approval_time')->nullable();
            $table->string('reason')->nullable();
            $table->timestamp('submit_date')->nullable();
            $table->boolean("submitted")->default(false);
            $table->boolean("saved")->default(false);
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scarves');
    }
};
